const Get = require('./Get');
const Set = require('./Set');
const Del = require('./Del');
const Echo = require('./Echo');
const Ping = require('./Ping');
const Info = require('./Info');
const Psync = require('./Psync');
const ReplConf = require('./ReplConf');
const Command = require('./Command');

module.exports = {
  Get, 
  Set,
  Del,
  Echo, 
  Ping,
  Info,
  Command,
  ReplConf,
  Psync
}