PressClass an AI Classroom Assessment Generator – Project Outline
1. Project Overview

This project is an AI-powered classroom assessment generator designed to help teachers instantly create formative assessments at the end of a lesson. Instead of manually typing questions, teachers simply input key lesson information and the system generates class-specific questions that check understanding and measure student performance.
The goal is to reduce the teacher’s workload, speed up lesson follow-ups, and create a consistent, fair way to track comprehension across different subjects and class levels.

2. Problem Statement

Teachers spend a huge amount of time preparing questions after each lesson—especially when they handle multiple classes or subjects. Traditional assessment preparation is time-consuming and often rushed, which affects the quality of questions and limits how quickly students get feedback.
With AI, we can automate this process and allow teachers to generate accurate, level-appropriate questions in seconds.

3. Target Users

Basic school teachers

Junior high/SHS teachers

Tutors who want quick, structured assessments

Schools looking for automated evaluation tools

4. Core Features
4.1 Input Fields

Teachers will provide the following:

Strand (Topic) – the main concept taught

Sub-strand (Sub-topic) – the specific area covered

Class Level – e.g., B4, B6, JHS 1, SHS, etc.

Question Type Options

Objective questions (MCQs)

Subjective questions (short/long answers)

Mixed format

Question Quantity

Teacher can choose specific counts, e.g.:

5 subjective questions + 3 objective questions

10 MCQs only

Any combination the teacher wants

These inputs allow the system to tailor the difficulty, vocabulary, and structure to match the class.

5. System Process Flow

Teacher fills the form with topic, subtopic, class, and question types.

AI model uses this information to generate:

Age-appropriate content

Class-level complexity

Proper structure for both subjective and objective questions

System displays the questions and allows the teacher to copy, download, or print.

6. Output Features

Cleanly formatted assessment sheet

MCQs with answer keys

Subjective questions without answers (unless teacher chooses “include answers”)

Option to export as:

PDF

Word Document

Online quiz link (future feature)

7. Technical Components
Frontend

React / Next.js

Form handling for inputs

Dynamic UI based on question type selection

Backend

Next.js API routes

Postgres (optional) to save templates

AI Integration

Groq API for generating questions

Prompt engineering based on class + topic

Logic to structure MCQs properly

8. Proposed Pages / Screens

A polished public landing page. Goal is to quickly let the user know what the app does and how to use it and get them to the assessment generator page.

Home Page – short intro explaining the purpose

Assessment Generator Page – main form for teachers

Results Page – shows generated questions

Mini Dashboard Page – shows generated questions and allows the teacher to copy, download, and share.

Download/Export Screen – for formatting assessments

9. Grading and Performance Tracking (Optional Future Feature)

Auto-marking for objective questions

Score dashboard for classes

Student-specific reports

10. Success Indicators

The project will be considered successful if it:

Generates clean, accurate questions consistently

Reduces teacher workload

Produces class-appropriate difficulty levels

Works fast and smoothly on both mobile and desktop

Can be used daily without confusion


## Important...
The standard for setting the queestions should follow that of the WEAC and GES since this app will be largely used in Africa... Other standards can be included to improve quality and flexibility of hte questions....

11. Credibility

Show on the home page that the app is credible and reliable by showing the following:

WEAC and GES standards

Teacher testimonials

Success stories

12. Security

The app should be secure and reliable by showing the following:

User authentication

Data encryption

Backup and recovery

13. Support

The app should have a support system by showing the following:

FAQs

Contact form

Chat support

15. Conclusion

The AI Classroom Assessment Generator is a powerful tool that can help teachers save time and improve the quality of their assessments. By using AI, teachers can generate accurate, level-appropriate questions in seconds, which can be used to track student progress and measure their understanding of the subject matter. 

For the look of the app, it should be modern and user-friendly. The app should be easy to navigate and use. You can use trendig designs and colors. Fell free to redesign the starter template to fit the look of the app.

example groq :
import OpenAI from "openai";
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const response = await client.responses.create({
    model: "openai/gpt-oss-20b",
    input: "Explain the importance of fast language models",
});

Adjust the input to fit the needs of the app. 
