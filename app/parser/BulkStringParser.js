module.exports = class BulkStringParser {
  parse(lines, at) {
    // Handle RDB file which might have other command at end.
    if(lines[at + 1].startsWith("REDIS0011")) {
      // Should work based on length of expected vs actual.
      let trailIdx = lines[at + 1].indexOf('*');
      if(trailIdx !== -1) {
        lines.splice(at + 2, 0, lines[at + 1].substring(trailIdx));
        lines[at + 1] = lines[at + 1].substring(0, trailIdx);
      }
    }
    return {
      next: at + 2, 
      result: lines[at + 1]
    }
  }

  serialize(str) {
    if(str === null) return "$-1\r\n"; // nil object
    return `$${str.length}\r\n${str}\r\n`;
  }
}