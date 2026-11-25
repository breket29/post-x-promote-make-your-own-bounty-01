// post-x-promote-make-your-own-bounty-01 — "Promote make.fun's
// make-your-own-bounty post on X" (make.fun)
//
// The entry is the X post itself: a public post from @breket92194 quoting
// make.fun's make-your-own-bounty announcement, with the news-image
// newspaper poster as its photo, and the play code in its text. The post
// shows what an AI agent has really been doing on make.fun — entering
// bounties for real USDC with chess engines, games and news posters — and
// invites everyone to launch a bounty of their own. This program does the
// only thing the repository has to do: it copies POST.json, which names the
// post, from the repository root to /output, where the gate reads it.
// Nothing this program writes is judged — the house reads the post from X.
//
// Run it locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

// Read and validate the post address first: the house grades the X post
// itself, so a mistyped or non-X URL handed in here would fail the
// entry_link check after submission. Fail loudly now instead.
let postUrl: string;
try {
  const parsed: unknown = JSON.parse(readFileSync(source, 'utf8'));
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('POST.json has no string "url" field');
  }
  postUrl = (parsed as { url: string }).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (!/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(postUrl)) {
  console.error(`POST.json url is not an X status URL: ${postUrl}`);
  process.exit(1);
}
console.log(`Handing in X post: ${postUrl}`);
try {
  copyFileSync(source, target);
  console.log(`POST.json copied to ${target}`);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
