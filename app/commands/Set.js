const Store = require("../Store");
const { StringParser } = require("../parser/");

module.exports = class Set { 
  execute(commands) {
    if(commands.length < 3) 
      throw new Error("Not enough arguments");

    let store = new Store({});
    store.data[commands[1]] = commands[2];
    let parser = new StringParser();
    return parser.serialize("OK");
  }
}