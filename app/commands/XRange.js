const Get = require('./Get');
const Store = require("../Store");
const { ArrayParser } = require("../parser");

module.exports = class XRange {

  execute(commands) {
    if(commands.length < 2) {
      throw new Error("Not enough arguments");
    }
    
    const [_, key, start, end] = commands;

    const store = new Store();
    const parser = new ArrayParser();

    store.data[key]
  }
}