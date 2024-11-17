const { StringParser } = require("../parser");

module.exports = class Multi { 
  execute(commands) {
    return new StringParser().serialize("OK");
  }
}