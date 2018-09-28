const path = require('path');
const fs = require('fs');
const solc = require('solc');
const lotPath = path.resolve(__dirname, 'contracts', 'lottery.sol');
const source = fs.readFileSync(lotPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Lottery'];
