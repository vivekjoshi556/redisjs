const {StringParser, ArrayParser, BulkStringParser} = require('./parser/')

const RESPTypes = {
	'*': ArrayParser,
	'+': StringParser,
	'$': BulkStringParser,
};

module.exports = class Parser {
	parse(data) {
		if(data[0] !== '*') throw new Error('Invalid string received')

		const lines = data.split('\r\n');
		lines.pop();

		let type = lines[0][0];
		if(RESPTypes[type] === undefined) throw new Error('Unknown Type');
		
		let parser = new RESPTypes[type](RESPTypes);
		let { result } = parser.parse(lines, 0);

		return result;
	}

	serialize() {
		
	}
}