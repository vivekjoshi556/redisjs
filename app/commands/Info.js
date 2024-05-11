const Config = require("../Config");
const { BulkStringParser } = require("../parser/");

module.exports = class Info { 
  execute(commands) {
    let section;

    if(commands.length > 1)
      section = commands[1];

    let config = new Config();
    
    return getReplicationSection(config);
  }
}

function getReplicationSection(config) {
  let parser = new BulkStringParser();
  let result = "";
  for(let key in config.replication) {
    result += key + ":" + config.replication[key] + "\n";
  }
  
  result = result.trim();
  return parser.serialize(result);
}
