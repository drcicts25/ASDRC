# ASDRC Website & Universal Night '26 — Committee Handover Guide

Welcome to the official website of the **Astronomical Society of Dharmaraja College (ASDRC)** and **Universal Night (UN)**.

This website is built so that each incoming committee after the Annual General Meeting (AGM) can update all annual details, photographs, past champions, and competition rules **without needing a software developer**.

---

## 1. Two Ways to Update Website Content

### Option A: Built-in Visual Committee Editor (No Code Required)
1. Scroll to the bottom footer of any page on the website and click **"Committee Editor & Handover Guide"**.
2. Use the tabs (**UN Dates & Details**, **Champions Table**, **Glance Gallery**, **Committee & Photo**) to update any `[square bracket]` placeholder or image link.
3. Click **Save Changes**. Your changes are written directly to `src/data/siteConfig.json` and update the website immediately.

### Option B: Editing `src/data/siteConfig.json` Directly
All annual data is stored in a single human-readable file: [`src/data/siteConfig.json`](file:///d:/Downloads/ASDRC/src/data/siteConfig.json).

---

## 2. How to Update Specific Sections Each Year

### A. Updating Universal Night Dates, Venue & Rule Placeholders
In `src/data/siteConfig.json` under `"un26"`, replace the bracketed placeholders with the confirmed details for the year:
- `"date"`: e.g. `"October 24, 2026"` (replaces `[Date]`)
- `"venue"`: e.g. `"Dharmaraja College Main Auditorium & Grounds"` (replaces `[Venue]`)
- `"registrationCloses"`: e.g. `"October 10, 2026"` (replaces `[Date]`)
- `"feesAndPayment"`: e.g. `"LKR 2,500 per team via bank transfer before October 10"`

### B. Replacing the Official UN Rule Book PDF
- Save your final signed Rule Book PDF as **`public/UN26-Rule-Book.pdf`**.
- The embedded PDF viewer and **Download PDF** button on Step 1 of the Registration page will automatically serve your file.

### C. Updating the Previous Champions Table
In `src/data/siteConfig.json` under `"champions"`:
1. Place the winning school's crest/logo image inside `public/logos/` (for example, `public/logos/winner-2025.png`).
2. Update the entry in `"champions"`:
   ```json
   {
     "id": "champ-2025",
     "year": "2025",
     "logoPlaceholder": "[school logo]",
     "logoUrl": "/logos/winner-2025.png",
     "school": "Winning School Name"
   }
   ```

### D. Updating the Glance Gallery (8 to 12 Photo Slots)
1. Copy your 8–12 event photographs into `public/gallery/` (e.g., `public/gallery/un-photo-1.jpg`).
2. In `src/data/siteConfig.json` under `"gallery"`, set `"imageUrl": "/gallery/un-photo-1.jpg"` and update the `"caption"` and `"category"` (`"Teams in action"`, `"Under the stars"`, `"Prize giving"`, or `"Behind the scenes"`).

### E. Swapping the Annual Committee Photograph & Office Bearers
After each AGM:
1. Place the new single committee photograph in `public/committee.jpg`.
2. In `src/data/siteConfig.json` under `"committee"`, set:
   - `"photoUrl": "/committee.jpg"`
   - `"caption": "The ASDRC Committee 2026/27"`
   - `"standingLine": "Standing (left to right): ..."`
   - `"seatedLine": "Seated: ..."`
3. Update the `"members"` list with the new Master-in-Charge (MIC), President, Secretary, Vice President, and Vice Secretary names, phone numbers, and emails.
4. **Student Privacy Mode**: Since committee members are students, you can toggle `"privacyModeStudentProtection": true` (or use the toggle on the Contact page) to display only the society email and MIC's phone number publicly while routing student queries through the contact form.

---

## 3. Exporting Registered Teams (Spreadsheet / CSV)

When schools submit the 2-step registration form:
- Registrations are validated and stored in `server/storage/registrations.json`.
- A spreadsheet-ready CSV file is automatically generated at `server/storage/registrations.csv`.
- You can download the CSV anytime from the **Committee Editor -> Submissions & CSV Export** tab or via `http://localhost:3001/api/registrations/export.csv`.

---

## 4. Running the Project Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Backend API Server (Port 3001):
   ```bash
   npm run server
   ```
3. Start the Frontend Development Server (Port 5173):
   ```bash
   npm run dev
   ```
