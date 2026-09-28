'use strict';

/**
 * One entry per problem, describing exactly enough about the C++ "Solution"
 * method for the harness generator to call it and print its result:
 *
 *   fn            - method name on class Solution
 *   params        - [{ name, type }] in declaration order. `name` must match
 *                   the variable name used in the problem's testcase inputs.
 *   returns       - C++ return type, or null for `void` methods
 *   mutatesParam  - for void methods: which param to print *after* calling
 *                   the method (the method mutates it in place)
 *   sortDepth     - 0 (default) = exact order matters
 *                   1 = the outer result array is an unordered set
 *                   2 = outer array AND each element's inner array are both
 *                       unordered (e.g. group anagrams)
 *
 * Types use the same spelling as the starter code (std::vector<int>, etc.)
 * so the generated harness matches the signature the student is completing.
 */

const VEC_INT = 'std::vector<int>';
const VEC_STR = 'std::vector<std::string>';
const VEC_VEC_INT = 'std::vector<std::vector<int>>';
const VEC_VEC_CHAR = 'std::vector<std::vector<char>>';
const VEC_VEC_STR = 'std::vector<std::vector<std::string>>';
const VEC_LISTNODE = 'std::vector<ListNode*>';

const problemSpecs = {
  1: { fn: 'twoSum', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: VEC_INT },
  2: { fn: 'addTwoNumbers', params: [{ name: 'l1', type: 'ListNode*' }, { name: 'l2', type: 'ListNode*' }], returns: 'ListNode*' },
  3: { fn: 'lengthOfLongestSubstring', params: [{ name: 's', type: 'std::string' }], returns: 'int' },
  4: { fn: 'findMedianSortedArrays', params: [{ name: 'nums1', type: VEC_INT }, { name: 'nums2', type: VEC_INT }], returns: 'double' },
  5: { fn: 'longestPalindrome', params: [{ name: 's', type: 'std::string' }], returns: 'std::string' },
  6: { fn: 'convert', params: [{ name: 's', type: 'std::string' }, { name: 'numRows', type: 'int' }], returns: 'std::string' },
  7: { fn: 'reverse', params: [{ name: 'x', type: 'int' }], returns: 'int' },
  8: { fn: 'myAtoi', params: [{ name: 's', type: 'std::string' }], returns: 'int' },
  9: { fn: 'isPalindrome', params: [{ name: 'x', type: 'int' }], returns: 'bool' },
  10: { fn: 'isMatch', params: [{ name: 's', type: 'std::string' }, { name: 'p', type: 'std::string' }], returns: 'bool' },
  11: { fn: 'maxArea', params: [{ name: 'height', type: VEC_INT }], returns: 'int' },
  12: { fn: 'intToRoman', params: [{ name: 'num', type: 'int' }], returns: 'std::string' },
  13: { fn: 'romanToInt', params: [{ name: 's', type: 'std::string' }], returns: 'int' },
  14: { fn: 'longestCommonPrefix', params: [{ name: 'strs', type: VEC_STR }], returns: 'std::string' },
  15: { fn: 'threeSum', params: [{ name: 'nums', type: VEC_INT }], returns: VEC_VEC_INT, sortDepth: 1 },
  16: { fn: 'threeSumClosest', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: 'int' },
  17: { fn: 'letterCombinations', params: [{ name: 'digits', type: 'std::string' }], returns: VEC_STR, sortDepth: 1 },
  18: { fn: 'fourSum', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: VEC_VEC_INT, sortDepth: 1 },
  19: { fn: 'removeNthFromEnd', params: [{ name: 'head', type: 'ListNode*' }, { name: 'n', type: 'int' }], returns: 'ListNode*' },
  20: { fn: 'isValid', params: [{ name: 's', type: 'std::string' }], returns: 'bool' },
  21: { fn: 'mergeTwoLists', params: [{ name: 'list1', type: 'ListNode*' }, { name: 'list2', type: 'ListNode*' }], returns: 'ListNode*' },
  22: { fn: 'generateParenthesis', params: [{ name: 'n', type: 'int' }], returns: VEC_STR, sortDepth: 1 },
  23: { fn: 'mergeKLists', params: [{ name: 'lists', type: VEC_LISTNODE }], returns: 'ListNode*' },
  24: { fn: 'swapPairs', params: [{ name: 'head', type: 'ListNode*' }], returns: 'ListNode*' },
  25: { fn: 'reverseKGroup', params: [{ name: 'head', type: 'ListNode*' }, { name: 'k', type: 'int' }], returns: 'ListNode*' },
  26: { fn: 'removeDuplicates', params: [{ name: 'nums', type: VEC_INT }], returns: 'int' },
  27: { fn: 'removeElement', params: [{ name: 'nums', type: VEC_INT }, { name: 'val', type: 'int' }], returns: 'int' },
  28: { fn: 'strStr', params: [{ name: 'haystack', type: 'std::string' }, { name: 'needle', type: 'std::string' }], returns: 'int' },
  29: { fn: 'divide', params: [{ name: 'dividend', type: 'int' }, { name: 'divisor', type: 'int' }], returns: 'int' },
  30: { fn: 'findSubstring', params: [{ name: 's', type: 'std::string' }, { name: 'words', type: VEC_STR }], returns: VEC_INT, sortDepth: 1 },
  31: { fn: 'nextPermutation', params: [{ name: 'nums', type: VEC_INT }], returns: null, mutatesParam: 'nums' },
  32: { fn: 'longestValidParentheses', params: [{ name: 's', type: 'std::string' }], returns: 'int' },
  33: { fn: 'search', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: 'int' },
  34: { fn: 'searchRange', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: VEC_INT },
  35: { fn: 'searchInsert', params: [{ name: 'nums', type: VEC_INT }, { name: 'target', type: 'int' }], returns: 'int' },
  36: { fn: 'isValidSudoku', params: [{ name: 'board', type: VEC_VEC_CHAR }], returns: 'bool' },
  37: { fn: 'solveSudoku', params: [{ name: 'board', type: VEC_VEC_CHAR }], returns: null, mutatesParam: 'board' },
  38: { fn: 'countAndSay', params: [{ name: 'n', type: 'int' }], returns: 'std::string' },
  39: { fn: 'combinationSum', params: [{ name: 'candidates', type: VEC_INT }, { name: 'target', type: 'int' }], returns: VEC_VEC_INT, sortDepth: 1 },
  40: { fn: 'combinationSum2', params: [{ name: 'candidates', type: VEC_INT }, { name: 'target', type: 'int' }], returns: VEC_VEC_INT, sortDepth: 1 },
  41: { fn: 'firstMissingPositive', params: [{ name: 'nums', type: VEC_INT }], returns: 'int' },
  42: { fn: 'trap', params: [{ name: 'height', type: VEC_INT }], returns: 'int' },
  43: { fn: 'multiply', params: [{ name: 'num1', type: 'std::string' }, { name: 'num2', type: 'std::string' }], returns: 'std::string' },
  44: { fn: 'isMatch', params: [{ name: 's', type: 'std::string' }, { name: 'p', type: 'std::string' }], returns: 'bool' },
  45: { fn: 'jump', params: [{ name: 'nums', type: VEC_INT }], returns: 'int' },
  46: { fn: 'permute', params: [{ name: 'nums', type: VEC_INT }], returns: VEC_VEC_INT, sortDepth: 1 },
  47: { fn: 'permuteUnique', params: [{ name: 'nums', type: VEC_INT }], returns: VEC_VEC_INT, sortDepth: 1 },
  48: { fn: 'rotate', params: [{ name: 'matrix', type: VEC_VEC_INT }], returns: null, mutatesParam: 'matrix' },
  49: { fn: 'groupAnagrams', params: [{ name: 'strs', type: VEC_STR }], returns: VEC_VEC_STR, sortDepth: 2 },
  50: { fn: 'myPow', params: [{ name: 'x', type: 'double' }, { name: 'n', type: 'int' }], returns: 'double' },
};

module.exports = { problemSpecs };
