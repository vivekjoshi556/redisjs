const Store = require("../Store");
const { sleep } = require("../util");
const { ArrayParser } = require("../parser");

module.exports = class XRead {
  async execute(commands) {
    if(commands.length < 4) {
      throw new Error("Not enough arguments");
    }

    if(commands.length % 2 !== 0) {
      throw new Error("Improper command arguments.");
    }

    let blockIdx = commands.indexOf("block");
    let waitTime = (blockIdx !== -1) ? Number(commands[blockIdx + 1]) : 0;

    await sleep(waitTime);
    
    let result= [];
    let streamIdx = commands.indexOf("streams");
    let streamsToRead = (commands.length - streamIdx - 1) / 2;
    
    for(let i = streamIdx + 1; i <= streamIdx + streamsToRead; i++) {
      let res = this.executeCommand(commands[i], commands[i + streamsToRead])
      if(res.length === 0) {
        res = null;
      }

      result.push([commands[i], res]);
    }
    
    let parser = new ArrayParser();
    result = parser.serialize(result);
    return result;
  }

  /**
   * ! What happens if the key doesn't exist.
   */
  executeCommand(streamName, startKey) {
    let store = new Store();
    let stream = store.data[streamName];
    let items = Object.keys(stream.value);
    
    if (startKey !== "-") {
      startKey = items.includes(startKey) ? items.indexOf(startKey) + 1 : this.findNextKey(startKey);
    } else {
      startKey = 0;
    }

    let result = []

    for (let idx = startKey; idx < items.length; idx++) {
      result.push([items[idx], stream.value[items[idx]]]);
    }

    return result;
  }

  findNextKey(sortedList, key) {
    let low = 0;
    let high = sortedList.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (sortedList[mid] === key) {
        return mid + 1;
      }

      if (sortedList[mid] < key) {
        low = mid + 1;
      }
      else {
        high = mid - 1;
      }
    }

    return low < sortedList.length ? low : sortedList.length;
  }
}