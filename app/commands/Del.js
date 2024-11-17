const Store = require("../Store");
const { StringParser } = require("../parser/");

module.exports = class Del { 
  execute(commands) {
    if(commands.length < 2) {
      throw new Error("Not enough arguments");
    }

    let [_, key] = commands;

    this.executeCommand(key);

    let parser = new StringParser();
    return parser.serialize("OK");
  }

  executeCommand(key) {
    let store = new Store();
    delete store.data[key];
  }
}