'use strict';

/**
 * Shared preamble prepended to every generated C++ submission, ahead of the
 * student's own `class Solution { ... }`. It provides:
 *   - the standard headers + `using namespace std;`
 *   - a family of `toJson(...)` overloads that render a C++ value back into
 *     the same JSON-flavoured text the problem bank's `expected` strings use
 *     (e.g. `[0,1]`, `"bab"`, `true`, `2.00000`), so the Node side can just
 *     JSON.parse() both sides and diff them
 *   - the `ListNode` definition + a `buildList` helper, since the starter
 *     templates only show that struct in a comment (LeetCode itself defines
 *     it out of view) — harmless to include even for problems that don't
 *     use linked lists.
 *
 * This is always the same text; only the student's code and the generated
 * `main()` change between problems.
 */
const CPP_PREAMBLE = `// ==== Generated harness preamble (do not edit) ====
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* buildList(const std::vector<int>& v) {
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int x : v) {
        tail->next = new ListNode(x);
        tail = tail->next;
    }
    return dummy.next;
}

string __escapeJsonString(const string& s) {
    string out = "\\"";
    for (char c : s) {
        if (c == '"' || c == '\\\\') out += '\\\\';
        out += c;
    }
    out += "\\"";
    return out;
}

string toJson(int x) { return std::to_string(x); }
string toJson(long x) { return std::to_string(x); }
string toJson(long long x) { return std::to_string(x); }
string toJson(unsigned x) { return std::to_string(x); }
string toJson(bool b) { return b ? "true" : "false"; }
string toJson(double x) {
    std::ostringstream ss;
    ss << std::fixed << std::setprecision(5) << x;
    return ss.str();
}
string toJson(const string& s) { return __escapeJsonString(s); }
string toJson(char c) { return __escapeJsonString(string(1, c)); }

template <typename T>
string toJson(const std::vector<T>& v) {
    string out = "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i) out += ",";
        out += toJson(v[i]);
    }
    out += "]";
    return out;
}

string toJson(ListNode* head) {
    std::vector<int> vals;
    while (head) {
        vals.push_back(head->val);
        head = head->next;
    }
    return toJson(vals);
}
// ==== End generated harness preamble ====
`;

module.exports = { CPP_PREAMBLE };
