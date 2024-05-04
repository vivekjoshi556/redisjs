const { StringParser } = require("../parser/")

module.exports = class Ping { 
  execute(commands) {
    let arg = null;
    if(commands.length > 1) arg = commands[1];

    let parser = new StringParser();
    let result = arg ? arg : "PONG";
    result = parser.serialize(result);

    return result;
  }
}