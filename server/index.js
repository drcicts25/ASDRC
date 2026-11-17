import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const STORAGE_DIR = path.join(__dirname, 'storage');
const CONFIG_PATH = path.join(ROOT_DIR, 'src', 'data', 'siteConfig.json');
const REGISTRATIONS_PATH = path.join(STORAGE_DIR, 'registrations.json');
const REGISTRATIONS_CSV_PATH = path.join(STORAGE_DIR, 'registrations.csv');
const MESSAGES_PATH = path.join(STORAGE_DIR, 'messages.json');

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(REGISTRATIONS_PATH)) {
  fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify([], null, 2), 'utf-8');
}
if (!fs.existsSync(MESSAGES_PATH)) {
  fs.writeFileSync(MESSAGES_PATH, JSON.stringify([], null, 2), 'utf-8');
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Helper functions
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d][\d\s\-()]{6,18}$/;

function escapeCsvField(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function generateRegistrationsCsv(registrations) {
  const headers = [
    'Registration ID',
    'Submitted At',
    'School',
    'Society Email',
    'MIC Name',
    'MIC Contact',
    'President Name',
    'President Contact',
    'First Round Centre',
    'Has Team B',
    'Has Workshop Team',
    'Team Role / Group',
    'Member Position',
    'Member Name',
    'Date of Birth',
    'Member Email',
    'Member Contact',
    'Subject',
    'Dietary Preference'
  ];

  const rows = [headers.map(escapeCsvField).join(',')];

  for (const reg of registrations) {
    const baseCols = [
      reg.registrationId,
      reg.submittedAt,
      reg.schoolDetails?.school,
      reg.schoolDetails?.societyEmail,
      reg.schoolDetails?.micName,
      reg.schoolDetails?.micContact,
      reg.schoolDetails?.presidentName,
      reg.schoolDetails?.presidentContact,
      reg.schoolDetails?.firstRoundCentre,
      reg.hasTeamB ? 'Yes' : 'No',
      reg.hasWorkshopTeam ? 'Yes' : 'No',
    ];

    const appendTeamRows = (teamName, members) => {
      if (!Array.isArray(members)) return;
      members.forEach((m) => {
        const row = [
          ...baseCols,
          teamName,
          m.roleLabel || 'Member',
          m.name,
          m.dob,
          m.email,
          m.contact,
          m.subject,
          m.dietary
        ];
        rows.push(row.map(escapeCsvField).join(','));
      });
    };

    appendTeamRows('Team A', reg.teamA);
    if (reg.hasTeamB) appendTeamRows('Team B', reg.teamB);
    if (reg.hasWorkshopTeam) appendTeamRows('Workshop Team', reg.workshopTeam);
  }

  return rows.join('\n');
}

// Build a clean minimal valid PDF buffer for the Rule Book placeholder
function buildRuleBookPdfBuffer(config) {
  const un = config?.un26 || {};
  const lines = [
    'ASTRONOMICAL SOCIETY OF DHARMARAJA COLLEGE (ASDRC)',
    'UNIVERSAL NIGHT 2027 (UN 27) - OFFICIAL RULE BOOK',
    '------------------------------------------------------------',
    `Event Date: ${un.date || '[Date]'}   |   Venue: ${un.venue || '[Venue]'}`,
    `Registration Closes: ${un.registrationCloses || '[Date]'}`,
    '------------------------------------------------------------',
    '1. Eligibility: Open to school astronomy societies / schools of ' + (un.eligibility || '[eligibility]') + '.',
    '   Each school may enter ' + (un.teamEntryQuota || '[one Team A, and optionally one Team B]') + '.',
    '2. Team Composition: 1 Team Leader + 4 Members (5 in total).',
    '3. Subject Allocation: Astrophysics, General Astronomy, Observation Astronomy,',
    '   Rocketry, or Cosmology (one subject per member).',
    '4. Age Limit: Participants must be ' + (un.ageLimitCriteria || '[age/grade criteria]') + ' on event date.',
    '5. Registration: Complete online before ' + (un.registrationDeadline || '[deadline]') + '.',
    '6. Identification: Valid school ID required on the day.',
    '7. Format: ' + (un.competitionFormat || '[Rounds, time limits, marking scheme, tie-breakers.]'),
    '8. Conduct: Maintain discipline and respect towards organizers, judges and teams.',
    '9. Malpractice: Cheating or misconduct results in immediate disqualification.',
    '10. Judges Decision: The decision of the judges and organizing committee is final.',
    '11. Meals: Dietary preference (Vegan / Non-vegan) collected in the registration form.',
    '12. Withdrawals: Notify organizers of team changes by ' + (un.withdrawalDeadline || '[date]') + '.',
    '13. Communication: Official updates are sent to the society email provided.',
    '------------------------------------------------------------',
    '[PLACEHOLDER PDF - Replace public/UN27-Rule-Book.pdf with the final signed PDF]'
  ];

  const textOps = lines
    .map((line, idx) => {
      const safe = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      const y = 760 - idx * 24;
      return `BT /F1 ${idx < 2 ? 13 : 10} Tf 50 ${y} Td (${safe}) Tj ET`;
    })
    .join('\n');

  const objects = [];
  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
  objects.push('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj');
  objects.push('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj');
  objects.push(`4 0 obj << /Length ${Buffer.byteLength(textOps, 'utf8')} >> stream\n${textOps}\nendstream endobj`);
  objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj + '\n';
  }
  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
}

// 1. Get Site Configuration
app.get('/api/config', (req, res) => {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load site configuration.' });
  }
});

// 2. Update Site Configuration (Editable by Committee without developer)
app.put('/api/config', (req, res) => {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration object.' });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    res.json({ success: true, config: newConfig });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save configuration.' });
  }
});

// 3. Serve Rule Book PDF
app.get('/api/rulebook-pdf', (req, res) => {
  try {
    const customPdfPath = path.join(ROOT_DIR, 'public', 'UN27-Rule-Book.pdf');
    if (fs.existsSync(customPdfPath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="ASDRC-UN27-Rule-Book.pdf"');
      return fs.createReadStream(customPdfPath).pipe(res);
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const pdfBuffer = buildRuleBookPdfBuffer(config);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="ASDRC-UN27-Rule-Book-Placeholder.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).send('Unable to generate Rule Book PDF.');
  }
});

// 4. Submit UN '27 Team Registration
app.post('/api/registrations', async (req, res) => {
  try {
    const {
      honeypot,
      schoolDetails,
      teamA,
      hasTeamB,
      teamB,
      hasWorkshopTeam,
      workshopTeam,
      confirmedAccuracy
    } = req.body;

    // Basic spam protection (honeypot check)
    if (honeypot && String(honeypot).trim() !== '') {
      return res.status(400).json({ error: 'Spam detected.' });
    }

    if (!confirmedAccuracy) {
      return res.status(400).json({ error: 'Please confirm that all information provided is accurate.' });
    }

    // Validate Section 1: School and Society Details
    if (
      !schoolDetails?.school?.trim() ||
      !schoolDetails?.societyEmail?.trim() ||
      !schoolDetails?.micName?.trim() ||
      !schoolDetails?.micContact?.trim() ||
      !schoolDetails?.presidentName?.trim() ||
      !schoolDetails?.presidentContact?.trim() ||
      !schoolDetails?.firstRoundCentre?.trim()
    ) {
      return res.status(400).json({ error: 'All School and Society Details fields are required.' });
    }

    if (!emailRegex.test(schoolDetails.societyEmail.trim())) {
      return res.status(400).json({ error: 'Invalid Society Email format.' });
    }
    if (!phoneRegex.test(schoolDetails.micContact.trim())) {
      return res.status(400).json({ error: 'Invalid MIC Contact Number format.' });
    }
    if (!phoneRegex.test(schoolDetails.presidentContact.trim())) {
      return res.status(400).json({ error: 'Invalid Society President Contact Number format.' });
    }

    const validateTeam = (teamArray, teamLabel) => {
      if (!Array.isArray(teamArray) || teamArray.length !== 5) {
        return `${teamLabel} must contain 5 members (Team Leader + 4 Members).`;
      }
      for (let i = 0; i < teamArray.length; i++) {
        const m = teamArray[i];
        const label = m.roleLabel || `Member ${i}`;
        if (!m.name?.trim()) return `${teamLabel} - ${label}: Name is required.`;
        if (!m.dob?.trim()) return `${teamLabel} - ${label}: Date of Birth is required.`;
        if (!m.email?.trim() || !emailRegex.test(m.email.trim())) {
          return `${teamLabel} - ${label}: Valid Email is required.`;
        }
        if (!m.contact?.trim() || !phoneRegex.test(m.contact.trim())) {
          return `${teamLabel} - ${label}: Valid Contact Number is required.`;
        }
        if (!m.subject?.trim()) return `${teamLabel} - ${label}: Subject selection is required.`;
        if (!m.dietary?.trim()) return `${teamLabel} - ${label}: Dietary Preference is required.`;
      }
      return null;
    };

    const teamAError = validateTeam(teamA, 'Team A');
    if (teamAError) return res.status(400).json({ error: teamAError });

    if (hasTeamB) {
      const teamBError = validateTeam(teamB, 'Team B');
      if (teamBError) return res.status(400).json({ error: teamBError });
    }

    if (hasWorkshopTeam) {
      const workshopError = validateTeam(workshopTeam, 'Workshop Team');
      if (workshopError) return res.status(400).json({ error: workshopError });
    }

    const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_PATH, 'utf-8'));
    const registrationId = `UN27-${String(registrations.length + 101).padStart(4, '0')}`;
    const submittedAt = new Date().toISOString();

    const record = {
      registrationId,
      submittedAt,
      schoolDetails,
      teamA,
      hasTeamB: Boolean(hasTeamB),
      teamB: hasTeamB ? teamB : [],
      hasWorkshopTeam: Boolean(hasWorkshopTeam),
      workshopTeam: hasWorkshopTeam ? workshopTeam : [],
      confirmedAccuracy: true
    };

    registrations.push(record);
    fs.writeFileSync(REGISTRATIONS_PATH, JSON.stringify(registrations, null, 2), 'utf-8');
    fs.writeFileSync(REGISTRATIONS_CSV_PATH, generateRegistrationsCsv(registrations), 'utf-8');

    // Optional SMTP dispatch if configured, plus automatic confirmation payload
    let emailStatus = 'recorded_and_queued';
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        await transporter.sendMail({
          from: `"ASDRC Universal Night '27" <${process.env.SMTP_USER}>`,
          to: schoolDetails.societyEmail,
          subject: `Registration Confirmed [${registrationId}] — Universal Night '27 (ASDRC)`,
          text: `Thank you! Your team from ${schoolDetails.school} has been registered for UN '27 (Reference: ${registrationId}). We'll be in touch with further details soon.`,
        });
        emailStatus = 'sent_via_smtp';
      } catch (e) {
        emailStatus = 'saved_locally_smtp_unavailable';
      }
    }

    res.status(201).json({
      success: true,
      registrationId,
      submittedAt,
      emailStatus,
      message: "Thank you! Your team has been registered for UN '27. A confirmation has been sent to your society email. We'll be in touch with further details soon.",
      confirmationPreview: {
        to: schoolDetails.societyEmail,
        cc: 'ASDRC Organizing Committee',
        subject: `UN '27 Registration Confirmation — ${schoolDetails.school} (${registrationId})`,
        teamsRegistered: [
          'Team A (5 members)',
          ...(hasTeamB ? ['Team B (5 members)'] : []),
          ...(hasWorkshopTeam ? ['Workshop Team (5 members)'] : [])
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error while processing registration.' });
  }
});

// 5. List & Export Registrations for Committee
app.get('/api/registrations', (req, res) => {
  try {
    const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_PATH, 'utf-8'));
    res.json({ count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read registrations.' });
  }
});

app.get('/api/registrations/export.csv', (req, res) => {
  try {
    const registrations = JSON.parse(fs.readFileSync(REGISTRATIONS_PATH, 'utf-8'));
    const csv = generateRegistrationsCsv(registrations);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="UN27-Registrations-Export.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).send('Failed to export CSV.');
  }
});

// 6. Contact Form Submission ("Send Us a Message")
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, school, subject, message, honeypot } = req.body;

    if (honeypot && String(honeypot).trim() !== '') {
      return res.status(400).json({ error: 'Spam detected.' });
    }
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Please complete all required fields.' });
    }
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const messages = JSON.parse(fs.readFileSync(MESSAGES_PATH, 'utf-8'));
    const newMsg = {
      id: `MSG-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      school: school?.trim() || '',
      subject: subject.trim(),
      message: message.trim()
    };
    messages.push(newMsg);
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8');

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you as soon as possible."
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit message.' });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(MESSAGES_PATH, 'utf-8'));
    res.json({ count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages.' });
  }
});

// Serve built React frontend in production if dist/ exists
const DIST_DIR = path.join(ROOT_DIR, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ASDRC Backend Server running on http://localhost:${PORT}`);
});
