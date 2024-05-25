const EventEmitter = require('events');
const Replica = require('./Replica');

class ReplicateEvent extends EventEmitter {
    constructor() {
      super();
      this.on('replicate', (data) => {
        const replicas = new Replica();
        for(let conn of replicas.connections) {
          conn.write(data);
        }
      });
    }
}

const replicateEvent = new ReplicateEvent();

// Export the event handler
module.exports = replicateEvent;
