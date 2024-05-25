const net = require("net");
const Parser = require("./Parser");
const Runner = require("./Runner");
const Store = require("./Store");
const Config = require("./Config");
const { ArrayParser } = require("./parser/");

const config = new Config(process.argv);
if(config.replication.role === "slave") {
	const socket = net.createConnection(config.replication.port);
	const parser = new ArrayParser();
	let at = 1;
	const handshake = [["ping"], ["replconf", "listening-port", config.port], ["replconf", "capa", "psync2"], ["psync", "?", "-1"]]

	socket.write(parser.serialize(handshake[0]));

	socket.on('data', function (data) {
		console.log("Replica Received Data:", data.toString());
		if(at < handshake.length) {
			socket.write(parser.serialize(handshake[at]));
			at++;
		}
	})
}

// Redis Store
const _ = new Store({});

const server = net.createServer((connection) => {
	const parser = new Parser();
	const runner = new Runner();

	connection.on("data", (input) => {
		const data = input.toString();
		const commands = parser.parse(data);
		let result = runner.execute(commands);

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