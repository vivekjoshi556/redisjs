const {Echo, Ping, Command, Set, Get, Info} = require('./commands/');

const commandFactory = {
  "set": Set,
  "get": Get,
  "echo": Echo,
  "ping": Ping,
  "info": Info,
  "command": Command,
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