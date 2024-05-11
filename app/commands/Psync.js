const Config = require("../Config");
const { StringParser } = require("../parser/");

module.exports = class Psync { 
  execute(commands) {
    let section;

    if(commands.length > 1)
      section = commands[1];

    let parser = new StringParser();
    const config = new Config();
    return parser.serialize(`FULLRESYNC ${config.replication.master_replid} 0`);
  }
}