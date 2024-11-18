const Get = require("./Get");
const Store = require("../Store");
const { StringParser } = require("../parser/");

module.exports = class Type { 
  execute(commands) {
    if(commands.length < 2) {
      throw new Error("Not enough arguments");
    }

    let [_, key] = commands;

    let store = new Store();
    const get = new Get();

    let result = "none";
    if(get.executeCommand(key)) {
      result = store.data[key].type;
    }

    let parser = new StringParser();
    return parser.serialize(result);
  }
}