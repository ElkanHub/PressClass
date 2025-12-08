# Calendar Scheduling for Lesson Plans
## Important
Adjust aany feature or schema in this doc to meet the requirements and functionality of the app. Do this without compromising the core vision of the app and technical systems.

## 1. Core Vision

Teachers don’t need a fancy calendar.

They need **clarity**—what they’re teaching this week, what they need to prepare, and what’s incomplete.

Your calendar system should feel like a **teaching command center**, where lesson plans plug directly into a weekly view and tasks automatically connect to what they’re teaching.

---

# 2. Core Features (MVP → Advanced)

---

## **A. Calendar System (MVP)**

### 1. Weekly View (Default)

Teachers operate weekly. Keep the focus here.

- Displays **Monday → Sunday**
- Each day shows:
    - Scheduled lessons
    - Tasks / prep items
    - Deadlines (assessment creation, marking, etc.)

### 2. Lesson Auto-Scheduling

When a user generates a Lesson Plan or Note:

- Option: **"Add to Calendar"**
- Auto-fills:
    - Date
    - Duration
    - Subject
    - Class

### 3. Manual Add Items

User can add:

- Lessons
- Tasks
- Events (PTA meeting, exam week, school duties)

### 4. Drag-and-Drop

- Move tasks between days
- Reschedule lessons
- Extend or shrink time blocks

### 5. Progress Tracking

Each task has:

- Not Started
- In Progress
- Completed

Lessons can also have completion status:

- Prepared
- Delivered
- Pending

---

## **B. Task Management**

### 1. Task Creation

Each task has:

- Title
- Description
- Related Subject / Class
- Due Date
- Category: **Prep, Marking, Planning, Admin, Personal**
- Priority

### 2. Task Linking

Automatically link a task to:

- a **lesson plan**
- a **note**
- an **assessment**

### 3. Task Groups

Teachers prepare in stages:

- Research
- Plan
- Create Materials
- Mark / Review

Use **task groups with checkboxes**.

### 4. Progress Indicators

- **Circular progress bar** beside each lesson
- **Weekly progress score** (total tasks vs completed)

---

## **C. Weekly Review & Analytics**

A simple dashboard attached to the calendar:

- Total lessons scheduled
- Total tasks created
- Tasks completed
- “This Week’s Stress Meter” (based on workload)
- Suggested AI-generated tips

---

## **D. Integration with Existing PressClass Features**

This is where the system becomes powerful.

### 1. Notes/Plans → Calendar

When creating:

- “Add to Week”
- “Add Prep Tasks Automatically” (AI suggests tasks)

### 2. Assessments → Calendar

Deadlines show on the calendar:

- When to create the assessment
- When students will take it
- When marking is due

### 3. AI Auto-Planning (Future Upgrade)

AI can create an entire week plan based on:

- Curriculum
- Class level
- Teacher workload
- Previously completed lessons

---

# 3. System Layout / UI Structure

---

## **A. Calendar Layout (Weekly View – Main Screen)**

```
 -----------------------------------------------------
| Week Selector | <  Jan 6 – Jan 12  >  | Add Item   |
 -----------------------------------------------------
| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
 -----------------------------------------------------
| 9AM: English - Lesson 1 (Prepared 70%)             |
|   - Task: Print worksheets (In Progress)           |
|                                                    |
| 11AM: Science - Notes Prep (Not Started)           |
|                                                    |
 -----------------------------------------------------
| 3PM: Staff Meeting                                 |
|                                                    |
 -----------------------------------------------------

```

### Key UI Elements:

- Clean blocks for lessons
- Progress rings
- Task badges
- Color-coded subjects
- Drag handles

---

## **B. Sidebar (Left Panel) {Make the main app sidebar Collapsible on this page so that the user can focus on the week planning. Make both responsive on mobile too.}**

```
- Today
- Tasks
- Upcoming Deadlines
- Quick Add:
    - New Lesson
    - New Task
    - New Assessment

```

---

## **C. Task Drawer (Right Panel)**

When clicking an item:

```
[Lesson Title]
Subject | Class | Duration

Progress: [ 70% bar ]
Status: Prepared / Delivered

Linked items:
- 3 Tasks
- 1 Assessment

Notes:
[Mini rich text editor]

```

---

## **D. Add New Item Modal**

Tabs:

- Lesson
- Task
- Assessment
- Event

Each tab shows the relevant fields.

---

# 4. Technical Implementation Plan

---

## **A. Database Schema Extensions**

### `calendar_events` table

```
id (uuid)
user_id
type: 'lesson' | 'task' | 'event'
related_id: uuid (links to note, lesson_plan, or assessment)
title
date_start
date_end
status
metadata (jsonb)

```

### `tasks` table

```
id
user_id
title
description
priority
due_date
status
related_id (optional)
related_type (notes | lesson_plans | assessments)
category
progress

```

---

## **B. Frontend Implementation**

### 1. Weekly Calendar Component

- Use a grid layout: 7 columns × time slots
- Drag-and-drop: `@dnd-kit/core`
- Smooth animations: Framer Motion
- Compact mobile view
- Click to expand details

### 2. Task List Component

- Built with shadcn components
- Collapsible task groups
- Checkbox progress

### 3. Linking Mechanism

On creation of content:

- Offer selecting date
- Push to `calendar_events` table

---

# 5. Development Roadmap (Complete Plan)

---

## **Phase 1 – Foundation**

- Create `calendar_events` and `tasks` tables
- Build weekly calendar grid
- Render static sample data

## **Phase 2 – Interaction**

- Add event creation
- Add task creation
- Drag-and-drop events
- Task progress tracking

## **Phase 3 – Integration**

- Connect Notes → Calendar
- Connect Lesson Plans → Calendar
- Connect Assessments → Calendar

## **Phase 4 – Analytics**

- Weekly progress view
- Workload indicators