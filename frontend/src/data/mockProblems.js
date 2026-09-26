export const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    acceptance: "52.4%",
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 6, so return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    starterCodes: {
      cpp: `#include <vector>\n#include <unordered_map>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n    return [];\n}`,
      java: `import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`
    },
    defaultTestCases: [
      { id: 1, label: "Case 1", input: "nums = [2,7,11,15]\ntarget = 9", expected: "[0,1]" },
      { id: 2, label: "Case 2", input: "nums = [3,2,4]\ntarget = 6", expected: "[1,2]" },
      { id: 3, label: "Case 3", input: "nums = [3,3]\ntarget = 6", expected: "[0,1]" }
    ]
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    acceptance: "41.8%",
    statement: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    starterCodes: {
      cpp: `/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode(int x) : val(x), next(nullptr) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        // Write your solution here\n        return nullptr;\n    }\n};`,
      python: `class Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your solution here\n        pass`,
      javascript: `function addTwoNumbers(l1, l2) {\n    // Write your solution here\n    return null;\n}`,
      java: `class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        // Write your solution here\n        return null;\n    }\n}`
    },
    defaultTestCases: [
      { id: 1, label: "Case 1", input: "l1 = [2,4,3]\nl2 = [5,6,4]", expected: "[7,0,8]" },
      { id: 2, label: "Case 2", input: "l1 = [0]\nl2 = [0]", expected: "[0]" }
    ]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    acceptance: "34.5%",
    statement: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(std::string s) {\n        // Write your code\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write code\n        return 0`,
      javascript: `function lengthOfLongestSubstring(s) {\n    // Write code\n    return 0;\n}`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write code\n        return 0;\n    }\n}`
    },
    defaultTestCases: [
      { id: 1, label: "Case 1", input: 's = "abcabcbb"', expected: "3" },
      { id: 2, label: "Case 2", input: 's = "pwwkew"', expected: "3" }
    ]
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    acceptance: "39.1%",
    statement: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000"
    ],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(std::vector<int>& nums1, std::vector<int>& nums2) {\n        return 0.0;\n    }\n};`,
      python: `class Solution:\n    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:\n        return 0.0`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n    return 0.0;\n}`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}`
    },
    defaultTestCases: [
      { id: 1, label: "Case 1", input: "nums1 = [1,3]\nnums2 = [2]", expected: "2.00000" },
      { id: 2, label: "Case 2", input: "nums1 = [1,2]\nnums2 = [3,4]", expected: "2.50000" }
    ]
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "Two Pointers / DP",
    acceptance: "33.2%",
    statement: `Given a string \`s\`, return the longest palindromic substring in \`s\`.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"', explanation: 'Longest palindrome is "bb".' }
    ],
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string longestPalindrome(std::string s) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        return ""`,
      javascript: `function longestPalindrome(s) {\n    return "";\n}`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [
      { id: 1, label: "Case 1", input: 's = "babad"', expected: '"bab"' },
      { id: 2, label: "Case 2", input: 's = "cbbd"', expected: '"bb"' }
    ]
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    difficulty: "Medium",
    category: "Strings",
    acceptance: "46.2%",
    statement: `The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows. Write the code that will take a string and make this conversion given a number of rows.`,
    examples: [{ input: 's = "PAYPALISHIRING", numRows = 3', output: '"PAHNAPLSIIGYIR"', explanation: 'Written zigzag in 3 rows.' }],
    constraints: ["1 <= s.length <= 1000", "1 <= numRows <= 1000"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string convert(std::string s, int numRows) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def convert(self, s: str, numRows: int) -> str:\n        return ""`,
      javascript: `function convert(s, numRows) {\n    return "";\n}`,
      java: `class Solution {\n    public String convert(String s, int numRows) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "PAYPALISHIRING", numRows = 3', expected: '"PAHNAPLSIIGYIR"' }]
  },
  {
    id: 7,
    title: "Reverse Integer",
    difficulty: "Medium",
    category: "Math",
    acceptance: "28.3%",
    statement: `Given a signed 32-bit integer \`x\`, return \`x\` with its digits reversed. If reversing \`x\` causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.`,
    examples: [{ input: "x = 123", output: "321", explanation: "Reverse of 123 is 321." }, { input: "x = -123", output: "-321", explanation: "Sign is preserved." }],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int reverse(int x) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def reverse(self, x: int) -> int:\n        return 0`,
      javascript: `function reverse(x) {\n    return 0;\n}`,
      java: `class Solution {\n    public int reverse(int x) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "x = 123", expected: "321" }, { id: 2, label: "Case 2", input: "x = -123", expected: "-321" }]
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    difficulty: "Medium",
    category: "Strings",
    acceptance: "17.1%",
    statement: `Implement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.`,
    examples: [{ input: 's = "42"', output: "42", explanation: "The parsed integer is 42." }, { input: 's = "   -042"', output: "-42", explanation: "Leading whitespace and sign are handled." }],
    constraints: ["0 <= s.length <= 200"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int myAtoi(std::string s) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def myAtoi(self, s: str) -> int:\n        return 0`,
      javascript: `function myAtoi(s) {\n    return 0;\n}`,
      java: `class Solution {\n    public int myAtoi(String s) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "42"', expected: "42" }]
  },
  {
    id: 9,
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    acceptance: "54.8%",
    statement: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.`,
    examples: [{ input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." }, { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left, it becomes 121-." }],
    constraints: ["-2^31 <= x <= 2^31 - 1"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        return False`,
      javascript: `function isPalindrome(x) {\n    return false;\n}`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        return false;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "x = 121", expected: "true" }, { id: 2, label: "Case 2", input: "x = -121", expected: "false" }]
  },
  {
    id: 10,
    title: "Regular Expression Matching",
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: "28.2%",
    statement: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.`,
    examples: [{ input: 's = "aa", p = "a*"', output: "true", explanation: "'*' means zero or more of 'a'." }],
    constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    bool isMatch(std::string s, std::string p) {\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        return False`,
      javascript: `function isMatch(s, p) {\n    return false;\n}`,
      java: `class Solution {\n    public boolean isMatch(String s, String p) {\n        return false;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "aa", p = "a*"', expected: "true" }]
  },
  {
    id: 11,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "54.7%",
    statement: `You are given an integer array \`height\` of length \`n\`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.`,
    examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is formed between index 1 and 8: 7 * (8 - 1) = 49." }],
    constraints: ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int maxArea(std::vector<int>& height) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def maxArea(self, height: list[int]) -> int:\n        return 0`,
      javascript: `function maxArea(height) {\n    return 0;\n}`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "height = [1,8,6,2,5,4,8,3,7]", expected: "49" }]
  },
  {
    id: 12,
    title: "Integer to Roman",
    difficulty: "Medium",
    category: "Math",
    acceptance: "64.1%",
    statement: `Given an integer \`num\`, convert it to a roman numeral.`,
    examples: [{ input: "num = 3749", output: '"MMMDCCXLIX"', explanation: "3000 = MMM, 700 = DCC, 40 = XL, 9 = IX." }],
    constraints: ["1 <= num <= 3999"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string intToRoman(int num) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def intToRoman(self, num: int) -> str:\n        return ""`,
      javascript: `function intToRoman(num) {\n    return "";\n}`,
      java: `class Solution {\n    public String intToRoman(int num) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "num = 3749", expected: '"MMMDCCXLIX"' }]
  },
  {
    id: 13,
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "Math",
    acceptance: "60.4%",
    statement: `Given a roman numeral, convert it to an integer.`,
    examples: [{ input: 's = "LVIII"', output: "58", explanation: "L = 50, V = 5, III = 3." }],
    constraints: ["1 <= s.length <= 15", "s contains only ('I', 'V', 'X', 'L', 'C', 'D', 'M')."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int romanToInt(std::string s) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def romanToInt(self, s: str) -> int:\n        return 0`,
      javascript: `function romanToInt(s) {\n    return 0;\n}`,
      java: `class Solution {\n    public int romanToInt(String s) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "LVIII"', expected: "58" }]
  },
  {
    id: 14,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "Strings",
    acceptance: "42.1%",
    statement: `Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \`""\`.`,
    examples: [{ input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: '"fl" is common to all 3.' }],
    constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string longestCommonPrefix(std::vector<std::string>& strs) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def longestCommonPrefix(self, strs: list[str]) -> str:\n        return ""`,
      javascript: `function longestCommonPrefix(strs) {\n    return "";\n}`,
      java: `class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 'strs = ["flower","flow","flight"]', expected: '"fl"' }]
  },
  {
    id: 15,
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "34.1%",
    statement: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.`,
    examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Distinct zero-sum triplets." }],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> threeSum(std::vector<int>& nums) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        return []`,
      javascript: `function threeSum(nums) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]" }]
  },
  {
    id: 16,
    title: "3Sum Closest",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "45.7%",
    statement: `Given an integer array \`nums\` of length \`n\` and an integer \`target\`, find three integers in \`nums\` such that the sum is closest to \`target\`. Return the sum of the three integers.`,
    examples: [{ input: "nums = [-1,2,1,-4], target = 1", output: "2", explanation: "The sum that is closest to target is 2 (-1 + 2 + 1 = 2)." }],
    constraints: ["3 <= nums.length <= 500", "-1000 <= nums[i] <= 1000", "-10^4 <= target <= 10^4"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int threeSumClosest(std::vector<int>& nums, int target) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def threeSumClosest(self, nums: list[int], target: int) -> int:\n        return 0`,
      javascript: `function threeSumClosest(nums, target) {\n    return 0;\n}`,
      java: `class Solution {\n    public int threeSumClosest(int[] nums, int target) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [-1,2,1,-4]\ntarget = 1", expected: "2" }]
  },
  {
    id: 17,
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "59.2%",
    statement: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.`,
    examples: [{ input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: "All 2-letter combos." }],
    constraints: ["0 <= digits.length <= 4", "digits[i] is a digit in the range ['2', '9']."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::string> letterCombinations(std::string digits) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def letterCombinations(self, digits: str) -> list[str]:\n        return []`,
      javascript: `function letterCombinations(digits) {\n    return [];\n}`,
      java: `class Solution {\n    public List<String> letterCombinations(String digits) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 'digits = "23"', expected: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }]
  },
  {
    id: 18,
    title: "4Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "36.0%",
    statement: `Given an array \`nums\` of \`n\` integers, return an array of all unique quadruplets \`[nums[a], nums[b], nums[c], nums[d]]\` such that their sum equals \`target\`.`,
    examples: [{ input: "nums = [1,0,-1,0,-2,2], target = 0", output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]", explanation: "Unique 4-tuples summing to 0." }],
    constraints: ["1 <= nums.length <= 200", "-10^9 <= nums[i] <= 10^9"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> fourSum(std::vector<int>& nums, int target) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def fourSum(self, nums: list[int], target: int) -> list[list[int]]:\n        return []`,
      javascript: `function fourSum(nums, target) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> fourSum(int[] nums, int target) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,0,-1,0,-2,2]\ntarget = 0", expected: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" }]
  },
  {
    id: 19,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    acceptance: "44.6%",
    statement: `Given the head of a linked list, remove the \`nth\` node from the end of the list and return its head.`,
    examples: [{ input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]", explanation: "The 2nd node from end (node 4) is removed." }],
    constraints: ["The number of nodes in the list is sz.", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        return head;\n    }\n};`,
      python: `class Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        return head`,
      javascript: `function removeNthFromEnd(head, n) {\n    return head;\n}`,
      java: `class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        return head;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "head = [1,2,3,4,5]\nn = 2", expected: "[1,2,3,5]" }]
  },
  {
    id: 20,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    acceptance: "40.5%",
    statement: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.`,
    examples: [{ input: 's = "()[]{}"', output: "true", explanation: "All brackets close properly." }, { input: 's = "(]"', output: "false", explanation: "Mismatched bracket types." }],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    bool isValid(std::string s) {\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        return False`,
      javascript: `function isValid(s) {\n    return false;\n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "()[]{}"', expected: "true" }, { id: 2, label: "Case 2", input: 's = "(]"', expected: "false" }]
  },
  {
    id: 21,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    acceptance: "63.7%",
    statement: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`. Merge the two lists into one sorted list and return the head of the new merged list.`,
    examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged in ascending order." }],
    constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        return nullptr;\n    }\n};`,
      python: `class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        return None`,
      javascript: `function mergeTwoLists(list1, list2) {\n    return null;\n}`,
      java: `class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "list1 = [1,2,4]\nlist2 = [1,3,4]", expected: "[1,1,2,3,4,4]" }]
  },
  {
    id: 22,
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "74.1%",
    statement: `Given \`n\` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
    examples: [{ input: "n = 3", output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: "5 valid combinations." }],
    constraints: ["1 <= n <= 8"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::string> generateParenthesis(int n) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def generateParenthesis(self, n: int) -> list[str]:\n        return []`,
      javascript: `function generateParenthesis(n) {\n    return [];\n}`,
      java: `class Solution {\n    public List<String> generateParenthesis(int n) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "n = 3", expected: '["((()))","(()())","(())()","()(())","()()()"]' }]
  },
  {
    id: 23,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Heap / Priority Queue",
    acceptance: "51.8%",
    statement: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merged into one sorted list." }],
    constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    ListNode* mergeKLists(std::vector<ListNode*>& lists) {\n        return nullptr;\n    }\n};`,
      python: `class Solution:\n    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:\n        return None`,
      javascript: `function mergeKLists(lists) {\n    return null;\n}`,
      java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "lists = [[1,4,5],[1,3,4],[2,6]]", expected: "[1,1,2,3,4,4,5,6]" }]
  },
  {
    id: 24,
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    category: "Linked List",
    acceptance: "63.5%",
    statement: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes.`,
    examples: [{ input: "head = [1,2,3,4]", output: "[2,1,4,3]", explanation: "1-2 and 3-4 swapped." }],
    constraints: ["The number of nodes in the list is in the range [0, 100].", "0 <= Node.val <= 100"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    ListNode* swapPairs(ListNode* head) {\n        return head;\n    }\n};`,
      python: `class Solution:\n    def swapPairs(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        return head`,
      javascript: `function swapPairs(head) {\n    return head;\n}`,
      java: `class Solution {\n    public ListNode swapPairs(ListNode head) {\n        return head;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "head = [1,2,3,4]", expected: "[2,1,4,3]" }]
  },
  {
    id: 25,
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    category: "Linked List",
    acceptance: "57.8%",
    statement: `Given the head of a linked list, reverse the nodes of the list \`k\` at a time, and return the modified list.`,
    examples: [{ input: "head = [1,2,3,4,5], k = 2", output: "[2,1,4,3,5]", explanation: "Reverse in batches of 2." }],
    constraints: ["1 <= k <= sz <= 5000", "0 <= Node.val <= 1000"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    ListNode* reverseKGroup(ListNode* head, int k) {\n        return head;\n    }\n};`,
      python: `class Solution:\n    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:\n        return head`,
      javascript: `function reverseKGroup(head, k) {\n    return head;\n}`,
      java: `class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        return head;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "head = [1,2,3,4,5], k = 2", expected: "[2,1,4,3,5]" }]
  },
  {
    id: 26,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Two Pointers",
    acceptance: "56.2%",
    statement: `Given an integer array \`nums\` sorted in non-decreasing order, remove duplicates in-place such that each unique element appears only once. Return \`k\` after placing the final result in the first \`k\` slots.`,
    examples: [{ input: "nums = [1,1,2]", output: "2, nums = [1,2,_]", explanation: "k = 2 with elements 1 and 2." }],
    constraints: ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int removeDuplicates(std::vector<int>& nums) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def removeDuplicates(self, nums: list[int]) -> int:\n        return 0`,
      javascript: `function removeDuplicates(nums) {\n    return 0;\n}`,
      java: `class Solution {\n    public int removeDuplicates(int[] nums) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,1,2]", expected: "2" }]
  },
  {
    id: 27,
    title: "Remove Element",
    difficulty: "Easy",
    category: "Arrays",
    acceptance: "56.9%",
    statement: `Given an integer array \`nums\` and an integer \`val\`, remove all occurrences of \`val\` in \`nums\` in-place. Return the number of elements in \`nums\` which are not equal to \`val\`.`,
    examples: [{ input: "nums = [3,2,2,3], val = 3", output: "2, nums = [2,2,_,_]", explanation: "Returns 2." }],
    constraints: ["0 <= nums.length <= 100", "0 <= nums[i] <= 50", "0 <= val <= 100"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int removeElement(std::vector<int>& nums, int val) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def removeElement(self, nums: list[int], val: int) -> int:\n        return 0`,
      javascript: `function removeElement(nums, val) {\n    return 0;\n}`,
      java: `class Solution {\n    public int removeElement(int[] nums, int val) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [3,2,2,3], val = 3", expected: "2" }]
  },
  {
    id: 28,
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    category: "Strings",
    acceptance: "41.9%",
    statement: `Given two strings \`needle\` and \`haystack\`, return the index of the first occurrence of \`needle\` in \`haystack\`, or \`-1\` if \`needle\` is not part of \`haystack\`.`,
    examples: [{ input: 'haystack = "sadbutsad", needle = "sad"', output: "0", explanation: '"sad" starts at index 0.' }],
    constraints: ["1 <= haystack.length, needle.length <= 10^4"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int strStr(std::string haystack, std::string needle) {\n        return -1;\n    }\n};`,
      python: `class Solution:\n    def strStr(self, haystack: str, needle: str) -> int:\n        return -1`,
      javascript: `function strStr(haystack, needle) {\n    return -1;\n}`,
      java: `class Solution {\n    public int strStr(String haystack, String needle) {\n        return -1;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 'haystack = "sadbutsad"\nneedle = "sad"', expected: "0" }]
  },
  {
    id: 29,
    title: "Divide Two Integers",
    difficulty: "Medium",
    category: "Bit Manipulation",
    acceptance: "17.6%",
    statement: `Given two integers \`dividend\` and \`divisor\`, divide two integers without using multiplication, division, and mod operator.`,
    examples: [{ input: "dividend = 10, divisor = 3", output: "3", explanation: "10/3 = 3.33333... truncated to 3." }],
    constraints: ["-2^31 <= dividend, divisor <= 2^31 - 1", "divisor != 0"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int divide(int dividend, int divisor) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def divide(self, dividend: int, divisor: int) -> int:\n        return 0`,
      javascript: `function divide(dividend, divisor) {\n    return 0;\n}`,
      java: `class Solution {\n    public int divide(int dividend, int divisor) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "dividend = 10, divisor = 3", expected: "3" }]
  },
  {
    id: 30,
    title: "Substring with Concatenation of All Words",
    difficulty: "Hard",
    category: "Sliding Window",
    acceptance: "31.9%",
    statement: `You are given a string \`s\` and an array of strings \`words\`. All the strings of \`words\` are of the same length. Return an array of all the starting indices of substring(s) in \`s\` that is a concatenation of each word in \`words\` exactly once.`,
    examples: [{ input: 's = "barfoothefoobarman", words = ["foo","bar"]', output: "[0,9]", explanation: "Substrings starting at 0 and 9 match." }],
    constraints: ["1 <= s.length <= 10^4", "1 <= words.length <= 5000"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<int> findSubstring(std::string s, std::vector<std::string>& words) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def findSubstring(self, s: str, words: list[str]) -> list[int]:\n        return []`,
      javascript: `function findSubstring(s, words) {\n    return [];\n}`,
      java: `class Solution {\n    public List<Integer> findSubstring(String s, String[] words) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "barfoothefoobarman", words = ["foo","bar"]', expected: "[0,9]" }]
  },
  {
    id: 31,
    title: "Next Permutation",
    difficulty: "Medium",
    category: "Two Pointers",
    acceptance: "39.5%",
    statement: `A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographically greater permutation of its integer elements.`,
    examples: [{ input: "nums = [1,2,3]", output: "[1,3,2]", explanation: "Next permutation is [1,3,2]." }],
    constraints: ["1 <= nums.length <= 100", "0 <= nums[i] <= 100"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    void nextPermutation(std::vector<int>& nums) {\n        // Modify in-place\n    }\n};`,
      python: `class Solution:\n    def nextPermutation(self, nums: list[int]) -> None:\n        pass`,
      javascript: `function nextPermutation(nums) {\n    // Modify in-place\n}`,
      java: `class Solution {\n    public void nextPermutation(int[] nums) {\n        // Modify in-place\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,2,3]", expected: "[1,3,2]" }]
  },
  {
    id: 32,
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    category: "Dynamic Programming / Stack",
    acceptance: "33.7%",
    statement: `Given a string containing just the characters '(' and ')', return the length of the longest valid (well-forming) parentheses substring.`,
    examples: [{ input: 's = ")()())"', output: "4", explanation: 'The longest valid parentheses substring is "()()".' }],
    constraints: ["0 <= s.length <= 3 * 10^4"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int longestValidParentheses(std::string s) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def longestValidParentheses(self, s: str) -> int:\n        return 0`,
      javascript: `function longestValidParentheses(s) {\n    return 0;\n}`,
      java: `class Solution {\n    public int longestValidParentheses(String s) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = ")()())"', expected: "4" }]
  },
  {
    id: 33,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    acceptance: "40.8%",
    statement: `There is an integer array \`nums\` sorted in ascending order (with distinct values), possibly rotated at an unknown pivot index. Given the array \`nums\` and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.`,
    examples: [{ input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "Target 0 is found at index 4." }],
    constraints: ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int search(std::vector<int>& nums, int target) {\n        return -1;\n    }\n};`,
      python: `class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        return -1`,
      javascript: `function search(nums, target) {\n    return -1;\n}`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [4,5,6,7,0,1,2]\ntarget = 0", expected: "4" }]
  },
  {
    id: 34,
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    acceptance: "43.9%",
    statement: `Given an array of integers \`nums\` sorted in non-decreasing order, find the starting and ending position of a given \`target\` value. If \`target\` is not found, return \`[-1, -1]\`.`,
    examples: [{ input: "nums = [5,7,7,8,8,10], target = 8", output: "[3,4]", explanation: "Target 8 appears from index 3 to 4." }],
    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "nums is a non-decreasing array."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<int> searchRange(std::vector<int>& nums, int target) {\n        return {-1, -1};\n    }\n};`,
      python: `class Solution:\n    def searchRange(self, nums: list[int], target: int) -> list[int]:\n        return [-1, -1]`,
      javascript: `function searchRange(nums, target) {\n    return [-1, -1];\n}`,
      java: `class Solution {\n    public int searchRange(int[] nums, int target) {\n        return new int[]{-1, -1};\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [5,7,7,8,8,10]\ntarget = 8", expected: "[3,4]" }]
  },
  {
    id: 35,
    title: "Search Insert Position",
    difficulty: "Easy",
    category: "Binary Search",
    acceptance: "46.1%",
    statement: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.`,
    examples: [{ input: "nums = [1,3,5,6], target = 5", output: "2", explanation: "Target 5 is at index 2." }, { input: "nums = [1,3,5,6], target = 2", output: "1", explanation: "2 would be inserted at index 1." }],
    constraints: ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values sorted in ascending order."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int searchInsert(std::vector<int>& nums, int target) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def searchInsert(self, nums: list[int], target: int) -> int:\n        return 0`,
      javascript: `function searchInsert(nums, target) {\n    return 0;\n}`,
      java: `class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,3,5,6]\ntarget = 5", expected: "2" }]
  },
  {
    id: 36,
    title: "Valid Sudoku",
    difficulty: "Medium",
    category: "Matrix / Hash Set",
    acceptance: "59.3%",
    statement: `Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to standard Sudoku rules.`,
    examples: [{ input: "board = [[\"5\",\"3\",\".\",...]]", output: "true", explanation: "Valid configuration." }],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    bool isValidSudoku(std::vector<std::vector<char>>& board) {\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isValidSudoku(self, board: list[list[str]]) -> bool:\n        return False`,
      javascript: `function isValidSudoku(board) {\n    return false;\n}`,
      java: `class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        return false;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "board = [[...]]", expected: "true" }]
  },
  {
    id: 37,
    title: "Sudoku Solver",
    difficulty: "Hard",
    category: "Backtracking",
    acceptance: "60.1%",
    statement: `Write a program to solve a Sudoku puzzle by filling the empty cells.`,
    examples: [{ input: "board = [[\"5\",\"3\",\".\",...]]", output: "Solved board", explanation: "Complete solved board." }],
    constraints: ["board.length == 9", "board[i].length == 9"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    void solveSudoku(std::vector<std::vector<char>>& board) {\n        // solve in-place\n    }\n};`,
      python: `class Solution:\n    def solveSudoku(self, board: list[list[str]]) -> None:\n        pass`,
      javascript: `function solveSudoku(board) {\n    // solve in-place\n}`,
      java: `class Solution {\n    public void solveSudoku(char[][] board) {\n        // solve in-place\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "board = [[...]]", expected: "[[...]]" }]
  },
  {
    id: 38,
    title: "Count and Say",
    difficulty: "Medium",
    category: "Recursion / Strings",
    acceptance: "54.7%",
    statement: `The count-and-say sequence is a sequence of digit strings defined by the recursive formula. Given a positive integer \`n\`, return the \`nth\` element of the sequence.`,
    examples: [{ input: "n = 4", output: '"1211"', explanation: 'countAndSay(1) = "1", countAndSay(2) = "11", countAndSay(3) = "21", countAndSay(4) = "1211".' }],
    constraints: ["1 <= n <= 30"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string countAndSay(int n) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def countAndSay(self, n: int) -> str:\n        return ""`,
      javascript: `function countAndSay(n) {\n    return "";\n}`,
      java: `class Solution {\n    public String countAndSay(int n) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "n = 4", expected: '"1211"' }]
  },
  {
    id: 39,
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "71.0%",
    statement: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order. The same number may be chosen unlimited times.`,
    examples: [{ input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]", explanation: "2 and 3 add up to 7, and 7 equals 7." }],
    constraints: ["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "1 <= target <= 40"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> combinationSum(std::vector<int>& candidates, int target) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:\n        return []`,
      javascript: `function combinationSum(candidates, target) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "candidates = [2,3,6,7]\ntarget = 7", expected: "[[2,2,3],[7]]" }]
  },
  {
    id: 40,
    title: "Combination Sum II",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "54.6%",
    statement: `Given a collection of candidate numbers (\`candidates\`) and a target number (\`target\`), find all unique combinations in \`candidates\` where the candidate numbers sum to \`target\`. Each number in candidates may only be used once in the combination.`,
    examples: [{ input: "candidates = [10,1,2,7,6,1,5], target = 8", output: "[[1,1,6],[1,2,5],[1,7],[2,6]]", explanation: "Each number used at most once." }],
    constraints: ["1 <= candidates.length <= 100", "1 <= candidates[i] <= 50", "1 <= target <= 30"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> combinationSum2(std::vector<int>& candidates, int target) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:\n        return []`,
      javascript: `function combinationSum2(candidates, target) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "candidates = [10,1,2,7,6,1,5]\ntarget = 8", expected: "[[1,1,6],[1,2,5],[1,7],[2,6]]" }]
  },
  {
    id: 41,
    title: "First Missing Positive",
    difficulty: "Hard",
    category: "Arrays & Hashing",
    acceptance: "37.8%",
    statement: `Given an unsorted integer array \`nums\`. Return the smallest positive integer that is not present in \`nums\`. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.`,
    examples: [{ input: "nums = [1,2,0]", output: "3", explanation: "The numbers in the range [1,2] are present, 3 is missing." }, { input: "nums = [3,4,-1,1]", output: "2", explanation: "1 is present, 2 is missing." }],
    constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int firstMissingPositive(std::vector<int>& nums) {\n        return 1;\n    }\n};`,
      python: `class Solution:\n    def firstMissingPositive(self, nums: list[int]) -> int:\n        return 1`,
      javascript: `function firstMissingPositive(nums) {\n    return 1;\n}`,
      java: `class Solution {\n    public int firstMissingPositive(int[] nums) {\n        return 1;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,2,0]", expected: "3" }, { id: 2, label: "Case 2", input: "nums = [3,4,-1,1]", expected: "2" }]
  },
  {
    id: 42,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Two Pointers / Stack",
    acceptance: "61.2%",
    statement: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of rain water are trapped." }],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int trap(std::vector<int>& height) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def trap(self, height: list[int]) -> int:\n        return 0`,
      javascript: `function trap(height) {\n    return 0;\n}`,
      java: `class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" }]
  },
  {
    id: 43,
    title: "Multiply Strings",
    difficulty: "Medium",
    category: "Math / Strings",
    acceptance: "40.4%",
    statement: `Given two non-negative integers \`num1\` and \`num2\` represented as strings, return the product of \`num1\` and \`num2\`, also represented as a string.`,
    examples: [{ input: 'num1 = "2", num2 = "3"', output: '"6"', explanation: "2 * 3 = 6." }, { input: 'num1 = "123", num2 = "456"', output: '"56088"', explanation: "123 * 456 = 56088." }],
    constraints: ["1 <= num1.length, num2.length <= 200", "num1 and num2 consist of digits only."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::string multiply(std::string num1, std::string num2) {\n        return "";\n    }\n};`,
      python: `class Solution:\n    def multiply(self, num1: str, num2: str) -> str:\n        return ""`,
      javascript: `function multiply(num1, num2) {\n    return "";\n}`,
      java: `class Solution {\n    public String multiply(String num1, String num2) {\n        return "";\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 'num1 = "123"\nnum2 = "456"', expected: '"56088"' }]
  },
  {
    id: 44,
    title: "Wildcard Matching",
    difficulty: "Hard",
    category: "Dynamic Programming",
    acceptance: "28.5%",
    statement: `Given an input string (\`s\`) and a pattern (\`p\`), implement wildcard pattern matching with support for \`'?'\` and \`'*'\`.`,
    examples: [{ input: 's = "aa", p = "*"', output: "true", explanation: "'*' matches any sequence." }],
    constraints: ["0 <= s.length, p.length <= 2000"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    bool isMatch(std::string s, std::string p) {\n        return false;\n    }\n};`,
      python: `class Solution:\n    def isMatch(self, s: str, p: str) -> bool:\n        return False`,
      javascript: `function isMatch(s, p) {\n    return false;\n}`,
      java: `class Solution {\n    public boolean isMatch(String s, String p) {\n        return false;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 's = "aa", p = "*"', expected: "true" }]
  },
  {
    id: 45,
    title: "Jump Game II",
    difficulty: "Medium",
    category: "Greedy / DP",
    acceptance: "45.0%",
    statement: `You are given a 0-indexed array of integers \`nums\` of length \`n\`. You are initially positioned at \`nums[0]\`. Return the minimum number of jumps to reach \`nums[n - 1]\`.`,
    examples: [{ input: "nums = [2,3,1,1,4]", output: "2", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." }],
    constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    int jump(std::vector<int>& nums) {\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def jump(self, nums: list[int]) -> int:\n        return 0`,
      javascript: `function jump(nums) {\n    return 0;\n}`,
      java: `class Solution {\n    public int jump(int[] nums) {\n        return 0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [2,3,1,1,4]", expected: "2" }]
  },
  {
    id: 46,
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "77.9%",
    statement: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in any order.`,
    examples: [{ input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", explanation: "All 6 permutations." }],
    constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All integers of nums are unique."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> permute(std::vector<int>& nums) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def permute(self, nums: list[int]) -> list[list[int]]:\n        return []`,
      javascript: `function permute(nums) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,2,3]", expected: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }]
  },
  {
    id: 47,
    title: "Permutations II",
    difficulty: "Medium",
    category: "Backtracking",
    acceptance: "59.2%",
    statement: `Given a collection of numbers, \`nums\`, that might contain duplicates, return all possible unique permutations in any order.`,
    examples: [{ input: "nums = [1,1,2]", output: "[[1,1,2],[1,2,1],[2,1,1]]", explanation: "3 unique permutations." }],
    constraints: ["1 <= nums.length <= 8", "-10 <= nums[i] <= 10"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<int>> permuteUnique(std::vector<int>& nums) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def permuteUnique(self, nums: list[int]) -> list[list[int]]:\n        return []`,
      javascript: `function permuteUnique(nums) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<Integer>> permuteUnique(int[] nums) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "nums = [1,1,2]", expected: "[[1,1,2],[1,2,1],[2,1,1]]" }]
  },
  {
    id: 48,
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Matrix",
    acceptance: "74.4%",
    statement: `You are given an n x n 2D \`matrix\` representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.`,
    examples: [{ input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Clockwise 90-degree rotation." }],
    constraints: ["n == matrix.length == matrix[i].length", "1 <= n <= 20"],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    void rotate(std::vector<std::vector<int>>& matrix) {\n        // rotate in-place\n    }\n};`,
      python: `class Solution:\n    def rotate(self, matrix: list[list[int]]) -> None:\n        pass`,
      javascript: `function rotate(matrix) {\n    // rotate in-place\n}`,
      java: `class Solution {\n    public void rotate(int[][] matrix) {\n        // rotate in-place\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", expected: "[[7,4,1],[8,5,2],[9,6,3]]" }]
  },
  {
    id: 49,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    acceptance: "68.3%",
    statement: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: "Grouped by identical letter counts." }],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    std::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {\n        return {};\n    }\n};`,
      python: `class Solution:\n    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:\n        return []`,
      javascript: `function groupAnagrams(strs) {\n    return [];\n}`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expected: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }]
  },
  {
    id: 50,
    title: "Pow(x, n)",
    difficulty: "Medium",
    category: "Math / Binary Exponentiation",
    acceptance: "35.1%",
    statement: `Implement \`pow(x, n)\`, which calculates \`x\` raised to the power \`n\` (i.e., \`x^n\`).`,
    examples: [{ input: "x = 2.00000, n = 10", output: "1024.00000", explanation: "2^10 = 1024." }, { input: "x = 2.10000, n = 3", output: "9.26100", explanation: "2.1^3 = 9.261." }],
    constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31 - 1", "n is an integer."],
    starterCodes: {
      cpp: `class Solution {\npublic:\n    double myPow(double x, int n) {\n        return 0.0;\n    }\n};`,
      python: `class Solution:\n    def myPow(self, x: float, n: int) -> float:\n        return 0.0`,
      javascript: `function myPow(x, n) {\n    return 0.0;\n}`,
      java: `class Solution {\n    public double myPow(double x, int n) {\n        return 0.0;\n    }\n}`
    },
    defaultTestCases: [{ id: 1, label: "Case 1", input: "x = 2.00000\nn = 10", expected: "1024.00000" }, { id: 2, label: "Case 2", input: "x = 2.00000\nn = -2", expected: "0.25000" }]
  }
];
