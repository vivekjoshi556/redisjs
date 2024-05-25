const net = require("net");
const Parser = require("./Parser");
const Runner = require("./Runner");
const Store = require("./Store");
const Config = require("./Config");
const { ArrayParser } = require("./parser/");

const config = new Config(process.argv);

// Redis Store
const _ = new Store({});

const parser = new Parser();
const runner = new Runner();

function processInput(input, connection) {
	const data = input.toString();
	const commands = parser.parse(data);
	return result = runner.execute(commands, input, connection);
}

if(config.replication.role === "slave") {
	const socket = net.createConnection(config.replication.port);
	const parser = new ArrayParser();
	let at = 1;
	
	// Last Empty is receiving RDB file. 
	const handshake = [["ping"], ["replconf", "listening-port", config.port], ["replconf", "capa", "psync2"], ["psync", "?", "-1"], []];

	socket.write(parser.serialize(handshake[0]));

	function setup() {
		let setupRemaining = at < handshake.length;
		if(setupRemaining) {
			// Setup Socket for next one.
			socket.once('data', setup);
			if(handshake[at].length > 0) {
				socket.write(parser.serialize(handshake[at]));
			}
			at++;
		} else {
			socket.on('data', (input) => {
				processInput(input, '');
			});
		}
	}

	socket.once('data', setup);
}

const server = net.createServer((connection) => {
	connection.on("data", (input) => {
		processInput(input, connection);

		// Handle multiple responses.
		if(!Array.isArray(result)) {
			result = [result];
		}

		for(let item of result) {
			connection.write(item);
		}
	});

	connection.on("close", () => {
		console.log("Closing connection");
	});
});

server.listen(config.port, "127.0.0.1");

// ./spawn_redis_server.sh --port 6380 --replicaof localhost 6379