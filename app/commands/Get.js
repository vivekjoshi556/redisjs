const Store = require("../Store");
const { BulkStringParser } = require("../parser/");

module.exports = class Get { 
  execute(commands) {
    // ['GET', <key>]
    if(commands.length < 2) 
      throw new Error("Not enough arguments");

    let result = this.executeCommand(commands[1]);
    let parser = new BulkStringParser();
    result = parser.serialize(result);
    return result;
  }

  executeCommand(key) {
    let store = new Store();
    
    // If the key is not present or,
    // If the key is invalid now and hasn't been deleted yet.
    if(store.data[key] === undefined || (store.data[key].expiry && store.data[key].expiry <= new Date().getTime())) {
      return null;
    }

    return store.data[key].value;
  }
}