const { StringParser } = require("../parser/");

module.exports = class Del { 
  constructor({connection}) {
    this.connection = connection;
  }
  execute(commands) {

    this.connection['transaction'] = false;
    this.connection['transactionQueue'] = [];

    let parser = new StringParser();
    return parser.serialize("OK");
  }
}