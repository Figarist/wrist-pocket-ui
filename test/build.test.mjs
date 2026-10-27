import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTPUTS, SOURCES, parseTokens } from '../scripts/build.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
const tokens = new Map(parseTokens());

test('derived files are up to date', () => {
  for (const [rel, build] of Object.entries(OUTPUTS)) {
    assert.equal(read(rel), build(), `${rel} is stale: run node scripts/build.mjs`);
  }
});

test('every var(--wp-*) used by the sources is defined in tokens.css', () => {
  for (const file of SOURCES) {
    for (const [, name] of read(file).matchAll(/var\((--wp-[a-z0-9-]+)/g)) {
      assert.ok(tokens.has(name), `${file} uses undefined token ${name}`);
    }
  }
});

test('colours live only in tokens.css', () => {
  for (const file of SOURCES.filter((f) => f !== 'tokens.css')) {
    const hits = read(file).replace(/\/\*[\s\S]*?\*\//g, '').match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g);
    assert.equal(hits, null, `${file} has literal colours: ${hits}`);
  }
});

// WCAG 2.x relative luminance contrast.
function luminance(hex) {
  const n = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}
export function contrast(fg, bg) {
  const [a, b] = [luminance(tokens.get(fg)), luminance(tokens.get(bg))].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const PAIRS = [
  ['--wp-text-primary', '--wp-bg-app', 7],
  ['--wp-text-secondary', '--wp-bg-surface', 7],
  ['--wp-text-tertiary', '--wp-bg-surface-elevated', 4.5],
  ['--wp-accent', '--wp-bg-app', 7],
  ['--wp-accent-ink', '--wp-accent', 7],
  ['--wp-accent-purple', '--wp-bg-app', 7],
  ['--wp-ok', '--wp-bg-surface', 4.5],
  ['--wp-warn', '--wp-bg-surface', 4.5],
  ['--wp-err', '--wp-bg-surface', 4.5],
  ['--wp-info', '--wp-bg-surface', 4.5],
];

test('documented text pairs meet their WCAG level', () => {
  for (const [fg, bg, min] of PAIRS) {
    const ratio = contrast(fg, bg);
    assert.ok(ratio >= min, `${fg} on ${bg} = ${ratio.toFixed(2)} < ${min}`);
  }
});

test('README contrast table matches the tokens', () => {
  const readme = read('README.md');
  for (const [fg, bg] of PAIRS) {
    const row = readme.split('\n').find((l) => l.includes(`\`${fg}\``) && l.includes(`\`${bg}\``));
    assert.ok(row, `README has no contrast row for ${fg} on ${bg}`);
    assert.ok(row.includes(`${contrast(fg, bg).toFixed(2)}:1`), `README ratio for ${fg} on ${bg} is outdated`);
  }
});
