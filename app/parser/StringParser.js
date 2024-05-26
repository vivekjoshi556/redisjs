module.exports = class StringParser {
  parse(lines, at) {
    return {
      result: lines[at].substring(1),
      next: at + 1
    };
  }

  serialize(str) {
    return `+${str}\r\n`;
  }
}