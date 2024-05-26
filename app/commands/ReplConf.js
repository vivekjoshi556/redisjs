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
      return parser.serialize(["REPLCONF", "ACK", "0"])
    }
    else if(subcommand === 'ack') {
      return null;
    }
  }
}