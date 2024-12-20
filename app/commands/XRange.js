const Store = require("../Store");
const { ArrayParser } = require("../parser");

module.exports = class XRange {
  execute(commands) {
    if(commands.length < 2) {
      throw new Error("Not enough arguments");
    }
    
    let streamName = commands[1];
    let startKey = commands.length < 3 ? "-" : commands[2];
    let endKey = commands.length < 4 ? "+" : commands[3];

    let result = this.executeCommand(streamName, startKey, endKey);
    let parser = new ArrayParser();
    result = parser.serialize(result);
    return result;
  }

  /**
   * ! What happens if the key doesn't exist.
   */
  executeCommand(streamName, startKey, endKey) {
    let store = new Store();
    let stream = store.data[streamName];
    let items = Object.keys(stream.value);
    
    if (startKey !== "-") {
      startKey = items.includes(startKey) ? items.indexOf(startKey) : this.findNextKey(startKey);
    } else {
      startKey = 0;
    }

    let result = []

    for (let idx = startKey; idx < items.length; idx++) {
      if (endKey !== "+" && items[idx] > endKey) break;

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
        return mid;
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