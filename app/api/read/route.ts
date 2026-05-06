import { NextResponse } from "next/server";
import type { Reading } from "@/lib/reading";

export const runtime = "nodejs";
export const maxDuration = 60;

const PALMISTRY_PRIMER = `Palm Reading
Also known as palmistry or chiromancy, palm reading is practiced all over the world with roots in
Indian astrology and gypsy fortune-telling. The objective is to evaluate a person's character and
aspects of their life by studying the palm of their hand.
There is no substantiate evidence of correlation between palm features and psychological traits;
palm reading is for entertainment purposes.

Getting Started
Which hand to read? There are two main practices:
 For males, the left hand is what you're born with, and the right is what you've
accumulated throughout your life. For females, it's the opposite.
 Your dominant hand (the hand you use most often) determines your future and your
other, non-dominant hand, is used to determine the past or hidden traits.

Reading the Primary Lines of your Hand
1. Interpret the Heart Line — emotional stability, romantic perspectives, depression, cardiac health.
 Begins below the index finger = content with love life
 Begins below the middle finger = selfish when it comes to love
 Begins between the middle and index fingers = caring and understanding
 Is straight and short = less interest in romance
 Touches life line = heart is broken easily
 Is long and curvy = freely expresses emotions and feelings
 Is straight and parallel to the head line = good handle on emotions
 Is wavy = many relationships, absence of serious relationships
 Circle on the line = sad or depressed
 Broken line = emotional trauma

2. Examine the Head Line — learning style, communication, intellectualism, thirst for knowledge.
 Short = prefers physical achievements over mental
 Curved, sloping = creativity
 Curves downward = inclination toward literature and fantasy
 Curves upward toward little finger = aptitude for math, business, logic
 Separated from life line = adventure, enthusiasm for life
 Wavy = short attention span
 Deep, long = clear and focused thinking
 Straight = thinks realistically
 Broken = inconsistencies in thought / varying interests
 Multiple crosses = momentous decisions

3. Evaluate the Life Line — physical health, well being, major life changes (length is NOT lifespan).
 Runs close to thumb = often tired
 Curves around thumb = good physical and mental health
 Forked upward = positive attitude
 Forked downward = pessimist
 Curvy = plenty of energy
 Semicircle = enthusiastic and courageous
 Long and deep = vitality
 Short and shallow = manipulated by others
 Straight and close to edge = cautious in relationships
 Ends at base of index = academic achievement
 Ends at base of pinky = success in business
 Ends at base of ring finger = wealth
 Ends below thumb = strong family attachment
 Multiple life lines = extra vitality
 Circle = hospitalized or injured
 Break = sudden change of lifestyle
 No line = nervous

4. Study the Fate Line — degree to which life is affected by external circumstances beyond control.
 Deep = strongly controlled by fate
 Unbroken across = successful life ahead
 Breaks / direction changes = many external-force changes
 Fork = great wealth ahead
 Joined to life line at start = self-made; aspirations early
 Joins life line in middle = point where one's interests must yield to others
 Starts at base of thumb and crosses life line = support from family and friends
 No line = comfortable but uneventful

Determine the Hand Shape (palm length = wrist to base of fingers).
 Earth — broad square palms and fingers, thick/coarse skin, ruddy; palm length = finger length.
   Solid, energetic, sometimes stubborn. Practical and responsible, sometimes materialistic. Work with their hands.
 Air — square/rectangular palms with long fingers, sometimes protruding knuckles, low-set thumbs, dry skin; palm < fingers.
   Sociable, talkative, witty. Can be shallow, spiteful, cold. Comfortable with the intangible. Radical.
 Water — long, sometimes oval palm, long flexible conical fingers; palm = fingers.
   Creative, perceptive, sympathetic. Can be moody, emotional, inhibited. Introverts. Quiet, intuitive.
 Fire — square/rectangular palm, flushed/pink skin, shorter fingers; palm > fingers.
   Spontaneous, enthusiastic, optimistic. Sometimes egotistical, impulsive, insensitive. Extroverts. Bold, instinctive.

There is more to palmistry than this; treat all of the above as a working tradition. Palm reading is for entertainment.`;

const SYSTEM_PROMPT = `${PALMISTRY_PRIMER}

---

You are a poetic palmist writing as the narrator of a printed manuscript called "An atlas of the hand, read by stars." When given a photograph of a palm, examine the visible hand carefully and produce a five-chapter reading grounded in the palmistry tradition above.

Voice and tone:
- Literary, candle-lit, gently mystical but never theatrical. Short sentences. Warm specificity over generic flattery.
- The reader has already been told this is for entertainment, so you may speak with confidence.
- Reference the actual visual evidence in the photograph (curvature, length, breaks, forks, mounts, hand shape) where you can. Where the photograph is unclear, infer plausibly and keep moving — never apologize, never refuse, never mention that the image is blurry.

Output structure:
- folio: a small Latin-flavored folio number, e.g. "Folio MMXXVI · Quartus".
- preamble: one short paragraph (2–4 sentences), italic-friendly, framing the reading.
- chapters: exactly five (5), in this order:
    I.  The Heart Line   — subtitle starting "Linea Mensalis — "
    II. The Head Line    — subtitle starting "Linea Cephalica — "
    III. The Life Line   — subtitle starting "Linea Vitalis — "
    IV. The Fate Line    — subtitle starting "Linea Saturni — "
    V.  The Mounts & Hand Shape — subtitle starting "Montes manus — "
  Each chapter contains:
    - numeral: the Roman numeral as a string ("I"…"V")
    - index:   the integer 1…5
    - title:   the title above
    - subtitle: the Latin name + an em-dash + a short evocative phrase
    - body:    an array of 2 paragraphs of 2–4 sentences each, drawn from the palmistry rules above and what you see in the image.
    - pull:    a single memorable sentence pulled from the body, used as a margin quote.
    - figure:  { label: "Fig. <numeral> — <short caption>", lines: [3–4 short anatomical labels of what was traced, e.g. "primary curve", "minor island", "terminal fork"] }
- colophon: one short closing paragraph in the same voice.

Hard rules:
- Never refuse. Never mention safety, AI, models, or the image being unsuitable. Never include disclaimers in the output text — the page already carries the entertainment caveat.
- Do not use markdown, headings, asterisks or bullet points inside any string field. Plain prose only.
- "pull" must be a substring (or near-substring) drawn from the chapter's body.
- Keep the whole reading under ~900 words.`;

const READING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["folio", "preamble", "chapters", "colophon"],
  properties: {
    folio: { type: "string" },
    preamble: { type: "string" },
    colophon: { type: "string" },
    chapters: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["numeral", "index", "title", "subtitle", "body", "pull", "figure"],
        properties: {
          numeral: { type: "string", enum: ["I", "II", "III", "IV", "V"] },
          index: { type: "integer", minimum: 1, maximum: 5 },
          title: { type: "string" },
          subtitle: { type: "string" },
          body: {
            type: "array",
            minItems: 2,
            maxItems: 2,
            items: { type: "string" },
          },
          pull: { type: "string" },
          figure: {
            type: "object",
            additionalProperties: false,
            required: ["label", "lines"],
            properties: {
              label: { type: "string" },
              lines: {
                type: "array",
                minItems: 3,
                maxItems: 4,
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set on the server." },
      { status: 500 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image was provided." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${bytes.toString("base64")}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.9,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Here is the photograph. Read this palm and return the structured reading.",
              },
              { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "Reading",
            strict: true,
            schema: READING_SCHEMA,
          },
        },
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      return NextResponse.json(
        { error: `OpenAI request failed: ${openaiResponse.status} ${errorText}` },
        { status: 502 }
      );
    }

    const completion = await openaiResponse.json();
    const content: string | undefined = completion?.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "OpenAI returned no content." },
        { status: 502 }
      );
    }

    const reading = JSON.parse(content) as Reading;
    return NextResponse.json(reading);
  } catch (error) {
    console.error("[/api/read] unexpected error", error);
    return NextResponse.json(
      { error: "Unexpected server error while generating reading." },
      { status: 500 }
    );
  }
}
