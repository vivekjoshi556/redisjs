const Get = require('./Get');
const Set = require('./Set');
const Del = require('./Del');
const Echo = require('./Echo');
const Ping = require('./Ping');
const Info = require('./Info');
const Incr = require('./Incr');
const Exec = require('./Exec');
const Multi = require('./Multi');
const Psync = require('./Psync');
const Discard = require('./Disacrd');
const ReplConf = require('./ReplConf');
const Command = require('./Command');

module.exports = {
  Get, 
  Set,
  Del,
  Echo, 
  Exec,
  Ping,
  Info,
  Incr,
  Multi,
  Discard,
  Command,
  ReplConf,
  Psync
}