const BulkStringParser = require("./BulkStringParser");

module.exports = class ArrayParser {
  constructor(types) {
    this.types = types;
  }

  parse(lines, at) {
    let len = parseInt(lines[at].slice(1))
    let next = at + 1;
    let result = []
    
    for(let i = 0; i < len; i++) {
      let parser = new this.types[lines[next][0]](this.types)
      let res = parser.parse(lines, next);
      result.push(res.result);
      next = res.next;
    }
    
    return {
      result: result,
      next: next
    }
  }

  serialize(data) {
    if(!Array.isArray(data)) {
      throw new Error(`Types must be Array for ArrayParser got: ${data}`)
    }

    let parser = new BulkStringParser();

    let result = `*${data.length}\r\n`;

    for (let item of data) {
      if (typeof item === "number") {
        item = item.toString();
      }
      result += parser.serialize(item);
    }

    return result;
  }
}