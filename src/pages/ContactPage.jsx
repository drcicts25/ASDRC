import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import {
  SupernovaHero,
  ScrollReveal,
  ConstellationDivider,
  PlaceholderSlot,
  BracketText,
} from '../components/CosmicPrimitives';
import { useSiteConfig } from '../context/SiteConfigContext';

export function ContactPage() {
  const { config } = useSiteConfig();
  const { committee, society } = config;
  const cleanVal = (val) => String(val || '').replace(/^\[|\]$/g, '').trim();
  const toHref = (val) => {
    const cleaned = cleanVal(val);
    if (!cleaned) return '#';
    return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
  };
  const [studentPrivacyMode, setStudentPrivacyMode] = useState(
    Boolean(committee.privacyModeStudentProtection)
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    subject: 'General',
    message: '',
    honeypot: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === 'name' && !value.trim()) return 'Name is required.';
    if (name === 'email') {
      if (!value.trim()) return 'Email is required.';
      if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
    }
    if (name === 'subject' && !value.trim()) return 'Subject is required.';
    if (name === 'message' && !value.trim()) return 'Message is required.';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message),
    };
    setFormErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmittedSuccess(true);
        setFormData({
          name: '',
          email: '',
          school: '',
          subject: 'General',
          message: '',
          honeypot: '',
        });
      } else {
        const data = await res.json();
        setServerError(data.error || 'Could not send message.');
      }
    } catch {
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* HERO BLOCK */}
      <SupernovaHero
        headline="Get in Touch"
        highlightWords={['Touch']}
        subHeadline="Questions about the society, Universal Night or registration? Reach out to us directly, or meet the team behind ASDRC."
        size="medium"
      />

      {/* THE COMMITTEE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="section-label mb-2">THE COMMITTEE</div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Meet the Committee
            </h2>
            <p className="mt-3 text-[#A7CFF2] text-sm sm:text-base leading-relaxed">
              The Astronomical Society of Dharmaraja College is led by its students and guided by our Masters-in-Charge. For any queries about the society or UN &apos;27, contact the relevant office bearer below.
            </p>
          </div>

          {/* Student Privacy Mode Toggle per Section B Page 4 Privacy Note */}
          <div className="surface-card rounded-xl p-3.5 flex items-center justify-between sm:justify-start gap-4">
            <div className="text-xs">
              <div className="font-display font-semibold text-white">Student Privacy Option</div>
              <div className="text-[#A7CFF2]/80">
                {studentPrivacyMode
                  ? 'Showing MIC number & Society email publicly'
                  : 'Showing individual card placeholders'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStudentPrivacyMode(!studentPrivacyMode)}
              className={`px-3 py-1.5 rounded text-xs font-display font-semibold transition-colors shrink-0 ${studentPrivacyMode
                  ? 'bg-[#F2E205] text-[#0D0D0D]'
                  : 'bg-[#0D0D0D] text-[#A7CFF2] border border-[#A7CFF2]/35'
                }`}
            >
              {studentPrivacyMode ? 'Privacy On' : 'Standard View'}
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Office Bearer Contact Cards */}
          <ScrollReveal className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {committee.members.map((member) => {
              const hideStudentDirect = studentPrivacyMode && !member.isStaff;
              return (
                <div
                  key={member.id}
                  className="surface-card rounded-xl p-4 sm:p-5 flex items-start gap-4"
                >
                  {/* Optional round portrait slot on each card */}
                  <div className="shrink-0">
                    {member.portraitUrl ? (
                      <img
                        src={member.portraitUrl}
                        alt={member.role}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-[#A7CFF2]/40"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0D0D0D] border border-dashed border-[#A7CFF2]/40 flex flex-col items-center justify-center text-center"
                        title="Optional round portrait slot"
                      >
                        <span className="text-[9px] text-[#A7CFF2]/80">[Portrait]</span>
                      </div>
                    )}
                  </div>

                  {/* Role, Name, Description, Contact Number & Email */}
                  <div className="flex-grow min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-xs uppercase tracking-wider font-semibold text-[#F2E205]">
                        {member.role}
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base text-white">
                        <BracketText text={member.name} />
                      </span>
                    </div>

                    <p className="text-xs text-[#A7CFF2]/85 leading-relaxed">
                      {member.description}
                    </p>

                    {hideStudentDirect ? (
                      <div className="pt-1 text-xs text-[#F2A007]">
                        <span>Queries via Contact Form or Society Email: </span>
                        <BracketText text={society.email} />
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#A7CFF2]/10 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/90">
                        <div>
                          <span className="text-[#A7CFF2]/70">Phone: </span>
                          <BracketText text={member.phone} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollReveal>

          {/* Column 2: Large Framed Space for the Current Committee Photograph */}
          <ScrollReveal delay={120} className="lg:col-span-6 lg:sticky lg:top-24 space-y-6">
            <div className="surface-card rounded-2xl p-5 sm:p-7">
              <PlaceholderSlot
                title={committee.photoPlaceholder || '[Insert current committee photograph]'}
                imageUrl={committee.photoUrl}
                className="min-h-[240px] sm:min-h-[340px]"
              />

              <div className="mt-5 space-y-1.5 border-t border-[#A7CFF2]/15 pt-4">
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  <BracketText text={committee.caption} />
                </h3>
                <p className="text-xs sm:text-sm text-[#A7CFF2]">
                  <BracketText text={committee.standingLine} />
                </p>
                <p className="text-xs sm:text-sm text-[#A7CFF2]">
                  <BracketText text={committee.seatedLine} />
                </p>
              </div>
            </div>

            {/* Structured Reference Table of Office Bearers */}
            <div className="surface-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[460px]">
                  <thead>
                    <tr className="border-b border-[#A7CFF2]/15 bg-[#0D0D0D] text-[#A7CFF2]">
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Contact number</th>
                      <th className="py-3 px-4">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A7CFF2]/10">
                    {committee.members.slice(0, 5).map((m) => (
                      <tr key={m.id}>
                        <td className="py-2.5 px-4 font-medium text-white">{m.role}</td>
                        <td className="py-2.5 px-3">
                          <BracketText text={m.name} />
                        </td>
                        <td className="py-2.5 px-3">
                          <BracketText
                            text={studentPrivacyMode && !m.isStaff ? '[Via Contact Form]' : m.phone}
                          />
                        </td>
                        <td className="py-2.5 px-4">
                          <BracketText
                            text={studentPrivacyMode && !m.isStaff ? society.email : m.email}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ConstellationDivider />

      {/* CONTACT THE SOCIETY & THE SCHOOL */}
      <section id="contact-socials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16">
        <ScrollReveal>
          <div className="observatory-grid grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden">
            {/* The Society */}
            <div className="observatory-cell p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <div className="section-label mb-1">CONTACT THE SOCIETY</div>
                  <h3 className="font-display text-2xl font-bold text-white">The Society</h3>
                </div>

                <dl className="space-y-3.5 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-28 shrink-0">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${cleanVal(society.email)}`}
                        className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/35 underline-offset-4"
                      >
                        {cleanVal(society.email)}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-28 shrink-0">Facebook</dt>
                    <dd>
                      <a
                        href={toHref(society.socials?.facebook)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/35 underline-offset-4 break-all"
                      >
                        {cleanVal(society.socials?.facebook)}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-28 shrink-0">Instagram</dt>
                    <dd>
                      <a
                        href={toHref(society.socials?.instagram)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/35 underline-offset-4 break-all"
                      >
                        {cleanVal(society.socials?.instagram)}
                      </a>
                    </dd>
                  </div>
                </dl>

                <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#F2E205]/35 space-y-1.5">
                  <div className="font-display font-bold text-sm text-[#F2E205] flex flex-wrap items-center gap-2">
                    <span>Official UN &apos;27 WhatsApp:</span>
                    <a
                      href={toHref(society.socials?.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#F2E205]/40 underline-offset-4 break-all"
                    >
                      {cleanVal(society.socials?.whatsapp)}
                    </a>
                  </div>
                  <p className="text-xs text-[#A7CFF2] italic">
                    Join for official announcements, updates and quick queries about UN &apos;27.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <a href="#send-message-form" className="btn-primary !py-2 !px-4 !min-h-[38px] text-xs">
                  <span>Email Us</span>
                </a>
                <a
                  href={toHref(society.socials?.facebook)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 !px-4 !min-h-[38px] text-xs"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={toHref(society.socials?.instagram)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 !px-4 !min-h-[38px] text-xs"
                >
                  <span>Instagram</span>
                </a>
                <a
                  href={toHref(society.socials?.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 !px-4 !min-h-[38px] text-xs !border-[#F2E205]/60 !text-[#F2E205] hover:!bg-[#F2E205] hover:!text-[#0D0D0D]"
                >
                  <span>Join UN &apos;27 WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* The School */}
            <div className="observatory-cell p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div>
                  <div className="section-label mb-1">THE SCHOOL</div>
                  <h3 className="font-display text-2xl font-bold text-white">Dharmaraja College</h3>
                </div>

                <dl className="space-y-3.5 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-32 shrink-0">Address</dt>
                    <dd className="text-white/90">{cleanVal(society.address)}</dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-32 shrink-0">
                      School phone
                    </dt>
                    <dd>
                      <a
                        href={`tel:${cleanVal(society.schoolPhone).replace(/\s+/g, '')}`}
                        className="text-white hover:text-[#F2E205] transition-colors"
                      >
                        {cleanVal(society.schoolPhone)}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-32 shrink-0">
                      School email
                    </dt>
                    <dd>
                      <a
                        href={`mailto:${cleanVal(society.schoolEmail)}`}
                        className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/35 underline-offset-4"
                      >
                        {cleanVal(society.schoolEmail)}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <dt className="text-xs uppercase text-[#A7CFF2] sm:w-32 shrink-0">Website</dt>
                    <dd>
                      <a
                        href={toHref(society.schoolWebsite)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:text-[#F2E205] transition-colors underline decoration-[#A7CFF2]/35 underline-offset-4"
                      >
                        {cleanVal(society.schoolWebsite)}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <PlaceholderSlot
                title="[Dharmaraja College Crest Slot]"
                imageUrl={society.logos?.collegeCrest}
                className="min-h-[110px]"
                compact
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <ConstellationDivider />

      {/* VISIT US (EMBEDDED MAP) & SEND US A MESSAGE FORM */}
      <section
        id="send-message-form"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 md:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Visit Us — Embedded Map Pinned to Dharmaraja College, Kandy */}
          <ScrollReveal className="lg:col-span-5 space-y-4">
            <div className="section-label">VISIT US</div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Dharmaraja College, Kandy
            </h3>
            <p className="text-sm sm:text-base text-[#A7CFF2] italic">
              Dharmaraja College, Kandy. Home of the Astronomical Society since 1996.
            </p>

            <div className="surface-card rounded-2xl overflow-hidden p-3">
              <div className="rounded-xl overflow-hidden border border-[#A7CFF2]/20 bg-[#0D0D0D] h-[280px] sm:h-[340px] relative">
                <iframe
                  title="Dharmaraja College, Kandy Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=80.6420%2C7.2830%2C80.6580%2C7.2950&layer=mapnik&marker=7.2889%2C80.6497"
                  className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-125 opacity-85"
                  loading="lazy"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Send Us a Message Form */}
          <ScrollReveal delay={100} className="lg:col-span-7">
            <div className="surface-card rounded-2xl p-6 sm:p-10">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs text-[#A7CFF2]/85 mb-6 leading-relaxed">
                Since the committee members are students, queries can be routed directly through this form to the society email and Master-in-Charge.
              </p>

              {submittedSuccess ? (
                <div className="p-6 sm:p-8 rounded-xl bg-[#0D0D0D] border border-[#F2E205]/50 text-center space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-[#F2E205] mx-auto" />
                  <h4 className="font-display text-xl font-bold text-white">Message Sent</h4>
                  <p className="text-[#A7CFF2] text-sm sm:text-base">
                    Thank you for reaching out! We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="btn-secondary !py-2 !px-5 text-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-hp">Leave this field empty</label>
                    <input
                      id="contact-hp"
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs uppercase tracking-wider text-[#A7CFF2] mb-2"
                      >
                        Name <span className="text-[#F2E205]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-xs text-[#F2A007]">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs uppercase tracking-wider text-[#A7CFF2] mb-2"
                      >
                        Email <span className="text-[#F2E205]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@school.lk"
                        className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-xs text-[#F2A007]">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="contact-school"
                        className="block text-xs uppercase tracking-wider text-[#A7CFF2] mb-2"
                      >
                        School (if applicable)
                      </label>
                      <input
                        id="contact-school"
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        placeholder="e.g. Dharmaraja College, Kandy"
                        className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs uppercase tracking-wider text-[#A7CFF2] mb-2"
                      >
                        Subject <span className="text-[#F2E205]">*</span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F2E205]"
                      >
                        <option value="General">General</option>
                        <option value="UN '27 Registration">UN &apos;27 Registration</option>
                        <option value="Media">Media</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs uppercase tracking-wider text-[#A7CFF2] mb-2"
                    >
                      Message <span className="text-[#F2E205]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your query about ASDRC or Universal Night '27..."
                      className="w-full rounded-lg bg-[#0D0D0D] border border-[#A7CFF2]/30 px-4 py-3 text-sm text-white placeholder-[#A7CFF2]/40 focus:outline-none focus:border-[#F2E205]"
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-xs text-[#F2A007]">{formErrors.message}</p>
                    )}
                  </div>

                  {serverError && (
                    <p className="text-xs text-[#F2A007] bg-[#F2A007]/10 border border-[#F2A007]/30 rounded-lg p-3">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto"
                  >
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
