const net = require("net");
const Parser = require("./Parser");
const Runner = require("./Runner");
const Store = require("./Store");

const config = {
	port: 6379
}

let portIdx = process.argv.indexOf('--port')
if(portIdx !== -1) 
	config.port = process.argv[portIdx + 1]

// Redis Store
const store = new Store({});

const server = net.createServer((connection) => {
	const parser = new Parser();
	const runner = new Runner();

	connection.on("data", (input) => {
		const data = input.toString();
		const commands = parser.parse(data);
		const result = runner.execute(commands);

		connection.write(result);
	});
	connection.on("close", () => {
		console.log("Closing connection");
	});
});

server.listen(config.port, "127.0.0.1");
