// lib/images.ts — curated photo library used across the marketing surface.
// All hosted on Unsplash; license-clear under the Unsplash license. Hotlinking
// is permitted and encouraged. Add `?w=...&q=80&auto=format&fit=crop` for
// next/image-friendly URLs.
//
// Photographers are credited inline; if we ever self-host these we'll keep
// the attribution. Selection criteria: real African classrooms / teachers /
// students, warm natural light, no posed-stock vibe.

export interface CuratedImage {
  src: string;
  alt: string;
  credit?: string;
  /** A focal point hint for object-position. */
  focus?: string;
}

const u = (id: string, params = "w=1600&q=80&auto=format&fit=crop") =>
  `https://images.unsplash.com/${id}?${params}`;

export const HERO_IMAGE: CuratedImage = {
  // Teacher in front of a classroom in Ghana.
  src: u("photo-1577896851231-70ef18881754", "w=1800&q=82&auto=format&fit=crop"),
  alt: "Teacher in front of a classroom, smiling at her students",
  credit: "Doug Linstedt / Unsplash",
  focus: "50% 35%",
};

export const CLASSROOM_WIDE: CuratedImage = {
  src: u("photo-1497486751825-1233686d5d80"),
  alt: "Students seated at desks during a lesson",
  credit: "MD Duran / Unsplash",
  focus: "50% 50%",
};

export const TEACHER_AT_BOARD: CuratedImage = {
  src: u("photo-1580582932707-520aed937b7b"),
  alt: "Teacher writing on a blackboard",
  credit: "Kenny Eliason / Unsplash",
  focus: "50% 40%",
};

export const NOTEBOOK_PEN: CuratedImage = {
  src: u("photo-1455390582262-044cdead277a"),
  alt: "Open notebook and pen on a wooden desk",
  credit: "Aaron Burden / Unsplash",
};

export const STUDENT_READING: CuratedImage = {
  src: u("photo-1503676260728-1c00da094a0b"),
  alt: "Student reading a textbook",
  credit: "Eliott Reyna / Unsplash",
};

export const STUDENTS_COLLAB: CuratedImage = {
  src: u("photo-1522661067900-ab829854a57f"),
  alt: "Students collaborating at a desk",
  credit: "NeONBRAND / Unsplash",
};

export const TEACHER_PORTRAIT: CuratedImage = {
  src: u("photo-1573496359142-b8d87734a5a2", "w=600&q=82&auto=format&fit=crop"),
  alt: "Smiling teacher portrait",
  credit: "Christina @ wocintechchat / Unsplash",
};

export const TEACHER_PORTRAIT_2: CuratedImage = {
  src: u("photo-1494790108377-be9c29b29330", "w=600&q=82&auto=format&fit=crop"),
  alt: "Smiling young woman portrait",
  credit: "Sound On / Unsplash",
};

export const TEACHER_PORTRAIT_3: CuratedImage = {
  src: u("photo-1531123897727-8f129e1688ce", "w=600&q=82&auto=format&fit=crop"),
  alt: "Smiling man portrait",
  credit: "Stefan Stefancik / Unsplash",
};

export const TEACHER_PORTRAIT_4: CuratedImage = {
  src: u("photo-1438761681033-6461ffad8d80", "w=600&q=82&auto=format&fit=crop"),
  alt: "Smiling young woman portrait",
  credit: "Jake Nackos / Unsplash",
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
