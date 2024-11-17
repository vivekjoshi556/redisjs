const Replica = require("./Replica");
const replicateEvent = require("./ReplicateEvent");
const {Echo, Ping, Del, Command, Set, Get, Info, ReplConf, Psync, Incr, Multi, Exec, Discard} = require('./commands/');
const { ErrParser, StringParser } = require("./parser");

const commandFactory = {
  "set": Set,
  "get": Get,
  "del": Del,
  "echo": Echo,
  "ping": Ping,
  "info": Info,
  "incr": Incr,
  "exec": Exec,
  "multi": Multi,
  "discard": Discard,
  "command": Command,
  "replconf": ReplConf,
  "psync": Psync,
}

/**
 * List of commands that will change the DB.
 * These need to be propagated to replicas.
 */
const writeCommands = ["set", "del"]

/**
 * This is the runner class that takes output commands from Parser
 * and executes those commands.
 */
module.exports = class Runner {
  execute(command, input, connection) {
    let commandName = command[0].toLowerCase();

    if(!commandFactory[commandName]) {
      ErrParser.serialize(`Command Not Found: ${commandName}`);
    }

    // If part of ongoing transaction
    if(connection['transaction'] && !['exec', 'discard'].includes(commandName)) {
      connection['transactionQueue'].push({command, input});
      return new StringParser().serialize("QUEUED");
    }
    
    if(commandName === 'multi') { // Starting a transaction.
      connection['transaction'] = true;
    }
    else if(commandName === 'psync') { // Check for a replica
			const replica = new Replica();
			replica.addReplica(connection);
		}
    
    // Check if needs to be propagated to replicas.
    if(writeCommands.indexOf(commandName) !== -1) {
      replicateEvent.emit('replicate', input);
    }

    let commandRunner = commandFactory[commandName];
    let cmdRunner = new commandRunner({connection, runner: this});
    
    return cmdRunner.execute(command);
  }
}

module.exports.commandFactory = commandFactory;