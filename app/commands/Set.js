const replicateEvent = require("../ReplicateEvent");
const Store = require("../Store");
const { StringParser, ArrayParser } = require("../parser/");
const Del = require("./Del");

module.exports = class Set { 
  execute(commands) {
    // ['SET', <key>, <value>, [<px>, <expiry>]]
    if(commands.length < 3) {
      throw new Error("Not enough arguments");
    }

    let [_, key, value, __ , expiry] = commands;

    this.executeCommand(key, value, expiry);
    let parser = new StringParser();
    return parser.serialize("OK");
  }

  executeCommand(key, value, expiry) {
    let store = new Store();
    store.data[key] = {value}

    if(expiry) {
      const time = new Date().getTime();
      let expiryTime = time + parseInt(expiry);
      
      store.data[key].expiry = expiryTime;

      setTimeout(() => {
        let arrayParser = new ArrayParser();
        // Emit the event for replicas.
        replicateEvent.emit('replicate', arrayParser.serialize(['del', key]));
        const del = new Del();
        del.executeCommand(key);
      }, parseInt(expiry));
    }
  }
}