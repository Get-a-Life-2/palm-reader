// Geometry for the four primary palm lines as drawn over the specimen plate.
// Used by both PalmTracing (post-upload sweep) and InteractivePalm (landing page
// scroll narrative) so the chart stays a single source of truth.
//
// Coordinates are in the cartouche's 600 x 720 viewBox.

export type LineId = "heart" | "head" | "life" | "fate";

export type PalmLine = {
  id: LineId;
  numeral: "I" | "II" | "III" | "IV";
  label: string;
  latin: string;
  d: string;
  len: number;
  delay: number;
  annotation: { x: number; y: number };
  endpoints: ReadonlyArray<readonly [number, number]>;
};

export const PALM_LINES: readonly PalmLine[] = [
  {
    id: "heart",
    numeral: "I",
    label: "Heart Line",
    latin: "Linea Mensalis",
    d: "M 110 220 C 180 180, 270 175, 360 200 C 410 215, 450 215, 480 200",
    len: 470,
    delay: 0,
    annotation: { x: 500, y: 196 },
    endpoints: [
      [110, 220],
      [360, 200],
      [480, 200],
    ],
  },
  {
    id: "head",
    numeral: "II",
    label: "Head Line",
    latin: "Linea Cephalica",
    d: "M 130 280 C 200 270, 300 285, 400 320 C 440 335, 460 340, 470 345",
    len: 460,
    delay: 700,
    annotation: { x: 490, y: 350 },
    endpoints: [
      [130, 280],
      [400, 320],
    ],
  },
  {
    id: "life",
    numeral: "III",
    label: "Life Line",
    latin: "Linea Vitalis",
    d: "M 150 230 C 130 290, 145 360, 200 440 C 220 470, 240 490, 260 500",
    len: 480,
    delay: 1400,
    annotation: { x: 270, y: 510 },
    endpoints: [
      [150, 230],
      [200, 440],
      [260, 500],
    ],
  },
  {
    id: "fate",
    numeral: "IV",
    label: "Fate Line",
    latin: "Linea Saturni",
    d: "M 320 510 C 320 460, 315 400, 325 340 C 332 290, 330 250, 325 220",
    len: 350,
    delay: 2100,
    annotation: { x: 350, y: 220 },
    endpoints: [
      [320, 510],
      [325, 220],
    ],
  },
];

export function findLine(id: LineId): PalmLine {
  const line = PALM_LINES.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown palm line: ${id}`);
  return line;
}
