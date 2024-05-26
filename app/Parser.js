const {StringParser, ArrayParser, BulkStringParser} = require('./parser/')

const RESPTypes = {
	'*': ArrayParser,
	'+': StringParser,
	'$': BulkStringParser,
};

module.exports = class Parser {
	parse(data) {
		let result = [], next = 0;

		const lines = data.split('\r\n');
		if(lines[lines.length - 1].trim() === '') {
			lines.pop();
		}

		// For handling inputs with multiple commands.
		while(next < lines.length) {
			let type = lines[next][0];
			if(RESPTypes[type] === undefined) 
				throw new Error('Unknown Type');
			
			let parser = new RESPTypes[type](RESPTypes);
			let { result: r, next: n } = parser.parse(lines, next);
			result.push({
				input: lines.slice(next, n).join('\r\n') + '\r\n',
				command: r,
			});
			
			next = n;
		}

		return result;
	}

	serialize() {
		
	}
}