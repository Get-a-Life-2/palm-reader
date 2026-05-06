// Static content for the landing page narrative. The voice and the substance
// are drawn from the palmistry primer in app/api/read/route.ts so the page
// agrees with the system prompt about the tradition it's translating.

import type { LineId } from "./palmLines";

export type HandSide = {
  side: "left" | "right";
  marginal: string;
  flavor: string;
  forMan: string;
  forWoman: string;
};

export const HAND_LORE: { left: HandSide; right: HandSide } = {
  left: {
    side: "left",
    marginal: "The Left Hand",
    flavor: "Sinistra — the chart you arrived holding.",
    forMan:
      "For a man, the left is the hand of beginnings. It is what he was born with: temperament, the unbidden self, the chart before the world began to write on it.",
    forWoman:
      "For a woman, the left is the hand of accumulation. It is what she has gathered season by season — the marks of choice, the architecture of a life lived deliberately.",
  },
  right: {
    side: "right",
    marginal: "The Right Hand",
    flavor: "Dextra — the chart written across the years.",
    forMan:
      "For a man, the right is the hand of accumulation. It is what he has made of himself, the chart he has been writing all along, line by line.",
    forWoman:
      "For a woman, the right is the hand of beginnings. It is what she was born with — the innate hand, before the slow weather of the world weighed in.",
  },
};

export const DOMINANCE_NOTE =
  "Whichever hand you favour, it speaks of what is to come. Its quieter twin keeps the past, and the things you have not yet said aloud.";

export type LineSign = { mark: string; meaning: string };

export type LineLore = {
  id: LineId;
  numeral: "I" | "II" | "III" | "IV";
  title: string;
  latin: string;
  blurb: string;
  whatItTells: string;
  signs: LineSign[];
};

// Each line keeps ~6 of the most evocative entries from the primer, framed as
// "if you find X, it speaks of Y" — manuscript marginalia, not a checklist.
export const LINE_LORE: readonly LineLore[] = [
  {
    id: "heart",
    numeral: "I",
    title: "The Heart Line",
    latin: "Linea Mensalis",
    blurb: "Of the river that knows its own banks.",
    whatItTells:
      "The first line crosses the upper palm — emotional weather, the way the heart keeps its banks. It speaks of romance, of cardiac vigour, of the private temperature at which one prefers to live.",
    signs: [
      { mark: "Begins below the index", meaning: "content with love, and slow to mistake intensity for truth" },
      { mark: "Begins between index and middle", meaning: "caring, and capable of understanding" },
      { mark: "Long and curving", meaning: "freely expresses what it feels, and trusts what it has expressed" },
      { mark: "Short and straight", meaning: "less interest in romance; warmth kept for fewer rooms" },
      { mark: "Touches the life line", meaning: "the heart breaks easily, and remembers" },
      { mark: "A small island upon the line", meaning: "a private season of doubt, soon to pass" },
    ],
  },
  {
    id: "head",
    numeral: "II",
    title: "The Head Line",
    latin: "Linea Cephalica",
    blurb: "Of the lantern carried into rooms.",
    whatItTells:
      "The second line moves across the centre of the palm — a study of how thought is shaped. It speaks of learning, of the cast of one's reasoning, of where the lantern is carried and how steadily the hand holds it.",
    signs: [
      { mark: "Long and deep", meaning: "clear, focused thinking; a thought given time" },
      { mark: "Curving and sloping", meaning: "creative; an inclination toward fantasy and literature" },
      { mark: "Curving upward toward the little finger", meaning: "an aptitude for mathematics, business, logic" },
      { mark: "Separated from the life line", meaning: "an enthusiasm for life and an appetite for adventure" },
      { mark: "Wavy", meaning: "a short attention span; a roving curiosity" },
      { mark: "Crossed by small lines", meaning: "momentous decisions, made and yet to be made" },
    ],
  },
  {
    id: "life",
    numeral: "III",
    title: "The Life Line",
    latin: "Linea Vitalis",
    blurb: "Of the road that widens with weather.",
    whatItTells:
      "The third line wraps the mount of Venus, beneath the thumb. It is not a measure of duration, despite what the parlour pretends — it is a chart of vitality, and of the major weathers a life will pass through.",
    signs: [
      { mark: "Curving wide around the thumb", meaning: "good physical and mental health; a generous arc of years" },
      { mark: "Long and deeply etched", meaning: "vitality; an unhurried supply of energy" },
      { mark: "Forked upward at its end", meaning: "a positive cast of mind; a face turned toward weather" },
      { mark: "A faint sister line alongside", meaning: "someone walks beside you in this stretch; you may already know who" },
      { mark: "Ends toward the base of the index", meaning: "academic achievement; the mind rewarded by the world" },
      { mark: "A break in the line", meaning: "a sudden change of lifestyle; an arc redrawn" },
    ],
  },
  {
    id: "fate",
    numeral: "IV",
    title: "The Fate Line",
    latin: "Linea Saturni",
    blurb: "Of the road that was, and the one taken.",
    whatItTells:
      "The fourth line rises from the base of the palm toward the middle finger — the line of circumstance, of how much of a life is shaped by forces beyond the hand that bears it.",
    signs: [
      { mark: "Deep and unbroken", meaning: "a course strongly governed by fate; a successful life ahead" },
      { mark: "A jog or shift in direction", meaning: "a deliberate change of course, made against advice" },
      { mark: "Joined to the life line at the start", meaning: "self-made; aspirations awakened early" },
      { mark: "Joins the life line in the middle", meaning: "a point at which one's own interests must yield to others" },
      { mark: "A fork toward the end", meaning: "great wealth, of one kind or another, ahead" },
      { mark: "No line at all", meaning: "a comfortable life, but not a noisy one" },
    ],
  },
];
