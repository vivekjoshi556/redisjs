const Get = require("./Get");
const Set = require("./Set");
const { isValidNum } = require("../util");
const { IntParser, ErrParser } = require("../parser");

module.exports = class Incr { 
  execute(commands) {
    if(commands.length < 2) {
      throw new Error("Not enough arguments");
    }

    let key = commands[1];

    const get = new Get();
    const set = new Set();
    const intParser = new IntParser();
    const errParser = new ErrParser();

    let result = get.executeCommand(key);

    // If the value doesn't already exist set the value.
    if (result == null) {
      set.executeCommand(key, "1");
      result = 1;
    } else {
      // If the value is not a valid number.
      if(!isValidNum(result)) {
        return errParser.serialize('ERR', 'value is not an integer or out of range');
      }
      else {
        set.executeCommand(key, String(parseInt(result) + 1));
        result = parseInt(result) + 1;
      }
    }

    return intParser.serialize(result);
  }
}