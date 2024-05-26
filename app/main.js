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

if(config.replication.role === "slave") {
	const socket = net.createConnection(config.replication.port);
	const arrayParser = new ArrayParser();
	let setupAt = 0;

	// Last Empty is receiving RDB file. 
	// Important: Next must be sent after the response is received for previous.
	const handshakeCommands = [
		["ping"], 
		["replconf", "listening-port", config.port], 
		["replconf", "capa", "psync2"], 
		["psync", "?", "-1"], 
		[]
	];

	socket.on('data', (input) => {
		// console.log("Input Received by Replica", input.toString());
		let commands = parser.parse(input.toString());
		let i = 0;

		// Check how many commands are completed in setup.
		while(setupAt < handshakeCommands.length - 1 && i < commands.length) {
			setupAt += 1;
			i += 1;
		}

		// If setup wasn't completed send rest of the commands.
		if(setupAt < handshakeCommands.length - 1) {
			socket.write(arrayParser.serialize(handshakeCommands[setupAt]));
		}
		for(; i < commands.length; i++) {
			try {
				let {command, input} = commands[i];
				runner.execute(command, input, '');
			} catch (err) {}
		}
	});

	socket.write(arrayParser.serialize(handshakeCommands[0]));
}

const server = net.createServer((connection) => {

	connection.on("data", (data) => {
		try {
			// buff
			let commands = parser.parse(data.toString());
			for(let {command, input} of commands) {
				let result = runner.execute(command, input, connection);

				// Handle multiple responses for each command.
				if(!Array.isArray(result)) {
					result = [result];
				}

				for(let item of result) {
					connection.write(item);
				}
			}
		} catch (err) {}
	});

	connection.on("close", () => {
		console.log("Closing connection");
	});
});

server.listen(config.port, "127.0.0.1");

// ./spawn_redis_server.sh --port 6380 --replicaof localhost 6379