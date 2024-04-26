const net = require("net");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
	console.log("Server Listening at: 127.0.0.1:6379");

	connection.on("data", () => {
		console.log("Got Data");
		connection.write("+PONG\r\n");
	});
	connection.on("close", () => {
		console.log("Closing connection");
	});
});

server.listen(6379, "127.0.0.1");
