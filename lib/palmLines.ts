// Geometry for the four primary palm lines as drawn over the specimen plate.
// Used by both PalmTracing (post-upload sweep) and InteractivePalm (landing page
// scroll narrative) so the chart stays a single source of truth.
//
// Coordinates are in the cartouche's 600 x 720 viewBox.

export type LineId = "heart" | "head" | "life" | "fate" | "mercury";

export type PalmLine = {
  id: LineId;
  numeral: "I" | "II" | "III" | "IV" | "V";
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
    label: "Girdle of Venus",
    latin: "Cingulum Veneris",
    d: "M 280 296 C 288 308, 298 319, 315 323 C 328 325, 338 323, 343 322",
    len: 120,
    delay: 0,
    annotation: { x: 395, y: 320 },
    endpoints: [
      [280, 296],
      [343, 322],
    ],
  },
  {
    id: "head",
    numeral: "II",
    label: "Head Line",
    latin: "Linea Cephalica",
    d: "M 245 345 C 262 351, 285 362, 306 373 C 328 385, 350 400, 365 409",
    len: 160,
    delay: 700,
    annotation: { x: 420, y: 408 },
    endpoints: [
      [245, 345],
      [365, 409],
    ],
  },
  {
    id: "life",
    numeral: "III",
    label: "Life Line",
    latin: "Linea Vitalis",
    d: "M 244 354 C 253 365, 262 378, 274 400 C 281 416, 287 440, 289 470",
    len: 150,
    delay: 1400,
    annotation: { x: 345, y: 478 },
    endpoints: [
      [244, 354],
      [289, 470],
    ],
  },
  {
    id: "fate",
    numeral: "IV",
    label: "Fate Line",
    latin: "Linea Saturni",
    d: "M 311 305 C 311 328, 310 354, 310 371 C 309 382, 308 390, 308 395",
    len: 100,
    delay: 2100,
    annotation: { x: 365, y: 300 },
    endpoints: [
      [311, 305],
      [308, 395],
    ],
  },
  {
    id: "mercury",
    numeral: "V",
    label: "Mercury Line",
    latin: "Linea Mercurii",
    d: "M 369 375 C 362 384, 355 396, 343 418 C 337 432, 331 447, 329 455",
    len: 110,
    delay: 2800,
    annotation: { x: 430, y: 455 },
    endpoints: [
      [369, 375],
      [329, 455],
    ],
  },
];

export function findLine(id: LineId): PalmLine {
  const line = PALM_LINES.find((l) => l.id === id);
  if (!line) throw new Error(`Unknown palm line: ${id}`);
  return line;
}
