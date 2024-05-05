const net = require("net");
const Parser = require("./Parser");
const Runner = require("./Runner");
const Store = require("./Store");

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

server.listen(6379, "127.0.0.1");
