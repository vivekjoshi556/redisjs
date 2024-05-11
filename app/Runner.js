const {Echo, Ping, Command, Set, Get, Info, ReplConf, Psync} = require('./commands/');

const commandFactory = {
  "set": Set,
  "get": Get,
  "echo": Echo,
  "ping": Ping,
  "info": Info,
  "command": Command,
  "replconf": ReplConf,
  "psync": Psync,
}

module.exports = class Runner {
  execute(commands) {
    let command = commandFactory[commands[0].toLowerCase()]
    if(!command) 
      throw new Error('Command Not Found')
    let commandRunner = new command();
    let result = commandRunner.execute(commands);
    return result
  }
}

module.exports.commandFactory = commandFactory;