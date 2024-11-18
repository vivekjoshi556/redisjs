const Get = require('./Get');
const Store = require("../Store");
const { ErrParser, BulkStringParser } = require("../parser");

module.exports = class XAdd { 
  args(commands) {
    let key = commands[1];
    let entries = [{
      "id": commands[2], 
      "data": commands.slice(3)
    }];

    return { key, entries }
  }

  execute(commands) {
    if(commands.length < 4) {
      throw new Error("Not enough arguments");
    }

    let { key, entries } = this.args(commands);

    let result = "";
    try {
      result = this.executeCommand(key, entries);
    } catch(err) {
      return new ErrParser().serialize("ERR", err.message);
    }

    let parser = new BulkStringParser();
    return parser.serialize(result);
  }
  
  executeCommand(key, entries) {
    let store = new Store();
    const get = new Get();

    let value = get.executeCommand(key);
    let lastId = value === null ? value : Object.keys(value)[Object.keys(value).length - 1];

    console.log(lastId);
    for(let entry of entries) {
      let entryId = entry['id'];
      let data = entry['data'];
    
      entryId = this.getId(entryId, lastId);
      // If this is the first value initialize it.
      if(!value) {
        store.data[key] = {value: {}, type: "stream"};
      }
  
      store.data[key].value[entryId] = data;
      lastId = entryId;
    }
    return lastId
  }

// XADD grape 1-1 pineapple mango
// XADD grape 1-2 strawberry grape
// XADD grape 1-2 blueberry banana
  getId(id, lastId) {
    console.log(id, lastId);
    if(id === "0-0")
      throw new Error("The ID specified in XADD must be greater than 0-0");

    // Complete auto-generation.
    if(id === "*") return `${Date.now()}-0`;

    let [idMilli, idSeq] = id.split("-").map(Number);

    // This is the first entry.
    if(!lastId) {
      // Sequence generation.
      if (id.endsWith("*")) return `${idMilli}-${idMilli === 0 ? 1 : 0}`;
      return id;
    }

    let [lastIdMilli, lastIdSeq] = lastId.split("-").map(Number);

    if(lastIdMilli > idMilli)
      throw new Error("The ID specified in XADD is equal or smaller than the target stream top item");
  
    // Sequence generation.
    if(id.endsWith("*"))
      return `${idMilli}-${lastIdMilli === idMilli ? lastIdSeq + 1 : 0}`;

    if(idMilli === lastIdMilli && lastIdSeq >= idSeq)
      throw new Error("The ID specified in XADD is equal or smaller than the target stream top item");

    return id;
  }
}