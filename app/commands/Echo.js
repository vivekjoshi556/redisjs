const { StringParser, BulkStringParser } = require("../parser/");

module.exports = class Echo { 
  execute(commands) {
    let arg = "PONG";
    if(commands.length > 1) arg = commands[1];

    let parser = arg ? new BulkStringParser() : new StringParser();
    return parser.serialize(arg);
  }
}