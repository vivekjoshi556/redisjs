const Get = require('./Get');
const Set = require('./Set');
const Del = require('./Del');
const Echo = require('./Echo');
const Ping = require('./Ping');
const Info = require('./Info');
const Incr = require('./Incr');
const Exec = require('./Exec');
const XAdd = require('./XAdd');
const Type = require('./Type');
const Multi = require('./Multi');
const Psync = require('./Psync');
const XRange = require('./XRange');
const Discard = require('./Disacrd');
const ReplConf = require('./ReplConf');
const Command = require('./Command');

const commandFactory = {
  "set": Set,
  "get": Get,
  "del": Del,
  "echo": Echo,
  "ping": Ping,
  "info": Info,
  "incr": Incr,
  "exec": Exec,
  "type": Type,
  "xadd": XAdd,
  "multi": Multi,
  "xrange": XRange,
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

module.exports = { commandFactory, writeCommands };