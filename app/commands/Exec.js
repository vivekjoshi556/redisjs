const { ErrParser } = require("../parser");

module.exports = class Multi {
  constructor({connection, runner}) {
    this.connection = connection;
    this.runner = runner;
  }

  execute(_) {
    if(!this.connection['transaction'])
        return new ErrParser().serialize("ERR", "EXEC without MULTI");

    let result = `*${this.connection['transactionQueue'].length}\r\n`;
    this.connection['transaction'] = false;
    while(this.connection['transactionQueue'].length > 0) {
        const command = this.connection['transactionQueue'].shift();

        result += this.runner.execute(command.command, command.input, this.connection);
    }

    return result;
  }
}