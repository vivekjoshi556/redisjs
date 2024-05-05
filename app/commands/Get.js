const Store = require("../Store");
const { BulkStringParser } = require("../parser/");

module.exports = class Get { 
  execute(commands) {
    if(commands.length < 2) 
      throw new Error("Not enough arguments");

    let store = new Store({});
    if(store.data[commands[1]] === undefined) {
      return new BulkStringParser().serialize(null);
    }

    let parser = new BulkStringParser();
    return parser.serialize(store.data[commands[1]]);
  }
}