# PressClass AI - Application Documentation

## 1. Project Overview
**PressClass AI** is a comprehensive educational platform designed to assist teachers in generating, managing, and organizing classroom content. It leverages AI to create lesson plans, structured notes, and assessments, while providing productivity tools like study timers, interactive whiteboards, and calendar integration to streamline the entire teaching workflow.

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript / React 19
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS)
- **AI Integration**: OpenAI SDK (configured for Groq API)
- **Form Handling**: React Hook Form + Zod
- **PDF Generation**: jsPDF + html2canvas
- **Whiteboard**: ReactFlow
- **Calendar**: React Day Picker + date-fns
- **Animations**: Framer Motion

---

## 2. Architecture & Folder Structure
The project follows the standard Next.js App Router structure with a focus on feature-based organization within the `app` directory.

### Key Directories
- **`app/`**: Main application routes.
  - **`(protected)/`**: Authenticated routes wrapped in a layout that ensures user session. Includes Dashboard, Generators, Study Time, Calendar, Whiteboard, and content views.
  - **`auth/`**: Authentication routes (Login, Signup, Callback, Logout).
  - **`api/`**: Server-side API routes for AI generation and other backend logic.
- **`actions/`**: Server Actions for database mutations (CRUD operations).
  - `notes.ts`: Actions for Notes.
  - `lesson-plans.ts`: Actions for Lesson Plans.
  - `assessments.ts`: Actions for Assessments.
  - `study-time.ts`: Actions for Study Sessions and Analytics.
- **`components/`**: Reusable UI components and feature-specific widgets.
  - `study-time/`: Study timer components (timer display, controls, analytics).
  - `ui/`: Shadcn UI components (buttons, cards, dialogs, etc.).
- **`lib/`**: Utility functions and Supabase client configuration.
  - `AI_API_Switch.ts`: AI provider configuration (Groq/OpenAI).
- **`utils/`**: Helper functions (e.g., Supabase middleware).

---

## 3. Core Features

### 3.1 Authentication
- **Provider**: Supabase Auth.
- **Methods**: Email/Password, Google OAuth.
- **Flow**:
  - Users sign up/login via `/auth/login` or `/auth/sign-up`.
  - Protected routes (`/dashboard`, etc.) enforce session checks.
  - Middleware handles session refreshing and redirection.
  - Row Level Security (RLS) ensures data isolation per user.

### 3.2 Dashboard (`/dashboard`)
- **Purpose**: Central hub for the user.
- **Functionality**:
  - Displays summary statistics (Total Notes, Lesson Plans, Assessments, Study Time This Week).
  - Lists recent items for quick access.
  - Quick links to create new content.
  - Study time widget showing weekly progress.

### 3.3 AI-Powered Generators
The core value proposition is the AI-powered content generation.

#### **Notes Generator** (`/generator/notes`)
- **Inputs**: School, Class, Subject, Strand, Sub-strand, Date, Duration, Week/Term.
- **Output**: Structured notes with:
  - Lesson Summary
  - Key Points
  - Examples
  - Activity
  - Resources
- **Features**: Save to database, Print, Download PDF, Edit.

#### **Lesson Plan Generator** (`/generator/lesson-plan`)
- **Inputs**: School, Class, Subject, Topic, Sub-topic, Date, Duration, Week/Term.
- **Output**: Detailed lesson plan including:
  - Learning Objectives
  - Relevant Previous Knowledge (RPK)
  - Teaching/Learning Materials
  - Lesson Stages (Starter, Development, Reflection)
  - Core Points
  - Evaluation/Assessment
- **Features**: 
  - Save to database
  - Generate assessment from lesson plan
  - Edit inline
  - Export to PDF
  - Properly formatted text with line breaks and paragraphs

#### **Assessment Generator** (`/generator/assessment`)
- **Inputs**: Subject, Topic, Class Level, Question Type, Difficulty, Quantity.
- **Output**: A set of questions (MCQ, Short Answer, Essay, True/False) based on the criteria.
- **Features**: View, Print, Download PDF.

### 3.4 Content Management

#### **Notes Page** (`/notes`)
- **Organization**: Grouped by subject with expandable sections.
- **Display**: Card-based grid layout (responsive: 1-3 columns).
- **Actions**: View details, Delete.

#### **Lesson Plans Page** (`/lesson-plans`)
- **Organization**: Grouped by subject with expandable sections.
- **Display**: Card-based grid layout showing class, topic, duration, and date.
- **Actions**: View details, Edit, Generate Assessment, Delete, Export PDF.

#### **Assessments Page** (`/assessments`)
- **Organization**: Grouped by topic/subject.
- **Display**: Card-based grid layout showing class level, question count, and creation date.
- **Actions**: View details, Print, Download PDF.

### 3.5 Study Time (`/study-time`)
A comprehensive productivity feature for focused study sessions.

#### **Timer Modes**
1. **Pomodoro Timer**:
   - Customizable work duration (default: 25 minutes)
   - Customizable break duration (default: 5 minutes)
   - Long break after every 4 sessions (default: 15 minutes)
   - Automatic transitions between work and break phases
   - Visual phase indicator

2. **Countdown Timer**:
   - Set custom duration
   - Counts down to zero
   - Automatic completion notification

3. **Stopwatch**:
   - Open-ended focus session
   - Counts up from zero
   - Manual end control

#### **Features**
- **Real-time Analytics**: 
  - Study time today
  - Study time this week
  - Average focus duration
  - Pauses taken today
  - Longest consecutive day streak
  - Total sessions completed
- **Live Session Insights**: Time spent, time remaining, pause count, current streak.
- **Session Tracking**: Records all sessions with timestamps, pause events, and duration.
- **End-of-Session Summary**: 
  - Subject/topic tagging
  - Session notes
  - Quality rating (Productive/Needs Improvement)
- **Pause/Resume**: Track break times separately from study time.
- **Dashboard Integration**: Weekly study time displayed on main dashboard.

### 3.6 Calendar (`/calendar`)
Interactive calendar for managing lessons and tasks.

#### **Features**
- **Event Types**:
  - Lessons (from lesson plans)
  - Tasks (custom to-dos)
- **Functionality**:
  - Drag-and-drop to reschedule events
  - Mark tasks as complete
  - Add custom events
  - Month view with color-coded events
  - Event details modal

### 3.7 Planning Board (`/whiteboard`)
Interactive whiteboard for visual planning and brainstorming.

#### **Features**
- **Node Types**:
  - Lesson nodes (linked to lesson plans)
  - Todo nodes (task items)
  - Card nodes (general notes/ideas)
- **Functionality**:
  - Drag-and-drop positioning
  - Connect nodes with edges
  - Edit node content inline
  - Center view
  - Export to PDF
  - Responsive: Desktop shows horizontal buttons, mobile uses dropdown menu
- **Persistence**: Saves whiteboard state to database

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
- `created_at`: Timestamp
- `updated_at`: Timestamp

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
- `content`: JSONB (Stores: `schoolName`, `objectives`, `rpk`, `materials`, `stages`, `corePoints`, `evaluation`)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### 4.3 `assessments` Table
Stores generated assessments/quizzes.
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `title`: Text
- `class_level`: Text
- `topic`: Text
- `questions`: JSONB (Array of question objects)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### 4.4 `study_sessions` Table
Stores study time sessions.
- `id`: UUID (PK)
- `user_id`: UUID (FK to auth.users)
- `session_type`: Text (pomodoro, countdown, stopwatch)
- `start_time`: Timestamp with time zone
- `end_time`: Timestamp with time zone (nullable)
- `total_minutes`: Integer
- `pause_count`: Integer (default: 0)
- `subject_tag`: Text (nullable)
- `notes`: Text (nullable)
- `quality_rating`: Text (nullable: productive, needs_improvement)
- `settings`: JSONB (timer settings)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- **Indexes**: `user_id`, `start_time`, `(user_id, start_time DESC)`

### 4.5 `study_pauses` Table
Stores pause events within study sessions.
- `id`: UUID (PK)
- `session_id`: UUID (FK to study_sessions, CASCADE on delete)
- `pause_start`: Timestamp with time zone
- `pause_end`: Timestamp with time zone (nullable)
- `duration_seconds`: Integer
- `created_at`: Timestamp
- **Index**: `session_id`

### 4.6 RLS Policies
All tables have Row Level Security enabled with policies for:
- **SELECT**: Users can view their own records
- **INSERT**: Users can create their own records
- **UPDATE**: Users can update their own records
- **DELETE**: Users can delete their own records

---

## 5. AI Integration

### 5.1 AI Provider Configuration
- **File**: `lib/AI_API_Switch.ts`
- **Supported Providers**: 
  - Groq (default)
  - OpenAI
- **Configuration**: Set `ACTIVE_PROVIDER` to switch between providers.

### 5.2 Generation Endpoints
- **`/api/generate`**: Assessment generation
- **`/api/generate/lesson-plan`**: Lesson plan generation
- **`/api/generate/notes`**: Notes generation

### 5.3 Prompt Engineering
- All prompts include formatting instructions for proper JSON output
- Lesson plan prompts include instructions for line breaks (`\n`) and paragraph breaks (`\n\n`)
- Responses are parsed and validated before storage

---

## 6. UI/UX Design Principles

### 6.1 Responsive Design
- **Mobile-first approach**: All pages optimized for mobile devices
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Adaptive layouts**: Grids adjust from 1 to 3 columns based on screen size

### 6.2 Component Library
- **Shadcn UI**: Accessible, customizable components
- **Radix Primitives**: Headless UI components for complex interactions
- **Tailwind CSS**: Utility-first styling with custom theme

### 6.3 Visual Feedback
- **Loading states**: Skeleton loaders and spinners
- **Toast notifications**: Success, error, and info messages
- **Hover effects**: Interactive elements provide visual feedback
- **Animations**: Smooth transitions using Framer Motion

---

## 7. Development Workflow

### 7.1 Setup
1. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
   - `GROQ_API_KEY`: API Key for AI generation (Groq)
   - `OPENAI_API_KEY`: API Key for OpenAI (optional)
2. **Installation**: `npm install`
3. **Database Setup**: Run SQL migrations in Supabase SQL Editor:
   - `notes_schema.sql`
   - `study_time_schema.sql`
   - Other schema files as needed
4. **Run Locally**: `npm run dev`

### 7.2 Build & Deployment
- **Build Command**: `npm run build`
- **Platform**: Vercel (recommended for Next.js)
- **Environment**: Production environment variables must be set in Vercel

### 7.3 Code Organization
- **Server Components**: Default for pages and layouts
- **Client Components**: Marked with `'use client'` for interactivity
- **Server Actions**: Used for database mutations with `'use server'`
- **Type Safety**: Full TypeScript coverage with strict mode

---

## 8. Security & Privacy

### 8.1 Authentication
- **Session-based**: Supabase handles JWT tokens
- **Middleware**: Refreshes sessions on every request
- **Protected Routes**: Layout enforces authentication

### 8.2 Data Security
- **RLS Policies**: All database tables have user-scoped access
- **Server-side validation**: All inputs validated before database operations
- **SQL Injection Prevention**: Supabase client handles parameterized queries

### 8.3 API Security
- **Rate Limiting**: Implemented at API route level
- **Environment Variables**: Sensitive keys stored securely
- **CORS**: Configured for same-origin requests only

---

## 9. Performance Optimization

### 9.1 Caching
- **Static Generation**: Public pages pre-rendered at build time
- **Dynamic Routes**: Server-rendered on demand with caching
- **Revalidation**: `revalidatePath` used after mutations

### 9.2 Code Splitting
- **Route-based**: Automatic code splitting per route
- **Component-level**: Dynamic imports for heavy components
- **Bundle Size**: Optimized with tree-shaking

### 9.3 Database Optimization
- **Indexes**: Added on frequently queried columns
- **Pagination**: Implemented for large datasets (where applicable)
- **Selective Queries**: Only fetch required fields

---

## 10. Future Roadmap & Enhancements

### Planned Features
1. **Advanced Analytics**:
   - Study time trends and charts
   - Assessment performance tracking
   - Lesson plan effectiveness metrics

2. **Collaboration**:
   - Share lesson plans with colleagues
   - Public template library
   - Team workspaces

3. **Enhanced Whiteboard**:
   - More node types (images, videos, links)
   - Templates for common planning scenarios
   - Real-time collaboration

4. **Student Management**:
   - Basic roster management
   - Track assessments per student
   - Progress reports

5. **Curriculum Mapping**:
   - Link content to curriculum standards
   - Coverage tracking
   - Standards alignment reports

6. **Mobile App**:
   - Native iOS/Android apps
   - Offline mode
   - Push notifications for study reminders

7. **Rich Text Editing**:
   - WYSIWYG editor for notes and lesson plans
   - Markdown support
   - Image uploads

8. **Integration**:
   - Google Classroom integration
   - LMS connectivity
   - Export to various formats (Word, Excel, etc.)

---

## 11. Troubleshooting

### Common Issues

#### Build Errors
- **Missing dependencies**: Run `npm install`
- **Type errors**: Check TypeScript version compatibility
- **Environment variables**: Ensure all required vars are set

#### Database Issues
- **RLS errors**: Verify user is authenticated
- **Migration errors**: Check SQL syntax and table dependencies
- **Connection errors**: Verify Supabase URL and keys

#### AI Generation Issues
- **API errors**: Check API key validity and rate limits
- **Timeout errors**: Increase timeout or reduce prompt complexity
- **Invalid JSON**: Review prompt formatting instructions

---

## 12. Contributing

### Code Standards
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (optional)
- **Naming**: camelCase for variables, PascalCase for components

### Git Workflow
- **Branches**: Feature branches from `main`
- **Commits**: Descriptive commit messages
- **Pull Requests**: Required for merging to `main`

---

## 13. License & Credits

### Technology Credits
- **Next.js**: Vercel
- **Supabase**: Supabase Inc.
- **Shadcn UI**: shadcn
- **Radix UI**: WorkOS
- **Tailwind CSS**: Tailwind Labs

### License
Proprietary - All rights reserved.

---

**Last Updated**: December 2025
**Version**: 2.0.0
