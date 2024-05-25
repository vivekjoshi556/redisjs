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