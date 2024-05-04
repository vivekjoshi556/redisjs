const { StringParser } = require("../parser/")

module.exports = class Command { 
  execute(commands) {
    let parser = new StringParser();
    return parser.serialize("OK");
  }
}