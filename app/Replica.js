/**
 * This is the class which is used when the instance is started as a replica.
 */
module.exports = class Replica {
  static instance;

  constructor(connections = []) {
    if (!Replica.instance) {
      Replica.instance = this;
      this.connections = connections;
    }

    return Replica.instance;
  }
  
  addReplica(connection) {
    this.connections.push(connection);
  }
}