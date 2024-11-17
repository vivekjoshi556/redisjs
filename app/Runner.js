const Replica = require("./Replica");
const replicateEvent = require("./ReplicateEvent");
const {Echo, Ping, Del, Command, Set, Get, Info, ReplConf, Psync, Incr} = require('./commands/');

const commandFactory = {
  "set": Set,
  "get": Get,
  "del": Del,
  "echo": Echo,
  "ping": Ping,
  "info": Info,
  "incr": Incr,
  "command": Command,
  "replconf": ReplConf,
  "psync": Psync,
}

const writeCommands = ["set", "del"]

/**
 * This is the runner class that takes output commands from Parser
 * and executes those commands.
 */
module.exports = class Runner {
  execute(command, input, connection) {
    let commandName = command[0].toLowerCase();

    // Check for a replica
    if(commandName === 'psync') {
			const replica = new Replica();
			replica.addReplica(connection);
		}
    
    // Check if needs to be propagated to replicas.
    if(writeCommands.indexOf(commandName) !== -1) {
      replicateEvent.emit('replicate', input);
    }

    if(!commandFactory[commandName]) {
      throw new Error(`Command Not Found: ${commandName}`);
    }

    let commandRunner = commandFactory[commandName];
    let cmdRunner = new commandRunner();
    
    return cmdRunner.execute(command);
  }
}

module.exports.commandFactory = commandFactory;