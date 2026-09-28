'use strict';

function escapeCppString(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function cppStringLiteral(str) {
  return `"${escapeCppString(str)}"`;
}

function cppCharLiteral(str) {
  // Board cells arrive as length-1 strings, e.g. "5" or ".".
  const ch = String(str)[0] ?? ' ';
  const escaped = ch === '\\' ? '\\\\' : ch === "'" ? "\\'" : ch;
  return `'${escaped}'`;
}

/**
 * Renders a parsed JS value as a C++ initializer expression matching the
 * given (spec-declared) C++ type.
 */
function toCppLiteral(value, cppType) {
  switch (cppType) {
    case 'int':
    case 'long':
    case 'long long':
      return String(Math.trunc(value));

    case 'double':
    case 'float':
      return String(value);

    case 'bool':
      return value ? 'true' : 'false';

    case 'std::string':
      if (typeof value !== 'string') {
        throw new Error(`Expected a string value, got ${JSON.stringify(value)}`);
      }
      return cppStringLiteral(value);

    case 'std::vector<int>': {
      const items = value.map((v) => String(Math.trunc(v)));
      return `std::vector<int>{${items.join(',')}}`;
    }

    case 'std::vector<double>': {
      const items = value.map((v) => String(v));
      return `std::vector<double>{${items.join(',')}}`;
    }

    case 'std::vector<std::string>': {
      const items = value.map((v) => cppStringLiteral(v));
      return `std::vector<std::string>{${items.join(',')}}`;
    }

    case 'std::vector<std::vector<int>>': {
      const rows = value.map((row) => `std::vector<int>{${row.map((v) => String(Math.trunc(v))).join(',')}}`);
      return `std::vector<std::vector<int>>{${rows.join(',')}}`;
    }

    case 'std::vector<std::vector<char>>': {
      const rows = value.map((row) => `std::vector<char>{${row.map((v) => cppCharLiteral(v)).join(',')}}`);
      return `std::vector<std::vector<char>>{${rows.join(',')}}`;
    }

    case 'ListNode*': {
      const items = value.map((v) => String(Math.trunc(v)));
      return `buildList(std::vector<int>{${items.join(',')}})`;
    }

    case 'std::vector<ListNode*>': {
      const items = value.map(
        (arr) => `buildList(std::vector<int>{${arr.map((v) => String(Math.trunc(v))).join(',')}})`
      );
      return `std::vector<ListNode*>{${items.join(',')}}`;
    }

    default:
      throw new Error(`toCppLiteral: unsupported C++ type "${cppType}"`);
  }
}

module.exports = { toCppLiteral, cppStringLiteral, cppCharLiteral, escapeCppString };
