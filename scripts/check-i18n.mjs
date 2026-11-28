#!/usr/bin/env node
// Verifies 5-language (en, uk, pl, ru, ko) i18n completeness and consistency in index.html:
//   1. 100% key parity across en, uk, pl, ru, ko (no missing, extra, or empty values).
//   2. Every data-i18n* attribute in index.html resolves to a key in all 5 locales.
//   3. Zero Ukrainian-specific Cyrillic letters (є, ї, і, ґ) leak into en, pl, ru, or ko.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');

const match = html.match(/\/\*\s*I18N_START\s*\*\/([\s\S]*?)\/\*\s*I18N_END\s*\*\//);
if (!match) {
  console.error('Could not find /* I18N_START */ ... /* I18N_END */ block in index.html');
  process.exit(1);
}

const sandbox = {};
vm.runInNewContext(`${match[1]}\nthis.__I18N__ = I18N;`, sandbox);
const I18N = sandbox.__I18N__;

const LOCALES = ['en', 'uk', 'pl', 'ru', 'ko'];
const UKRAINIAN_CYRILLIC_RE = /[єіїґЄІЇҐ]/;

function flatten(obj, prefix = '') {
  const out = new Map();
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [ck, cv] of flatten(v, key)) out.set(ck, cv);
    } else {
      out.set(key, v);
    }
  }
  return out;
}

const errors = [];
const flattened = {};

for (const locale of LOCALES) {
  if (!I18N || typeof I18N[locale] !== 'object') {
    errors.push(`Missing locale object: ${locale}`);
    continue;
  }
  flattened[locale] = flatten(I18N[locale]);
}

if (errors.length === 0) {
  const baseKeys = [...flattened.en.keys()].sort();

  for (const locale of LOCALES) {
    const map = flattened[locale];
    for (const key of baseKeys) {
      if (!map.has(key)) {
        errors.push(`[${locale}] Missing key: ${key}`);
      } else {
        const val = map.get(key);
        if (typeof val !== 'string' || val.trim() === '') {
          errors.push(`[${locale}] Empty or non-string value for key: ${key}`);
        } else if (locale !== 'uk' && UKRAINIAN_CYRILLIC_RE.test(val)) {
          errors.push(`[${locale}] Ukrainian Cyrillic leak in "${key}": ${val}`);
        }
      }
    }
    for (const key of map.keys()) {
      if (!flattened.en.has(key)) {
        errors.push(`[${locale}] Extra key not in en: ${key}`);
      }
    }
  }

  // Verify every data-i18n* attribute in index.html exists in all 4 locales.
  const attrRe = /data-i18n(?:-(?:html|placeholder|aria-label|title|content))?="([^"]+)"/g;
  const usedKeys = new Set();
  for (const m of html.matchAll(attrRe)) {
    usedKeys.add(m[1]);
  }
  for (const key of usedKeys) {
    for (const locale of LOCALES) {
      if (!flattened[locale].has(key)) {
        errors.push(`HTML attribute references missing key "${key}" in locale "${locale}"`);
      }
    }
  }

  // Verify dynamic key used in inline JS for contrast level.
  for (const dynamicKey of ['contrast.decorationOnly']) {
    for (const locale of LOCALES) {
      if (!flattened[locale].has(dynamicKey)) {
        errors.push(`JS references missing key "${dynamicKey}" in locale "${locale}"`);
      }
    }
  }

  if (errors.length === 0) {
    console.log(`i18n check passed: ${baseKeys.length} keys x ${LOCALES.length} locales, ${usedKeys.size} HTML attributes verified.`);
  }
}

if (errors.length > 0) {
  console.error('i18n check failed:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}
