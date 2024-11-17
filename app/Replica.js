/**
 * This is the class which is keeps a list of all the replica connections.
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