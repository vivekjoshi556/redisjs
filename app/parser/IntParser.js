module.exports = class IntParser {
  parse(lines, at) {
    return {
      result: parseInt(lines[at].slice(1)),
      next: next
    }
  }

  serialize(data) {
    if(parseInt(data) === NaN) {
      throw new Error(`Type must be Integer got: ${data}`)
    }

    return `:${data}\r\n`;
  }
}