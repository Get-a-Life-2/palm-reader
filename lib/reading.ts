export type Chapter = {
  numeral: string;
  index: number;
  title: string;
  subtitle: string;
  body: string[];
  pull: string;
  figure: { label: string; lines: string[] };
};

export type Reading = {
  folio: string;
  preamble: string;
  chapters: Chapter[];
  colophon: string;
};

const READINGS: Reading[] = [
  {
    folio: "Folio MMXXVI · Quartus",
    preamble:
      "By the cartography of your right hand, in this hour of slow weather, the lines have drawn themselves into a chart not unlike a small night sky. What follows is a translation, attempted in good faith.",
    colophon:
      "Read in candle-hours by an instrument of paper and patience. Take what is useful. Leave the rest beneath the table.",
    chapters: [
      {
        numeral: "I",
        index: 1,
        title: "The Heart Line",
        subtitle: "Linea Mensalis — of the river that knows its own banks",
        body: [
          "Your heart line begins gently and curves upward toward the index, the way a river bends to find a friendlier slope. This says you love by choosing, not by drowning. You do not mistake intensity for truth.",
          "There is a small island near its midpoint — a season of doubt, kept private. It will not return. Where the line forks at its end, it speaks of two affections in your life that will never quite agree, and never quite need to.",
        ],
        pull: "You love by choosing, not by drowning.",
        figure: {
          label: "Fig. I — the heart line, traced",
          lines: ["primary curve", "minor island", "terminal fork"],
        },
      },
      {
        numeral: "II",
        index: 2,
        title: "The Head Line",
        subtitle: "Linea Cephalica — of the lantern carried into rooms",
        body: [
          "Long, with a clean slope, your head line moves like a thought given time. You are most yourself when the question is open — when the answer is not yet asked of you. Closed rooms make you brittle. Long walks make you wise.",
          "A faint chain near its origin marks a year of unsettled sleep, already passing. The line strengthens beyond it. You will write something down soon that you have been afraid to write down. It will turn out to be the easy part.",
        ],
        pull: "You will write something down soon that you have been afraid to write down.",
        figure: {
          label: "Fig. II — the head line and its chain",
          lines: ["origin chain", "ascending slope", "deep terminus"],
        },
      },
      {
        numeral: "III",
        index: 3,
        title: "The Life Line",
        subtitle: "Linea Vitalis — of the road that widens with weather",
        body: [
          "Wide and unhurried, your life line wraps the mount of Venus with a generous arc. This is not a line about length; it is a line about breadth. You will know more weathers than most. The arc tells me you do not flinch from any of them.",
          "A small parallel line — what palmists call a sister line — runs alongside for a stretch. Someone walks beside you in this stretch, even when you are alone. You already know who.",
        ],
        pull: "You will know more weathers than most.",
        figure: {
          label: "Fig. III — the life line and its sister",
          lines: ["principal arc", "sister line", "minor branchings"],
        },
      },
      {
        numeral: "IV",
        index: 4,
        title: "The Fate Line",
        subtitle: "Linea Saturni — of the road that was, and the one taken",
        body: [
          "Your fate line begins lower than most, near the wrist. Early commitments — possibly inherited, possibly assumed — set your course. But the line does something interesting near the head line: it shifts. A small jog to one side. This is a deliberate change of direction, made by you, against advice.",
          "Above that shift, the line is straighter and brighter than below. You did the right thing. The chart confirms it.",
        ],
        pull: "You did the right thing. The chart confirms it.",
        figure: {
          label: "Fig. IV — the fate line, with its deliberate jog",
          lines: ["lower stem", "jog of intent", "ascendant"],
        },
      },
      {
        numeral: "V",
        index: 5,
        title: "The Mounts",
        subtitle: "Montes manus — small hills, and what grows on them",
        body: [
          "Venus is full but not crowded — affection without compulsion. Jupiter, beneath the index, sits high enough to suggest leadership without the appetite for being seen leading. The mount of Luna is the most pronounced: imagination is your weather, not your hobby.",
          "Saturn is quiet, which is unusually merciful. Mercury is restless and warm — words come easy to you, and they land softly. The moon-side of the hand is, in your case, the side to trust.",
        ],
        pull: "Imagination is your weather, not your hobby.",
        figure: {
          label: "Fig. V — the mounts, with relative elevations",
          lines: ["Venus", "Jupiter", "Luna (pronounced)", "Mercury"],
        },
      },
    ],
  },
];

export function getReading(): Reading {
  return READINGS[0];
}
