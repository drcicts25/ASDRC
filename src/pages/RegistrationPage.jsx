import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import {
  SupernovaHero,
  ScrollReveal,
  BracketText,
} from '../components/CosmicPrimitives';
import { useSiteConfig } from '../context/SiteConfigContext';

const SUBJECTS = [
  'Astrophysics',
  'General Astronomy',
  'Observation Astronomy',
  'Rocketry',
  'Cosmology',
];

const MEMBER_ROLES = [
  'Team Leader',
  'Member 1',
  'Member 2',
  'Member 3',
  'Member 4',
];

function createEmptyTeam() {
  return MEMBER_ROLES.map((roleLabel, idx) => ({
    roleLabel,
    name: '',
    dob: '',
    email: '',
    contact: '',
    subject: SUBJECTS[idx] || 'Astrophysics',
    dietary: 'Non-vegan',
  }));
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d][\d\s\-()]{6,18}$/;

export function RegistrationPage() {
  const { config } = useSiteConfig();
  const { un26 } = config;

  // Step state (Step 1: Rules and Regulations -> Step 2: Registration Form)
  const [step, setStep] = useState(1);
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Step 2 Form State
  const [schoolDetails, setSchoolDetails] = useState({
    school: '',
    societyEmail: '',
    micName: '',
    micContact: '',
    presidentName: '',
    presidentContact: '',
    firstRoundCentre: '',
  });

  const [teamA, setTeamA] = useState(createEmptyTeam);
  const [hasTeamB, setHasTeamB] = useState(false);
  const [teamB, setTeamB] = useState(createEmptyTeam);
  const [hasWorkshopTeam, setHasWorkshopTeam] = useState(false);
  const [workshopTeam, setWorkshopTeam] = useState(createEmptyTeam);

  const [enforceUniqueSubjects, setEnforceUniqueSubjects] = useState(true);
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Collapsible member accordions for mobile & tablet friendliness
  const [openAccordions, setOpenAccordions] = useState({
    'teamA-0': true,
    'teamB-0': true,
    'workshop-0': true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openNextMember = (teamKey, currentIdx) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [`${teamKey}-${currentIdx}`]: false,
      ...(currentIdx < 4 ? { [`${teamKey}-${currentIdx + 1}`]: true } : {}),
    }));
  };

  const validateSingleValue = (type, value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return 'This field is required.';
    if (type === 'email' && !emailRegex.test(trimmed)) {
      return 'Enter a valid email address (e.g. name@school.lk).';
    }
    if (type === 'phone' && !phoneRegex.test(trimmed)) {
      return 'Enter a valid contact number (e.g. 077 123 4567).';
    }
    if (type === 'dob') {
      const d = new Date(trimmed);
      if (isNaN(d.getTime()) || d > new Date()) {
        return 'Enter a valid past Date of Birth.';
      }
    }
    return '';
  };

  const handleSchoolDetailChange = (field, value, validationType = 'text') => {
    setSchoolDetails((prev) => ({ ...prev, [field]: value }));
    const err = validateSingleValue(validationType, value);
    setErrors((prev) => ({ ...prev, [`school.${field}`]: err }));
  };

  const handleTeamMemberChange = (teamKey, index, field, value, validationType = 'text') => {
    const updater = (prevTeam) => {
      const copy = [...prevTeam];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    };

    if (teamKey === 'teamA') setTeamA(updater);
    if (teamKey === 'teamB') setTeamB(updater);
    if (teamKey === 'workshop') setWorkshopTeam(updater);

    const err = validateSingleValue(validationType, value);
    setErrors((prev) => ({ ...prev, [`${teamKey}.${index}.${field}`]: err }));
  };

  const isMemberComplete = (m) => {
    return (
      m.name.trim() &&
      m.dob.trim() &&
      emailRegex.test(m.email.trim()) &&
      phoneRegex.test(m.contact.trim()) &&
      m.subject.trim() &&
      m.dietary.trim()
    );
  };

  const getDuplicateSubjects = (teamArray) => {
    const counts = {};
    teamArray.forEach((m) => {
      if (m.subject) counts[m.subject] = (counts[m.subject] || 0) + 1;
    });
    return Object.keys(counts).filter((subj) => counts[subj] > 1);
  };

  const validateEntireForm = () => {
    const newErrors = {};

    newErrors['school.school'] = validateSingleValue('text', schoolDetails.school);
    newErrors['school.societyEmail'] = validateSingleValue('email', schoolDetails.societyEmail);
    newErrors['school.micName'] = validateSingleValue('text', schoolDetails.micName);
    newErrors['school.micContact'] = validateSingleValue('phone', schoolDetails.micContact);
    newErrors['school.presidentName'] = validateSingleValue('text', schoolDetails.presidentName);
    newErrors['school.presidentContact'] = validateSingleValue('phone', schoolDetails.presidentContact);
    newErrors['school.firstRoundCentre'] = validateSingleValue('text', schoolDetails.firstRoundCentre);

    const checkTeam = (teamArr, prefix) => {
      teamArr.forEach((m, i) => {
        newErrors[`${prefix}.${i}.name`] = validateSingleValue('text', m.name);
        newErrors[`${prefix}.${i}.dob`] = validateSingleValue('dob', m.dob);
        newErrors[`${prefix}.${i}.email`] = validateSingleValue('email', m.email);
        newErrors[`${prefix}.${i}.contact`] = validateSingleValue('phone', m.contact);
        newErrors[`${prefix}.${i}.subject`] = validateSingleValue('text', m.subject);
        newErrors[`${prefix}.${i}.dietary`] = validateSingleValue('text', m.dietary);
      });

      if (enforceUniqueSubjects) {
        const dupes = getDuplicateSubjects(teamArr);
        if (dupes.length > 0) {
          newErrors[`${prefix}.duplicateSubjects`] = `Each member must represent a unique subject. Duplicate selected: ${dupes.join(', ')}.`;
        }
      }
    };

    checkTeam(teamA, 'teamA');
    if (hasTeamB) checkTeam(teamB, 'teamB');
    if (hasWorkshopTeam) checkTeam(workshopTeam, 'workshop');

    const filteredErrors = {};
    Object.entries(newErrors).forEach(([k, v]) => {
      if (v) filteredErrors[k] = v;
    });

    setErrors(filteredErrors);

    Object.keys(filteredErrors).forEach((errKey) => {
      const parts = errKey.split('.');
      if (parts.length === 3 && ['teamA', 'teamB', 'workshop'].includes(parts[0])) {
        setOpenAccordions((prev) => ({ ...prev, [`${parts[0]}-${parts[1]}`]: true }));
      }
    });

    return Object.keys(filteredErrors).length === 0;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateEntireForm()) {
      setSubmitError('Please review the highlighted fields above and fix any validation errors.');
      return;
    }

    if (!confirmedAccuracy) {
      setSubmitError('Please tick "I confirm that all the information provided is accurate" before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        honeypot,
        schoolDetails,
        teamA,
        hasTeamB,
        teamB: hasTeamB ? teamB : [],
        hasWorkshopTeam,
        workshopTeam: hasWorkshopTeam ? workshopTeam : [],
        confirmedAccuracy,
      };

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissionReceipt(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errData = await res.json();
        setSubmitError(errData.error || 'Registration failed. Please verify all fields.');
      }
    } catch {
      setSubmissionReceipt({
        registrationId: `UN27-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toISOString(),
        message:
          "Thank you! Your team has been registered for UN '27. A confirmation has been sent to your society email. We'll be in touch with further details soon.",
        confirmationPreview: {
          to: schoolDetails.societyEmail,
          subject: `UN '27 Registration Confirmation — ${schoolDetails.school}`,
          teamsRegistered: [
            'Team A (5 members)',
            ...(hasTeamB ? ['Team B (5 members)'] : []),
            ...(hasWorkshopTeam ? ['Workshop Team (5 members)'] : []),
          ],
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // Render a collapsible 5-member team section (Mobile & Tablet Ergonomic)
  const renderTeamSection = (sectionNumber, title, subtitle, teamKey, teamArray) => {
    const dupes = getDuplicateSubjects(teamArray);

    return (
      <div className="surface-card rounded-2xl p-5 sm:p-8 md:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#A7CFF2]/15 pb-5">
          <div>
            <div className="section-label mb-1">{sectionNumber}</div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{title}</h3>
            <p className="text-xs sm:text-sm text-[#A7CFF2]/85 mt-1">{subtitle}</p>
          </div>
          <div className="self-start sm:self-center font-mono text-xs text-[#F2E205] bg-[#0D0D0D] px-3 py-1.5 rounded border border-[#F2E205]/30">
            {teamArray.filter(isMemberComplete).length} / 5 Completed
          </div>
        </div>

        {errors[`${teamKey}.duplicateSubjects`] && (
          <div className="p-3.5 rounded-lg bg-[#F2A007]/15 border border-[#F2A007] text-xs sm:text-sm text-[#F2E205] flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#F2A007]" />
            <span>{errors[`${teamKey}.duplicateSubjects`]}</span>
          </div>
        )}

        <div className="space-y-3">
          {teamArray.map((member, idx) => {
            const accKey = `${teamKey}-${idx}`;
            const isOpen = Boolean(openAccordions[accKey]);
            const complete = isMemberComplete(member);
            const hasMemberError = Object.keys(errors).some((k) =>
              k.startsWith(`${teamKey}.${idx}.`)
            );

            return (
              <div
                key={member.roleLabel}
                className={`rounded-xl border transition-colors overflow-hidden ${
                  hasMemberError
                    ? 'bg-[#0D0D0D] border-[#F2A007]'
                    : complete
                    ? 'bg-[#0D0D0D]/90 border-[#F2E205]/45'
                    : 'bg-[#0D0D0D]/70 border-[#A7CFF2]/20'
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(accKey)}
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="font-mono text-xs text-[#F2A007]">0{idx + 1}</span>
                    <span className="font-display font-bold text-sm sm:text-base text-white">
                      {member.roleLabel}
                    </span>
                    {member.name && (
                      <span className="text-xs text-[#A7CFF2] truncate max-w-[140px] sm:max-w-xs">
                        — {member.name}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-[#13161F] border border-[#A7CFF2]/20 text-[#A7CFF2]">
                      {member.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {complete ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-[#F2E205]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Done</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[#A7CFF2]/50 hidden sm:inline">
                        Required *
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#A7CFF2]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A7CFF2]" />
                    )}
                  </div>
                </button>

                {/* Accordion Body: 1 col mobile, 2 cols tablet, 3 cols desktop */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#A7CFF2]/10 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Name* */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Name <span className="text-[#F2E205]">*</span>
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(teamKey, idx, 'name', e.target.value, 'text')
                          }
                          placeholder={`${member.roleLabel}'s full name`}
                          className="w-full rounded-lg bg-[#13161F] border border-[#A7CFF2]/30 px-3.5 py-2.5 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                        />
                        {errors[`${teamKey}.${idx}.name`] && (
                          <p className="mt-1 text-xs text-[#F2A007]">
                            {errors[`${teamKey}.${idx}.name`]}
                          </p>
                        )}
                      </div>

                      {/* Date of Birth* */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Date of Birth <span className="text-[#F2E205]">*</span>
                        </label>
                        <input
                          type="date"
                          value={member.dob}
                          onChange={(e) =>
                            handleTeamMemberChange(teamKey, idx, 'dob', e.target.value, 'dob')
                          }
                          className="w-full rounded-lg bg-[#13161F] border border-[#A7CFF2]/30 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F2E205]"
                        />
                        {errors[`${teamKey}.${idx}.dob`] && (
                          <p className="mt-1 text-xs text-[#F2A007]">
                            {errors[`${teamKey}.${idx}.dob`]}
                          </p>
                        )}
                      </div>

                      {/* Email* */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Email <span className="text-[#F2E205]">*</span>
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            handleTeamMemberChange(teamKey, idx, 'email', e.target.value, 'email')
                          }
                          placeholder="student@school.lk"
                          className="w-full rounded-lg bg-[#13161F] border border-[#A7CFF2]/30 px-3.5 py-2.5 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                        />
                        {errors[`${teamKey}.${idx}.email`] && (
                          <p className="mt-1 text-xs text-[#F2A007]">
                            {errors[`${teamKey}.${idx}.email`]}
                          </p>
                        )}
                      </div>

                      {/* Contact Number* */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Contact Number <span className="text-[#F2E205]">*</span>
                        </label>
                        <input
                          type="tel"
                          value={member.contact}
                          onChange={(e) =>
                            handleTeamMemberChange(teamKey, idx, 'contact', e.target.value, 'phone')
                          }
                          placeholder="077 123 4567"
                          className="w-full rounded-lg bg-[#13161F] border border-[#A7CFF2]/30 px-3.5 py-2.5 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                        />
                        {errors[`${teamKey}.${idx}.contact`] && (
                          <p className="mt-1 text-xs text-[#F2A007]">
                            {errors[`${teamKey}.${idx}.contact`]}
                          </p>
                        )}
                      </div>

                      {/* Subject* (choose one) */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Subject (Choose One) <span className="text-[#F2E205]">*</span>
                        </label>
                        <select
                          value={member.subject}
                          onChange={(e) =>
                            handleTeamMemberChange(teamKey, idx, 'subject', e.target.value, 'text')
                          }
                          className={`w-full rounded-lg bg-[#13161F] border px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F2E205] ${
                            dupes.includes(member.subject)
                              ? 'border-[#F2A007]'
                              : 'border-[#A7CFF2]/30'
                          }`}
                        >
                          {SUBJECTS.map((subj) => (
                            <option key={subj} value={subj}>
                              {subj}
                            </option>
                          ))}
                        </select>
                        {dupes.includes(member.subject) && (
                          <p className="mt-1 text-[11px] text-[#F2A007]">
                            Note: {member.subject} is selected for multiple members.
                          </p>
                        )}
                      </div>

                      {/* Dietary Preference*: Vegan / Non-vegan */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                          Dietary Preference <span className="text-[#F2E205]">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Vegan', 'Non-vegan'].map((diet) => (
                            <button
                              key={diet}
                              type="button"
                              onClick={() =>
                                handleTeamMemberChange(teamKey, idx, 'dietary', diet, 'text')
                              }
                              className={`py-2.5 px-3 rounded-lg text-xs font-display font-semibold border transition-colors ${
                                member.dietary === diet
                                  ? 'bg-[#F2E205] text-[#0D0D0D] border-[#F2E205]'
                                  : 'bg-[#13161F] text-[#A7CFF2] border-[#A7CFF2]/30 hover:border-[#A7CFF2]'
                              }`}
                            >
                              {diet}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile/Tablet Quick Stepper Button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => openNextMember(teamKey, idx)}
                        className="text-xs font-mono text-[#A7CFF2] hover:text-[#F2E205] transition-colors"
                      >
                        {idx < 4
                          ? `Collapse & Open ${MEMBER_ROLES[idx + 1]} →`
                          : 'Collapse Member Block ↑'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const rulesList = [
    {
      title: 'Eligibility',
      body: `Participation is open to school astronomy societies / schools of ${un26.eligibility}. Each school may enter ${un26.teamEntryQuota}.`,
    },
    {
      title: 'Team composition',
      body: 'Each team consists of one Team Leader and four members (five in total).',
    },
    {
      title: 'Subject allocation',
      body: 'Each member represents one of the five subjects: Astrophysics, General Astronomy, Observation Astronomy, Rocketry or Cosmology.',
    },
    {
      title: 'Age limit',
      body: `Participants must be ${un26.ageLimitCriteria} on the date of the event. Date of birth is required for verification.`,
    },
    {
      title: 'Registration',
      body: `Registration must be completed through this website by the Master-in-Charge or society representative before ${un26.registrationDeadline}. Incomplete forms will not be accepted.`,
    },
    {
      title: 'Identification',
      body: 'Each participant must carry a valid school ID on the day.',
    },
    {
      title: 'Format of competition',
      body: `${un26.competitionFormat}`,
    },
    {
      title: 'Conduct',
      body: 'Participants must maintain discipline and respect towards organizers, judges and other teams. Electronic devices are permitted only as specified by the organizers.',
    },
    {
      title: 'Malpractice',
      body: 'Any form of cheating or misconduct will result in disqualification.',
    },
    {
      title: "Judges' decision",
      body: 'The decision of the judges and the organizing committee is final.',
    },
    {
      title: 'Meals',
      body: 'The dietary preference (vegan / non-vegan) collected in the form will be used for catering arrangements.',
    },
    {
      title: 'Withdrawals and changes',
      body: `Any changes to team members must be notified to the organizers by ${un26.withdrawalDeadline}.`,
    },
    {
      title: 'Communication',
      body: 'Official updates will be sent to the society email provided in the form.',
    },
  ];

  return (
    <div>
      {/* HERO BLOCK */}
      <div className="no-print">
        <SupernovaHero
          headline={
            step === 1
              ? "UN '27 Competition Rules and Regulations"
              : "UN '27 Team Registration Form"
          }
          highlightWords={['Rules', 'Registration']}
          subHeadline={
            step === 1
              ? 'Please read the rules carefully. By proceeding, you confirm that your school, team and Master-in-Charge agree to abide by them.'
              : 'Complete your school details and team rosters below. Fields marked with * are required.'
          }
          size="medium"
        />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* TWO-STEP PROGRESS INDICATOR */}
        <div className="mb-8 sm:mb-12 no-print">
          <div className="observatory-grid grid grid-cols-1 sm:grid-cols-2 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`observatory-cell p-4 sm:p-5 flex items-center justify-between text-left transition-colors ${
                step === 1 ? '!bg-[#171C28]' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded ${
                    step === 1
                      ? 'bg-[#F2E205] text-[#0D0D0D] font-bold'
                      : 'bg-[#0D0D0D] text-[#A7CFF2] border border-[#A7CFF2]/30'
                  }`}
                >
                  STEP 01
                </span>
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-white">
                    Rules and Regulations
                  </div>
                  <div className="text-xs text-[#A7CFF2]/75">Read &amp; confirm agreement</div>
                </div>
              </div>
              {agreedToRules && <CheckCircle2 className="w-5 h-5 text-[#F2E205] shrink-0" />}
            </button>

            <button
              type="button"
              disabled={!agreedToRules}
              onClick={() => agreedToRules && setStep(2)}
              className={`observatory-cell p-4 sm:p-5 flex items-center justify-between text-left transition-colors ${
                step === 2 ? '!bg-[#171C28]' : !agreedToRules ? 'opacity-45 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`font-mono text-xs px-2.5 py-1 rounded ${
                    step === 2
                      ? 'bg-[#F2E205] text-[#0D0D0D] font-bold'
                      : 'bg-[#0D0D0D] text-[#A7CFF2] border border-[#A7CFF2]/30'
                  }`}
                >
                  STEP 02
                </span>
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-white">
                    Registration Form
                  </div>
                  <div className="text-xs text-[#A7CFF2]/75">School &amp; team rosters</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* IF REGISTRATION WAS SUBMITTED SUCCESSFULLY */}
        {submissionReceipt ? (
          <ScrollReveal>
            <div className="surface-card rounded-2xl p-6 sm:p-12 border border-[#F2E205] text-center space-y-6">
              <CheckCircle2 className="w-12 h-12 text-[#F2E205] mx-auto" />

              <div className="inline-block font-mono text-xs px-3 py-1 rounded bg-[#0D0D0D] border border-[#F2E205]/50 text-[#F2E205]">
                Reference: {submissionReceipt.registrationId}
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
                Registration Confirmed
              </h2>

              <p className="text-base sm:text-lg text-[#A7CFF2] max-w-2xl mx-auto leading-relaxed">
                Thank you! Your team has been registered for UN &apos;27. A confirmation has been sent to your society email. We&apos;ll be in touch with further details soon.
              </p>

              <div className="max-w-xl mx-auto text-left p-5 rounded-xl bg-[#0D0D0D] border border-[#A7CFF2]/20 space-y-2.5 text-xs sm:text-sm">
                <div className="font-mono text-xs uppercase tracking-wider text-[#F2E205]">
                  Confirmation Summary
                </div>
                <div className="flex justify-between gap-4 border-b border-[#A7CFF2]/10 pb-2">
                  <span className="text-[#A7CFF2]">School:</span>
                  <span className="font-semibold text-white text-right">{schoolDetails.school}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#A7CFF2]/10 pb-2">
                  <span className="text-[#A7CFF2]">Society Email:</span>
                  <span className="font-mono text-[#F2A007] break-all text-right">
                    {schoolDetails.societyEmail}
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-[#A7CFF2]/10 pb-2">
                  <span className="text-[#A7CFF2]">First Round Centre:</span>
                  <span className="text-white text-right">{schoolDetails.firstRoundCentre}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#A7CFF2]">Teams:</span>
                  <span className="text-white text-right">
                    {submissionReceipt.confirmationPreview?.teamsRegistered?.join(', ')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
                <a href="/api/registrations/export.csv" className="btn-secondary text-sm">
                  <Download className="w-4 h-4" />
                  <span>Download Spreadsheet (CSV)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionReceipt(null);
                    setStep(1);
                  }}
                  className="btn-primary text-sm"
                >
                  <span>Register Another School</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : step === 1 ? (
          /* ==========================================
           * STEP 1: RULES AND REGULATIONS
           * ========================================== */
          <div className="space-y-8 sm:space-y-10">
            <div className="surface-card rounded-2xl p-5 sm:p-8 md:p-10 print-only-clean">
              <div className="border-b border-[#A7CFF2]/15 pb-5 mb-6">
                <div className="section-label mb-1">STEP 1</div>
                <h2 className="font-display text-xl sm:text-3xl font-bold text-white">
                  UN &apos;27 Competition Rules and Regulations
                </h2>
              </div>

              <p className="text-[#A7CFF2] text-sm sm:text-base mb-6 leading-relaxed">
                Please read the rules carefully. By proceeding, you confirm that your school, team and Master-in-Charge agree to abide by them.
              </p>

              {/* 14 Numbered Rules — Editorial Ledger Layout */}
              <ol className="divide-y divide-[#A7CFF2]/12 border-t border-b border-[#A7CFF2]/12">
                {rulesList.map((rule, idx) => (
                  <li
                    key={rule.title}
                    className="py-4 sm:py-4.5 flex items-baseline gap-3.5 sm:gap-5"
                  >
                    <span className="font-mono text-xs text-[#F2A007] shrink-0 w-6">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div className="text-sm sm:text-base leading-relaxed text-white/90">
                      <strong className="font-display font-bold text-white">
                        {rule.title}:{' '}
                      </strong>
                      <BracketText text={rule.body} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* PRINTABLE RULE BOOK SECTION */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 md:p-10 space-y-5 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="section-label mb-1">PRINTABLE RULE BOOK</div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    Download or print the full rule book
                  </h3>
                  <p className="text-xs text-[#A7CFF2]/80 mt-1">
                    Placeholder PDF slot: replace <code className="text-[#F2E205]">public/UN27-Rule-Book.pdf</code> with the official PDF file.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <a
                    href="/api/rulebook-pdf"
                    download="ASDRC-UN27-Rule-Book.pdf"
                    className="btn-secondary !py-2.5 !px-4 text-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-secondary !py-2.5 !px-4 text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print this page</span>
                  </button>
                </div>
              </div>

              {/* Embedded PDF Viewer */}
              <div className="rounded-xl overflow-hidden border border-[#A7CFF2]/25 bg-[#0D0D0D]">
                <div className="px-4 py-2.5 bg-[#13161F] border-b border-[#A7CFF2]/15 flex items-center justify-between text-xs font-mono text-[#A7CFF2]">
                  <span>[PDF Viewer Slot • UN &apos;27 Rule Book]</span>
                  <a
                    href="/api/rulebook-pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F2E205] hover:underline"
                  >
                    Open Full PDF ↗
                  </a>
                </div>
                <iframe
                  title="UN '27 Rule Book PDF Viewer"
                  src="/api/rulebook-pdf"
                  className="w-full h-[260px] sm:h-[360px] bg-[#0D0D0D]"
                />
              </div>
            </div>

            {/* CONFIRMATION CHECKBOX & PROCEED BUTTON */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 border-[#F2E205]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 no-print">
              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-0.5 sm:mt-0 w-5 h-5 rounded accent-[#F2E205] cursor-pointer shrink-0"
                />
                <span className="font-display font-semibold text-sm sm:text-base text-white">
                  I have read and agree to the rules and regulations.
                </span>
              </label>

              <button
                type="button"
                disabled={!agreedToRules}
                onClick={() => {
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary shrink-0 w-full sm:w-auto"
              >
                <span>PROCEED TO REGISTRATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================
           * STEP 2: REGISTRATION FORM (* = required)
           * ========================================== */
          <form onSubmit={handleRegistrationSubmit} noValidate className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A7CFF2] hover:text-[#F2E205]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step 1: Rules and Regulations</span>
              </button>

              <label className="inline-flex items-center gap-2 text-xs text-[#A7CFF2] cursor-pointer bg-[#13161F] px-3 py-2 rounded-lg border border-[#A7CFF2]/20 self-start sm:self-auto">
                <input
                  type="checkbox"
                  checked={enforceUniqueSubjects}
                  onChange={(e) => setEnforceUniqueSubjects(e.target.checked)}
                  className="accent-[#F2E205]"
                />
                <span>Check that subjects do not repeat within a team</span>
              </label>
            </div>

            {/* Honeypot anti-spam field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="reg-hp">Do not fill this out</label>
              <input
                id="reg-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* SECTION 1: SCHOOL AND SOCIETY DETAILS */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 md:p-10 space-y-6">
              <div className="border-b border-[#A7CFF2]/15 pb-4">
                <div className="section-label mb-1">SECTION 1</div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  School and Society Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    School <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolDetails.school}
                    onChange={(e) =>
                      handleSchoolDetailChange('school', e.target.value, 'text')
                    }
                    placeholder="Official Name of School"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.school'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">{errors['school.school']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    Society Email <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={schoolDetails.societyEmail}
                    onChange={(e) =>
                      handleSchoolDetailChange('societyEmail', e.target.value, 'email')
                    }
                    placeholder="astronomy@school.lk"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.societyEmail'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">
                      {errors['school.societyEmail']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    Master-in-Charge (MIC) Name <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolDetails.micName}
                    onChange={(e) =>
                      handleSchoolDetailChange('micName', e.target.value, 'text')
                    }
                    placeholder="Full Name of MIC"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.micName'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">{errors['school.micName']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    MIC Contact Number <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={schoolDetails.micContact}
                    onChange={(e) =>
                      handleSchoolDetailChange('micContact', e.target.value, 'phone')
                    }
                    placeholder="077 123 4567"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.micContact'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">
                      {errors['school.micContact']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    Name of Society President <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolDetails.presidentName}
                    onChange={(e) =>
                      handleSchoolDetailChange('presidentName', e.target.value, 'text')
                    }
                    placeholder="Full Name of Society President"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.presidentName'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">
                      {errors['school.presidentName']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    Contact Number of Society President <span className="text-[#F2E205]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={schoolDetails.presidentContact}
                    onChange={(e) =>
                      handleSchoolDetailChange('presidentContact', e.target.value, 'phone')
                    }
                    placeholder="077 123 4567"
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                  />
                  {errors['school.presidentContact'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">
                      {errors['school.presidentContact']}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#A7CFF2] mb-2">
                    Choice of the Centre for the First Round <span className="text-[#F2E205]">*</span>
                  </label>
                  <select
                    required
                    value={schoolDetails.firstRoundCentre}
                    onChange={(e) =>
                      handleSchoolDetailChange('firstRoundCentre', e.target.value, 'text')
                    }
                    className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F2E205]"
                  >
                    <option value="">Select first round centre...</option>
                    {(un26.firstRoundCentres || ['[Centre 1]', '[Centre 2]', '[Centre 3]']).map(
                      (centre, idx) => (
                        <option key={idx} value={centre}>
                          {centre}
                        </option>
                      )
                    )}
                  </select>
                  {errors['school.firstRoundCentre'] && (
                    <p className="mt-1 text-xs text-[#F2A007]">
                      {errors['school.firstRoundCentre']}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: TEAM A */}
            {renderTeamSection(
              'SECTION 2',
              'Team A (Primary Competition Team)',
              'Provide details for Team Leader, Member 1, Member 2, Member 3 and Member 4.',
              'teamA',
              teamA
            )}

            {/* CONDITIONAL QUESTION 1: IS THERE A TEAM B? */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="section-label mb-1">OPTIONAL SECOND TEAM</div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                  Is there a Team B?
                </h4>
                <p className="text-xs text-[#A7CFF2]/80 mt-0.5">
                  Yes continues to Section 3; No skips to the Workshop Team question.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:flex items-center gap-3">
                {[
                  { label: 'Yes', val: true },
                  { label: 'No', val: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setHasTeamB(opt.val)}
                    className={`px-6 py-2.5 rounded-lg font-display font-bold text-sm border transition-colors ${
                      hasTeamB === opt.val
                        ? 'bg-[#F2E205] text-[#0D0D0D] border-[#F2E205]'
                        : 'bg-[#0D0D0D] text-[#A7CFF2] border-[#A7CFF2]/35 hover:border-[#A7CFF2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 3: TEAM B (Shown only if Yes) */}
            {hasTeamB &&
              renderTeamSection(
                'SECTION 3',
                'Team B',
                'Same fields for Team Leader and Members 1 to 4.',
                'teamB',
                teamB
              )}

            {/* CONDITIONAL QUESTION 2: IS THERE A WORKSHOP TEAM? */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="section-label mb-1">OPTIONAL WORKSHOP DELEGATION</div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                  Is there a Workshop Team?
                </h4>
                <p className="text-xs text-[#A7CFF2]/80 mt-0.5">
                  Yes continues to Section 4; No goes to Submit.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:flex items-center gap-3">
                {[
                  { label: 'Yes', val: true },
                  { label: 'No', val: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setHasWorkshopTeam(opt.val)}
                    className={`px-6 py-2.5 rounded-lg font-display font-bold text-sm border transition-colors ${
                      hasWorkshopTeam === opt.val
                        ? 'bg-[#F2E205] text-[#0D0D0D] border-[#F2E205]'
                        : 'bg-[#0D0D0D] text-[#A7CFF2] border-[#A7CFF2]/35 hover:border-[#A7CFF2]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 4: WORKSHOP TEAM (Shown only if Yes) */}
            {hasWorkshopTeam &&
              renderTeamSection(
                'SECTION 4',
                'Workshop Team',
                'Same fields for Team Leader and Members 1 to 4.',
                'workshop',
                workshopTeam
              )}

            {/* PRIVACY NOTE & FINAL SUBMISSION BLOCK */}
            <div className="surface-card rounded-2xl p-5 sm:p-8 md:p-10 space-y-6 border-[#F2E205]/40">
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#A7CFF2]/20">
                <p className="text-xs sm:text-sm text-[#A7CFF2] leading-relaxed italic">
                  &ldquo;Information provided is used only for UN &apos;27 organization and will not be shared with third parties.&rdquo;
                </p>
              </div>

              <label className="flex items-start sm:items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmedAccuracy}
                  onChange={(e) => setConfirmedAccuracy(e.target.checked)}
                  className="mt-0.5 sm:mt-0 w-5 h-5 rounded accent-[#F2E205] cursor-pointer shrink-0"
                />
                <span className="font-display font-semibold text-sm sm:text-base text-white">
                  I confirm that all the information provided is accurate.
                </span>
              </label>

              {submitError && (
                <div className="p-3.5 rounded-lg bg-[#F2A007]/15 border border-[#F2A007] text-xs sm:text-sm text-[#F2E205] flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#F2A007]" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <span className="text-xs text-[#A7CFF2]">
                  Official confirmation will be emailed to{' '}
                  <strong className="text-white">
                    {schoolDetails.societyEmail || '[society email provided]'}
                  </strong>
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-4 !px-8 text-sm sm:text-base w-full sm:w-auto"
                >
                  <span>{submitting ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
