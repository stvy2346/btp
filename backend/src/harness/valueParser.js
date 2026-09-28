'use strict';

/**
 * The problem bank writes testcase inputs as one or more "name = value"
 * assignments, separated by either a comma or a newline, e.g.:
 *
 *   "nums = [2,7,11,15]\ntarget = 9"
 *   "dividend = 10, divisor = 3"
 *   's = "aa", p = "a*"'
 *
 * The separator is ambiguous on its own (commas also appear inside array
 * literals), so we track bracket depth and quote state and only split on a
 * comma/newline that sits outside both. Every individual value happens to
 * already be valid JSON (numbers, quoted strings, nested arrays, booleans),
 * so once a segment is isolated we hand it straight to JSON.parse.
 */

function splitTopLevel(input) {
  const segments = [];
  let depth = 0;
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuotes) {
      current += ch;
      if (ch === '\\' && i + 1 < input.length) {
        // Preserve the escaped character verbatim (e.g. \" or \\).
        current += input[++i];
        continue;
      }
      if (ch === '"') inQuotes = false;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      current += ch;
      continue;
    }

    if (ch === '[') depth++;
    if (ch === ']') depth--;

    if (depth === 0 && (ch === ',' || ch === '\n')) {
      if (current.trim().length > 0) segments.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim().length > 0) segments.push(current.trim());
  return segments;
}

/**
 * Parses a testcase input string into an ordered map of { name -> value },
 * preserving declaration order (used when a spec can't match by name).
 */
function parseNamedValues(input) {
  const segments = splitTopLevel(input);
  const result = new Map();

  for (const segment of segments) {
    const eqIdx = segment.indexOf('=');
    if (eqIdx === -1) {
      throw new Error(`Malformed testcase input segment (missing "="): ${segment}`);
    }
    const name = segment.slice(0, eqIdx).trim();
    const rawValue = segment.slice(eqIdx + 1).trim();

    let value;
    try {
      value = JSON.parse(rawValue);
    } catch (err) {
      throw new Error(`Could not parse value for "${name}" as JSON: ${rawValue}`);
    }
    result.set(name, value);
  }

  return result;
}

/**
 * Parses an expected/actual output string the same way (a single bare JSON
 * value rather than name=value pairs).
 */
function parseOutputValue(output) {
  const trimmed = String(output).trim();
  return JSON.parse(trimmed);
}

module.exports = { splitTopLevel, parseNamedValues, parseOutputValue };
