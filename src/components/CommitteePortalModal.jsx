import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Download,
  BookOpen,
  Calendar,
  Trophy,
  Image as ImageIcon,
  Users,
  Database,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export function CommitteePortalModal() {
  const {
    config,
    updateConfig,
    isSaving,
    isCommitteePortalOpen,
    setIsCommitteePortalOpen,
  } = useSiteConfig();

  const [activeTab, setActiveTab] = useState('guide');
  const [draft, setDraft] = useState(config);
  const [savedNotice, setSavedNotice] = useState(false);
  const [registrationsData, setRegistrationsData] = useState({ count: 0, registrations: [] });

  useEffect(() => {
    setDraft(config);
  }, [config]);

  useEffect(() => {
    if (isCommitteePortalOpen && activeTab === 'registrations') {
      fetch('/api/registrations')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setRegistrationsData(data);
        })
        .catch(() => {});
    }
  }, [isCommitteePortalOpen, activeTab]);

  if (!isCommitteePortalOpen) return null;

  const handleSave = async () => {
    await updateConfig(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="surface-card rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border-[#F2E205]/40">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0D0D0D] border-b border-[#A7CFF2]/20 flex items-center justify-between gap-4">
          <div>
            <span className="section-label !text-[#F2E205]">NO-CODE COMMITTEE MANAGEMENT</span>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white">
              ASDRC Annual Handover Guide &amp; Content Editor
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCommitteePortalOpen(false)}
            className="p-2 rounded-full bg-[#141720] border border-[#A7CFF2]/30 text-[#A7CFF2] hover:text-white"
            aria-label="Close Committee Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 bg-[#141720] border-b border-[#A7CFF2]/15 flex flex-wrap gap-2">
          {[
            { id: 'guide', label: 'Handover Guide', icon: BookOpen },
            { id: 'un26', label: 'UN Dates & Details', icon: Calendar },
            { id: 'champions', label: 'Champions Table', icon: Trophy },
            { id: 'gallery', label: 'Glance Gallery', icon: ImageIcon },
            { id: 'committee', label: 'Committee & Photo', icon: Users },
            { id: 'registrations', label: 'Submissions & CSV Export', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-display font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#F2E205] text-[#0D0D0D]'
                    : 'bg-[#0D0D0D] text-[#A7CFF2] border border-[#A7CFF2]/25 hover:border-[#A7CFF2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 text-sm">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#F2E205]/40 space-y-2">
                <h3 className="font-display font-bold text-base text-[#F2E205]">
                  Short Handover Guide for Incoming ASDRC Committees
                </h3>
                <p className="text-[#A7CFF2] text-xs sm:text-sm leading-relaxed">
                  This website is designed so the ASDRC committee can update annual content without needing a software developer. You can either use the tabs in this visual editor (which saves directly to <code className="text-[#F2E205]">src/data/siteConfig.json</code>) or edit <code className="text-[#F2E205]">src/data/siteConfig.json</code> directly in any text editor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0D0D0D]/80 border border-[#A7CFF2]/20 space-y-2">
                  <div className="font-display font-bold text-white">
                    1. Updating UN Dates, Venue &amp; Rule Placeholders
                  </div>
                  <p className="text-xs text-[#A7CFF2] leading-relaxed">
                    Open the <strong>UN Dates &amp; Details</strong> tab above (or edit the <code className="text-[#F2E205]">&quot;un26&quot;</code> section in <code className="text-[#F2E205]">src/data/siteConfig.json</code>). Replace <code className="text-[#F2A007]">[Date]</code>, <code className="text-[#F2A007]">[Venue]</code>, <code className="text-[#F2A007]">[deadline]</code>, and fee details with the confirmed dates for the year. To update the downloadable Rule Book PDF, drop your signed PDF at <code className="text-[#F2E205]">public/UN27-Rule-Book.pdf</code>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D0D0D]/80 border border-[#A7CFF2]/20 space-y-2">
                  <div className="font-display font-bold text-white">
                    2. Updating the Past Champions Table
                  </div>
                  <p className="text-xs text-[#A7CFF2] leading-relaxed">
                    Open the <strong>Champions Table</strong> tab (or edit <code className="text-[#F2E205]">&quot;champions&quot;</code> in <code className="text-[#F2E205]">siteConfig.json</code>). Add a new row for the latest Universal Night winner with the year, school name, and logo image path/URL.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D0D0D]/80 border border-[#A7CFF2]/20 space-y-2">
                  <div className="font-display font-bold text-white">
                    3. Updating the Glance Gallery (8–12 Photos)
                  </div>
                  <p className="text-xs text-[#A7CFF2] leading-relaxed">
                    Place your event photographs inside the <code className="text-[#F2E205]">public/gallery/</code> folder, then paste the image path (e.g. <code className="text-[#F2A007]">/gallery/un25-1.jpg</code>) and caption in the <strong>Glance Gallery</strong> tab.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0D0D0D]/80 border border-[#A7CFF2]/20 space-y-2">
                  <div className="font-display font-bold text-white">
                    4. Swapping the Annual Committee Photo &amp; Office Bearers
                  </div>
                  <p className="text-xs text-[#A7CFF2] leading-relaxed">
                    After each AGM, place the new single committee photograph in <code className="text-[#F2E205]">public/committee.jpg</code> and update the term (<code className="text-[#F2A007]">[2026/27]</code>), Standing/Seated names, and office bearer contact cards in the <strong>Committee &amp; Photo</strong> tab.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'un26' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'date', label: 'Event Date (e.g. [Date])' },
                { key: 'venue', label: 'Venue (e.g. [Venue])' },
                { key: 'registrationCloses', label: 'Registration Closes Date' },
                { key: 'completedEpisodesNote', label: 'Completed Episodes Note' },
                { key: 'eligibility', label: 'Rule 1: Eligibility Placeholder' },
                { key: 'teamEntryQuota', label: 'Rule 1: Team Entry Quota' },
                { key: 'ageLimitCriteria', label: 'Rule 4: Age/Grade Criteria' },
                { key: 'registrationDeadline', label: 'Rule 5: Registration Deadline' },
                { key: 'competitionFormat', label: 'Rule 7: Format of Competition' },
                { key: 'withdrawalDeadline', label: 'Rule 12: Withdrawal Deadline' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-xs font-display uppercase tracking-wider text-[#A7CFF2] mb-1.5">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    value={draft.un26?.[item.key] || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        un26: { ...prev.un26, [item.key]: e.target.value },
                      }))
                    }
                    className="w-full rounded-xl bg-[#0D0D0D] border border-[#A7CFF2]/30 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F2E205]"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'champions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#A7CFF2]">
                  Add or update past Universal Night champion schools and logo URLs.
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((prev) => ({
                      ...prev,
                      champions: [
                        {
                          id: `champ-${Date.now()}`,
                          year: '[Year]',
                          logoPlaceholder: '[school logo]',
                          logoUrl: '',
                          school: '[School name]',
                        },
                        ...prev.champions,
                      ],
                    }))
                  }
                  className="btn-secondary !py-1.5 !px-3.5 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Champion Row</span>
                </button>
              </div>

              {draft.champions.map((champ, idx) => (
                <div
                  key={champ.id}
                  className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">Year</label>
                    <input
                      type="text"
                      value={champ.year}
                      onChange={(e) => {
                        const copy = [...draft.champions];
                        copy[idx] = { ...copy[idx], year: e.target.value };
                        setDraft((prev) => ({ ...prev, champions: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">School Name</label>
                    <input
                      type="text"
                      value={champ.school}
                      onChange={(e) => {
                        const copy = [...draft.champions];
                        copy[idx] = { ...copy[idx], school: e.target.value };
                        setDraft((prev) => ({ ...prev, champions: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">
                      School Logo URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="/logos/school.png"
                      value={champ.logoUrl || ''}
                      onChange={(e) => {
                        const copy = [...draft.champions];
                        copy[idx] = { ...copy[idx], logoUrl: e.target.value };
                        setDraft((prev) => ({ ...prev, champions: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = draft.champions.filter((_, i) => i !== idx);
                        setDraft((prev) => ({ ...prev, champions: copy }));
                      }}
                      className="p-2 text-[#A7CFF2] hover:text-[#F2A007]"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {draft.gallery.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20 grid grid-cols-1 sm:grid-cols-12 gap-3"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">
                      {item.slotLabel} — Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => {
                        const copy = [...draft.gallery];
                        copy[idx] = { ...copy[idx], category: e.target.value };
                        setDraft((prev) => ({ ...prev, gallery: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    >
                      <option value="Teams in action">Teams in action</option>
                      <option value="Under the stars">Under the stars</option>
                      <option value="Prize giving">Prize giving</option>
                      <option value="Behind the scenes">Behind the scenes</option>
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">Caption</label>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => {
                        const copy = [...draft.gallery];
                        copy[idx] = { ...copy[idx], caption: e.target.value };
                        setDraft((prev) => ({ ...prev, gallery: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">
                      Photograph Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="/gallery/photo-1.jpg"
                      value={item.imageUrl || ''}
                      onChange={(e) => {
                        const copy = [...draft.gallery];
                        copy[idx] = { ...copy[idx], imageUrl: e.target.value };
                        setDraft((prev) => ({ ...prev, gallery: copy }));
                      }}
                      className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'committee' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20">
                <div>
                  <label className="block text-xs uppercase text-[#A7CFF2] mb-1">
                    Committee Photo URL (Single Replaceable Image)
                  </label>
                  <input
                    type="text"
                    placeholder="/committee-2026.jpg"
                    value={draft.committee?.photoUrl || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        committee: { ...prev.committee, photoUrl: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#A7CFF2] mb-1">
                    Photo Caption (e.g. The ASDRC Committee [2026/27])
                  </label>
                  <input
                    type="text"
                    value={draft.committee?.caption || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        committee: { ...prev.committee, caption: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#A7CFF2] mb-1">
                    Standing Line
                  </label>
                  <input
                    type="text"
                    value={draft.committee?.standingLine || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        committee: { ...prev.committee, standingLine: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#A7CFF2] mb-1">
                    Seated Line
                  </label>
                  <input
                    type="text"
                    value={draft.committee?.seatedLine || ''}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        committee: { ...prev.committee, seatedLine: e.target.value },
                      }))
                    }
                    className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {draft.committee?.members?.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20 grid grid-cols-1 sm:grid-cols-4 gap-3"
                  >
                    <div>
                      <div className="text-xs font-display font-bold text-[#F2E205] mt-1">
                        {m.role}
                      </div>
                      <div className="text-[11px] text-[#A7CFF2]">{m.description}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">Name</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => {
                          const copy = [...draft.committee.members];
                          copy[idx] = { ...copy[idx], name: e.target.value };
                          setDraft((prev) => ({
                            ...prev,
                            committee: { ...prev.committee, members: copy },
                          }));
                        }}
                        className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={m.phone}
                        onChange={(e) => {
                          const copy = [...draft.committee.members];
                          copy[idx] = { ...copy[idx], phone: e.target.value };
                          setDraft((prev) => ({
                            ...prev,
                            committee: { ...prev.committee, members: copy },
                          }));
                        }}
                        className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-[#A7CFF2] mb-1">Email</label>
                      <input
                        type="text"
                        value={m.email}
                        onChange={(e) => {
                          const copy = [...draft.committee.members];
                          copy[idx] = { ...copy[idx], email: e.target.value };
                          setDraft((prev) => ({
                            ...prev,
                            committee: { ...prev.committee, members: copy },
                          }));
                        }}
                        className="w-full rounded-lg bg-[#141720] border border-[#A7CFF2]/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/25">
                <div>
                  <div className="font-display font-bold text-white">
                    Total Registered Schools: {registrationsData.count}
                  </div>
                  <div className="text-xs text-[#A7CFF2]">
                    All team registrations are stored in <code className="text-[#F2E205]">server/storage/registrations.json</code> and exported to CSV.
                  </div>
                </div>
                <a
                  href="/api/registrations/export.csv"
                  className="btn-primary !py-2 !px-4 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Spreadsheet (CSV)</span>
                </a>
              </div>

              {registrationsData.registrations.length === 0 ? (
                <div className="p-8 text-center text-[#A7CFF2] bg-[#0D0D0D]/60 rounded-2xl border border-[#A7CFF2]/15">
                  No registrations submitted yet. Submit a registration on the Register page to test!
                </div>
              ) : (
                <div className="space-y-3">
                  {registrationsData.registrations.map((reg) => (
                    <div
                      key={reg.registrationId}
                      className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#A7CFF2]/20 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-mono text-xs text-[#F2E205]">
                          {reg.registrationId}
                        </span>
                        <h4 className="font-display font-bold text-white">
                          {reg.schoolDetails?.school}
                        </h4>
                        <p className="text-xs text-[#A7CFF2]">
                          Society Email: {reg.schoolDetails?.societyEmail} • MIC: {reg.schoolDetails?.micName}
                        </p>
                      </div>
                      <div className="text-xs font-mono text-[#F2A007]">
                        Team A {reg.hasTeamB ? '+ Team B ' : ''}
                        {reg.hasWorkshopTeam ? '+ Workshop' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0D0D0D] border-t border-[#A7CFF2]/20 flex items-center justify-between gap-4">
          <div className="text-xs text-[#A7CFF2]">
            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-[#F2E205] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved to siteConfig.json &amp; live site!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCommitteePortalOpen(false)}
              className="btn-secondary !py-2 !px-5 text-xs"
            >
              Close
            </button>
            {activeTab !== 'guide' && activeTab !== 'registrations' && (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="btn-primary !py-2 !px-5 text-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
