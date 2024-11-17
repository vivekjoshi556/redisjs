const { StringParser, ErrParser } = require("../parser/");

module.exports = class Del { 
  constructor({connection}) {
    this.connection = connection;
  }
  execute(commands) {
    if(!this.connection['transaction'])
      return new ErrParser().serialize("ERR", "DISCARD without MULTI");

    this.connection['transaction'] = false;
    this.connection['transactionQueue'] = [];

    let parser = new StringParser();
    return parser.serialize("OK");
  }
}