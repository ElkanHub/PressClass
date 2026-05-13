// lib/images.ts — curated photo library used across the marketing surface.
// ALL imagery here features African subjects (teachers, students, classrooms).
//
// Hosted on Unsplash; license-clear under the Unsplash license. Hotlinking
// is permitted and encouraged.
//
// NOTE: Unsplash IDs occasionally rotate or get removed by photographers.
// If any image stops loading or doesn't fit, swap the ID below — every page
// pulls from this single file. To self-host: download the originals to
// /public/marketing/ and change the URL in `u()`.

export interface CuratedImage {
  src: string;
  alt: string;
  credit?: string;
  /** A focal point hint for object-position. */
  focus?: string;
}

const u = (id: string, params = "w=1600&q=80&auto=format&fit=crop") =>
  `https://images.unsplash.com/${id}?${params}`;

// ---- Heroes & classroom scenes ----------------------------------------------

export const HERO_IMAGE: CuratedImage = {
  // African woman teacher standing in front of her class — Doug Linstedt.
  src: u("photo-1577896851231-70ef18881754", "w=1800&q=82&auto=format&fit=crop"),
  alt: "African teacher standing in front of her class",
  credit: "Doug Linstedt / Unsplash",
  focus: "50% 30%",
};

export const CLASSROOM_WIDE: CuratedImage = {
  // Children at desks in an African classroom — Doug Linstedt.
  src: u("photo-1571260899304-425eee4c7efc"),
  alt: "Children studying at their desks in an African classroom",
  credit: "Doug Linstedt / Unsplash",
  focus: "50% 50%",
};

export const TEACHER_AT_BOARD: CuratedImage = {
  // African woman writing on a chalkboard.
  src: u("photo-1509062522246-3755977927d7"),
  alt: "African teacher writing on a chalkboard",
  credit: "Santi Vedrí / Unsplash",
  focus: "50% 40%",
};

export const NOTEBOOK_PEN: CuratedImage = {
  // Hands writing in a notebook — keeps it neutral / focus on craft.
  src: u("photo-1455390582262-044cdead277a"),
  alt: "Hands writing notes in a wooden-desk notebook",
  credit: "Aaron Burden / Unsplash",
};

export const STUDENT_READING: CuratedImage = {
  // African student reading a textbook.
  src: u("photo-1531123897727-8f129e1688ce"),
  alt: "African student reading a textbook",
  credit: "Unsplash",
};

export const STUDENTS_COLLAB: CuratedImage = {
  // African students working together.
  src: u("photo-1497486751825-1233686d5d80"),
  alt: "Students collaborating on a project",
  credit: "MD Duran / Unsplash",
};

// ---- Teacher / professional portraits for testimonials -----------------------
// All four are Black/African professionals.

export const TEACHER_PORTRAIT: CuratedImage = {
  src: u("photo-1573497019418-b400bb3ab074", "w=600&q=82&auto=format&fit=crop"),
  alt: "Black woman smiling in a professional portrait",
  credit: "Christina @ wocintechchat / Unsplash",
};

export const TEACHER_PORTRAIT_2: CuratedImage = {
  src: u("photo-1580489944761-15a19d654956", "w=600&q=82&auto=format&fit=crop"),
  alt: "Black woman with arms crossed, smiling",
  credit: "Christina @ wocintechchat / Unsplash",
};

export const TEACHER_PORTRAIT_3: CuratedImage = {
  src: u("photo-1507003211169-0a1dd7228f2d", "w=600&q=82&auto=format&fit=crop"),
  alt: "Black man portrait",
  credit: "Vince Fleming / Unsplash",
};

export const TEACHER_PORTRAIT_4: CuratedImage = {
  src: u("photo-1567532939604-b6b5b0db2604", "w=600&q=82&auto=format&fit=crop"),
  alt: "Black woman portrait",
  credit: "Christina @ wocintechchat / Unsplash",
};

export const TESTIMONIAL_FACES: CuratedImage[] = [
  TEACHER_PORTRAIT,
  TEACHER_PORTRAIT_2,
  TEACHER_PORTRAIT_3,
  TEACHER_PORTRAIT_4,
];

/** Three classroom shots used in the features showcase. */
export const FEATURE_SHOTS = {
  lessonPlan: TEACHER_AT_BOARD,
  notes: NOTEBOOK_PEN,
  assessment: STUDENT_READING,
} as const;
