'use strict';

const FLOAT_TOLERANCE = 1e-4;

/**
 * Several problems (3Sum, permutations, group anagrams, ...) have more than
 * one valid output ordering. `sortDepth` tells us how many levels of nested
 * arrays should be treated as unordered sets when comparing:
 *   0 -> exact order matters everywhere (the default)
 *   1 -> the outer array is unordered, but each element is compared as-is
 *        (e.g. a list of triplets: the triplets can appear in any order,
 *        but the numbers *within* a triplet must stay in the order the
 *        solution produced them)
 *   2 -> the outer array AND each element one level in are both unordered
 *        (e.g. group anagrams: groups can appear in any order, and the
 *        words within a group can too)
 */
function canonicalize(value, depth) {
  if (!Array.isArray(value)) return value;

  const mapped = value.map((v) => canonicalize(v, Math.max(depth - 1, 0)));

  if (depth > 0) {
    mapped.sort((a, b) => {
      const sa = JSON.stringify(a);
      const sb = JSON.stringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
  }

  return mapped;
}

function deepEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isInteger(a) && Number.isInteger(b)) return a === b;
    return Math.abs(a - b) < FLOAT_TOLERANCE;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  return a === b;
}

/**
 * Compares parsed `expected` and `actual` values, honoring the problem's
 * declared sortDepth (unordered-ness) and using float tolerance for numbers.
 */
function valuesMatch(expected, actual, sortDepth = 0) {
  const normExpected = canonicalize(expected, sortDepth);
  const normActual = canonicalize(actual, sortDepth);
  return deepEqual(normExpected, normActual);
}

module.exports = { valuesMatch, canonicalize, deepEqual, FLOAT_TOLERANCE };
