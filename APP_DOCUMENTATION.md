# PressClass AI - Application Documentation

## 1. Project Overview
**PressClass AI** is a comprehensive educational tool designed to assist teachers in generating, managing, and organizing classroom content. It leverages AI to create lesson plans, structured notes, and assessments, streamlining the curriculum planning process.

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript / React 19
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Backend/Database**: Supabase (PostgreSQL, Auth)
- **AI Integration**: OpenAI SDK (configured for Groq API)
- **Form Handling**: React Hook Form + Zod
- **PDF Generation**: jsPDF + html2canvas

---

## 2. Architecture & Folder Structure
The project follows the standard Next.js App Router structure with a focus on feature-based organization within the `app` directory.

### Key Directories
- **`app/`**: Main application routes.
  - **`(protected)/`**: Authenticated routes wrapped in a layout that ensures user session. Includes Dashboard, Generators, and content views.
  - **`auth/`**: Authentication routes (Login, Signup, Callback, Logout).
  - **`api/`**: Server-side API routes for AI generation and other backend logic.
- **`actions/`**: Server Actions for database mutations (CRUD operations).
  - `notes.ts`: Actions for Notes.
  - `lesson-plans.ts`: Actions for Lesson Plans.
  - `assessments.ts`: Actions for Assessments.
- **`components/`**: Reusable UI components and feature-specific widgets.
- **`lib/`**: Utility functions and Supabase client configuration.
- **`utils/`**: Helper functions (e.g., Supabase middleware).

---

## 3. Core Features

### 3.1 Authentication
- **Provider**: Supabase Auth.
- **Methods**: Email/Password, Google OAuth.
- **Flow**:
  - Users sign up/login via `/login` or `/signup`.
  - Protected routes (`/dashboard`, etc.) enforce session checks.
  - Middleware handles session refreshing and redirection.

### 3.2 Dashboard (`/dashboard`)
- **Purpose**: Central hub for the user.
- **Functionality**:
  - Displays summary statistics (Total Notes, Lesson Plans, Assessments).
  - Lists recent items for quick access.
  - Quick links to create new content.

### 3.3 Generators
The core value proposition is the AI-powered content generation.
- **Notes Generator** (`/generator/notes`):
  - Inputs: School, Class, Subject, Strand, Sub-strand, Date, Duration, Week/Term.
  - Output: Structured notes with Lesson Summary, Key Points, Examples, Activity, and Resources.
- **Lesson Plan Generator** (`/generator/lesson-plan`):
  - Inputs: Subject, Topic, Class Level, Duration, etc.
  - Output: Detailed lesson plan including Objectives, Materials, Procedure, and Assessment.
- **Assessment Generator** (`/generator/assessment`):
  - Inputs: Subject, Topic, Class Level, Question Type, Difficulty.
  - Output: A set of questions (MCQ, Short Answer, etc.) based on the criteria.

### 3.4 Content Management
- **Views**: Dedicated pages to list all Notes (`/notes`), Lesson Plans (`/lesson-plans`), and Assessments (`/assessments`).
- **Detail View**: View full details of a specific item.
- **Editing**: Update existing content (Title, Content fields).
- **Export**: Download content as PDF (`jsPDF`) or Print.
- **Delete**: Remove unwanted content.

---

## 4. Database Schema
The application uses a PostgreSQL database hosted on Supabase. Row Level Security (RLS) is enabled on all tables to ensure data privacy.

### 4.1 `notes` Table
Stores generated classroom notes.
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `title`: Text (derived from Strand/Topic)
- `school`: Text
- `class_level`: Text
- `subject`: Text
- `strand`: Text
- `sub_strand`: Text
- `date`: Date
- `duration`: Text
- `week_term`: Text
- `content`: JSONB (Stores structured data: `lessonSummary`, `keyPoints`, `examples`, `activity`, `resources`)

### 4.2 `lesson_plans` Table
Stores generated lesson plans.
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `title`: Text
- `subject`: Text
- `class_level`: Text
- `topic`: Text
- `sub_topic`: Text
- `duration`: Text
- `week_term`: Text
- `date`: Text
- `content`: JSONB (Stores full lesson plan structure)

### 4.3 `assessments` Table
Stores generated assessments/quizzes.
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `title`: Text
- `class_level`: Text
- `topic`: Text
- `questions`: JSONB (Array of question objects)

---

## 5. Development Workflow

### Setup
1.  **Environment Variables**:
    - `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL.
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key.
    - `GROQ_API_KEY`: API Key for AI generation.
2.  **Installation**: `npm install`
3.  **Run Locally**: `npm run dev`

### Deployment
- **Platform**: Vercel (recommended for Next.js).
- **Build Command**: `npm run build`

---

## 6. Future Roadmap & Aim
**Aim**: To become the primary digital assistant for teachers, automating administrative and preparatory tasks so they can focus on teaching.

### Potential Features (Extensions)
1.  **Curriculum Mapping**: Link generated content to specific curriculum standards (e.g., Common Core, National Curriculum).
2.  **Student Management**: Basic roster management to track assessments against specific students.
3.  **Scheduling/Calendar**: Integrate generated lesson plans into a weekly/monthly calendar view.
4.  **Sharing/Community**: Allow teachers to share successful lesson plans or notes with a public library or colleagues.
5.  **Rich Text Editing**: Enhance the editing experience with a full WYSIWYG editor for content.
6.  **Analytics**: Insights into the types of lessons generated, subjects covered, and assessment performance (if student data is added).
