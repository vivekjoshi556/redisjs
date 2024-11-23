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
    let waitTime = (blockIdx !== -1) ? Number(commands[blockIdx + 1]) : -1; // -1 will be coerced by setTimeout.
    let streamIdx = commands.indexOf("streams");
    let streamsToRead = (commands.length - streamIdx - 1) / 2;
    
    let promises = [];
    for(let i = streamIdx + 1; i <= streamIdx + streamsToRead; i++) {
      promises.push(this.executeCommand(commands[i], commands[i + streamsToRead], waitTime));
    }

    let result = await Promise.all(promises);
    
    let parser = new ArrayParser();
    result = parser.serialize(result);
    return result;
  }

  /**
   * ! What happens if the key doesn't exist.
   */
  async executeCommand(streamName, startKey, waitTime) {
    let store = new Store();
    let stream = store.data[streamName];
    const numKeys = Object.keys(stream.value).length;

    if(startKey === "$") {
      startKey = Object.keys(stream.value)[numKeys - 1];
    }

    if (waitTime === 0) {
      while(Object.keys(stream.value).length === numKeys) {
        startKey = Object.keys(stream.value)[numKeys - 1];
        await sleep(1000);
      }
    }

    await sleep(waitTime);
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

    return [streamName, result.length ? result : null];
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