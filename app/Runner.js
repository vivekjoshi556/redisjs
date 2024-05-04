const {Echo, Ping, Command} = require('./commands/');

const commandFactory = {
  "echo": Echo,
  "ping": Ping,
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