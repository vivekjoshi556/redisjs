const Config = require("../Config");
const { StringParser, ArrayParser } = require("../parser/");

module.exports = class ReplConf { 
  execute(commands) {
    let section;

    if(commands.length > 1)
      section = commands[1];

    const subcommand = commands[1].toLowerCase();
    if(['listening-port', 'capa'].indexOf(subcommand) !== -1) {  
      let parser = new StringParser();
      return parser.serialize("OK");
    }
    else if(subcommand === 'getack') {
      let parser = new ArrayParser();
      const config = new Config();
      return parser.serialize(["REPLCONF", "ACK", `${config.replication.slave_repl_offset}`])
    }
    else if(subcommand === 'ack') {
      return null;
    }
  }
}