// everyday-things-two-lines — entrypoint.
//
// The entry is two lines about a toaster, written for a 10-year-old.
// Line 1 explains the toaster through one analogy; line 2 says what
// that analogy maps and what it leaves out. This program is the only
// thing the grader runs: it writes those two lines to
// /output/entry.txt so the judge reads exactly those bytes. The gate
// takes UTF-8 text of 1 to 400 characters, not only white space, in
// exactly two lines.
//
// Usage outside the grader container:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The two lines of the entry, kept as separate strings so the line
// count is visible in the code and cannot drift by accident.
const ENTRY_LINES = [
  "A toaster is a tiny sunbed for bread: two slices lie back under glowing wires to catch a tan, then pop up once they're golden brown.",
  "The sunbed picture works because both brown something with steady heat until a timer calls time, but it leaves out that bread can't choose its tan and the glow comes from electric wires, not the sun.",
];

// Where the grader expects the finished text. Locally we fall back to
// the MAKEFUN_OUTPUT_DIR stand-in; inside the grader container it is
// /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate refuses anything outside 1 to 400 characters, anything that
// is only white space, and anything that is not exactly two lines — so
// refuse loudly here instead of shipping text the judge will never see.
const ENTRY_TEXT = ENTRY_LINES.join('\n');

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (ENTRY_LINES.length !== 2) {
  fail(`entry has ${ENTRY_LINES.length} lines; the competition needs exactly 2`);
}

for (const [index, line] of ENTRY_LINES.entries()) {
  const lineNumber = index + 1;
  if (!line.trim()) {
    fail(`line ${lineNumber} is empty`);
  }
  // Each line must be a single sentence: exactly one full stop, at the
  // very end, and no other sentence-ending mark anywhere in the line.
  const fullStops = (line.match(/\./g) ?? []).length;
  if (fullStops !== 1 || !line.endsWith('.') || /[?!]/.test(line)) {
    fail(`line ${lineNumber} is not a single sentence`);
  }
}

if (ENTRY_TEXT.length < 1 || ENTRY_TEXT.length > 400 || !ENTRY_TEXT.trim()) {
  fail(`entry is ${ENTRY_TEXT.length} characters; the gate needs 1-400`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'entry.txt'), ENTRY_TEXT, 'utf8');
console.log(`wrote entry.txt (${ENTRY_LINES.length} lines, ${ENTRY_TEXT.length} characters)`);
