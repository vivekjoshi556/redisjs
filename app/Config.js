module.exports = class Config {
  static instance;
  
  constructor(config) {
    if(Config.instance) {
      return Config.instance;
    }

    // Defaults:
    this.port = 6379
    this.replication = {
      'role': 'master'
    }

    this.processConfig(config);
    Config.instance = this;
    return this;
  }

  processConfig(args) {
    // Looking for given port number
    let portIdx = args.indexOf('--port')
    if(portIdx !== -1) 
      this.port = parseInt(args[portIdx + 1])

    // Looking for replica
    let replicaIdx = args.indexOf('--replicaof')
    if(replicaIdx !== -1) {
      this.replication = args[replicaIdx + 1];
      this.replication = {
        role: 'slave',
        host: args[replicaIdx + 1],
        port: parseInt(args[replicaIdx + 2]),
      }
    }
  }
}