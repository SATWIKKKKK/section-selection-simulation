# KIIT Section Selection Simulation

A browser-based simulator that replicates the pressure and mechanics of KIIT University's SAP portal section/faculty selection process. Students can practice their reaction speed and develop a strategy before the actual selection window opens.

---

## What It Does

When KIIT opens faculty/section selection, hundreds of students compete simultaneously for a limited number of seats in each section. The window is brief, seats drain in real-time, and there is no second chance. This simulator recreates that exact environment so students can rehearse the process, measure their reaction time, and receive a performance grade.

---

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand v5** with `persist` middleware for global state and local storage persistence
- **Vercel Analytics** for usage tracking
- Deployed on **Vercel**

---

## Project Structure

```
app/
  page.tsx                        Landing page (KIIT SAP portal homepage replica)
  login/page.tsx                  Login page (enter Student ID and name)
  portal/
    page.tsx                      Portal home (after login)
    student-self-service/page.tsx Student self-service tile grid
    section-selection/page.tsx    Main simulation page
  result/page.tsx                 Result and attempt history page
  settings/page.tsx               Difficulty and timing settings page

components/
  PortalHeader.tsx                Top navigation bar shared across all portal pages
  PortalSidebar.tsx               Left sidebar navigation (hidden on mobile)
  SimulationSettingsControls.tsx  Shared difficulty/timing controls (used on settings and section-selection pages)
  SectionModal.tsx                The live section selection modal with real-time seat drain
  CountdownTimer.tsx              Animated countdown before the selection window opens
  ReactionTimer.tsx               Displays elapsed time inside the selection modal
  DifficultyCard.tsx              Individual difficulty option card
  AttemptHistoryTable.tsx         Table of past attempts on the result page
  ResultChart.tsx                 Visual chart of attempt history

lib/
  sections.ts                     61 sections plus the 5th-semester Elective 1 and Elective 2 option lists
  grading.ts                      Grade computation logic based on reaction time

store/
  simStore.ts                     Zustand store: credentials, difficulty, runtime window state, attempt history
```

---

## How to Run Locally

**Prerequisites:** Node.js 18 or later.

```bash
git clone https://github.com/SATWIKKKKK/section-selection-simulation.git
cd section-selection-simulation
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Full User Flow

### 1. Landing Page (`/`)

A replica of the KIIT SAP portal homepage. Click "Click here to Login" to enter the portal.

### 2. Portal Home (`/portal`)

Replica of the SAP portal overview screen. Navigate via the header tabs or sidebar.

### 3. Student Self Service (`/portal/student-self-service`)

Tile grid replicating the self-service module. Click the section selection tile to enter the simulation.

### 4. Section Selection (`/portal/section-selection`)

This is the core of the simulator. The flow is:

1. **Adjust difficulty** (optional): Use the settings panel at the top to select Easy, Normal, Hard, or Custom before choosing a semester. This sets the length of the selection window.
2. **Choose semester**: Select 3rd or 5th semester.
3. **3rd semester**: The original 10-second countdown runs, then the timed section popup opens automatically with CSE-01 through CSE-61.
4. **5th semester**: A subject table is shown and no popup opens automatically. The student clicks each enabled `Click Here` button to complete, in order:
   - Section selection from 61 sections
   - Elective 1 from High Performance Computing or Distributed Operating Systems
   - Elective 2 from Compiler Design, Data Mining & Data Warehousing, Privacy and Security in IoT, or Computational Intelligence
5. **Optional opening mode**: Choose Instant Mode or Opening Wait Simulation. Waiting mode supports 1, 2, 5, or custom minutes, stores an absolute opening timestamp in the tab session, and keeps every `Click Here` action hidden until the countdown ends.
6. **Panel reload practice**: During the opening countdown, Reload Selection Panel replaces only the central selection content with a short skeleton. The portal header, sidebar, semester, difficulty, and original opening timestamp remain untouched.
7. **Elective numbered sections**: Choosing an elective reveals its abbreviated numbered-section dropdown (HPC-1–23, DOS-1–22, CD-1–14, DMDW-1–20, PSIOT-1, or CI-1–10). Submit stays disabled until both choices are made.
8. **One-shot timing and gating**: Every clicked selection receives the configured difficulty duration. Submit confirms the choice; closing or missing the window causes a final random allotment with no retry. Each completed row unlocks the next row.
9. **Outcome**: The 5th-semester flow redirects to the Result page only after all three selections are submitted or randomly allotted. Results identify each numbered section and whether it was submitted or random.

### 5. Result (`/result`)

Shows the outcome of the latest attempt:

- Selected section and reaction time
- Performance grade (S, A+, A, B, C, or X for missed)
- Seat count at the time of claim
- Best time, average time, and attempt count across all sessions
- Full attempt history table with grades
- Options: Try Again, Change Difficulty (goes to settings), Clear History

### 7. Settings (`/settings`)

Accessible via the "Change Difficulty" button on the Result page. Lets you configure difficulty and custom window time, then start a new practice run.

---

## Difficulty Levels

| Difficulty | Selection Window |
|------------|-----------------|
| Easy       | 15 seconds      |
| Normal     | 10 seconds      |
| Hard       | 5 seconds       |
| Custom     | 3 to 30 seconds (slider) |

The pre-open countdown (10 seconds) is the same across all difficulties.

---

## Grading System

Grades are based on how quickly you submit after the window opens:

| Grade | Condition             | Meaning                        |
|-------|-----------------------|--------------------------------|
| S     | Under 5 seconds       | Elite reflexes                 |
| A+    | 5 to 10 seconds       | Excellent                      |
| A     | 10 to 20 seconds      | Good                           |
| B     | 20 to 30 seconds      | Average                        |
| C     | Over 30 seconds       | Needs improvement              |
| X     | Window missed         | No section submitted           |

---

## Seat Drain Simulation

Inside each selection window, all available choices start with 78 seats. The section popup contains 61 sections (CSE-01 through CSE-61), while the elective popups contain their subject-specific choices. A bot drain algorithm runs every second and reduces seats across the active choices simultaneously, simulating other students claiming seats.

---

## State Management

Zustand manages all application state. The `persist` middleware writes the following to `localStorage`:

- `studentId` and `studentName`
- `difficulty` and `customWindowTime`
- `attempts` (full attempt history)

The following are runtime-only (not persisted, reset each round):

- `windowOpen`, `windowStartTime`
- `seatCounts`, `selectedSection`, `claimTime`, `seatsAtClaim`

Calling `logout()` clears credentials only. Calling `resetRound()` clears all runtime state.

---

## Key Design Decisions

- **No backend**: The entire simulation runs client-side. Student data and history live only in the browser's localStorage.
- **Shared settings component**: `SimulationSettingsControls` is used both on the Settings page and directly within the Section Selection page, so difficulty can be adjusted without leaving the flow.
- **Session guard on navigation**: When the section-selection page mounts, a `sessionActiveRef` ensures that any `selectedSection` value left over from a previous round does not incorrectly trigger a redirect to the result page.
- **Countdown visibility guard**: After a round ends (section claimed or window missed), the pre-open countdown is suppressed during the brief navigation delay so the UI does not flicker back to the countdown state.

---

## Responsive Design

All pages are designed to work on both desktop and mobile:

- The portal sidebar is hidden on mobile; the header collapses its decorative elements
- The welcome text in the header truncates on narrow screens
- Portal content uses `p-3 md:p-6` padding
- Result tables are wrapped in `overflow-x-auto` for horizontal scrolling on small screens
- The login page hides the campus image on mobile so the form gets full width

---

## Deployment

The app is deployed on Vercel and connected to the `main` branch of this repository. Every push to `main` triggers an automatic redeploy. Vercel Analytics is enabled via `@vercel/analytics` in the root layout.

---

## Getting Started (original Next.js notes)

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
