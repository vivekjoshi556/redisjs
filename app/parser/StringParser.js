module.exports = class StringParser {
  parse(lines, at) {
    return lines[at].substring(1);
  }

  serialize(str) {
    return `+${str}\r\n`;
  }
}