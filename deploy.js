const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const INITIAL_NOTE = 'Test'
const provider = new HDWalletProvider(
	'miracle lift pudding stamp utility nerve drill elite fade flame swap crime',
	'https://rinkeby.infura.io/v3/5d055e9dd1254cc3a5ba48d1c46979ee'
);
const web3 = new Web3(provider);
const deploy = async() => {
	const fetchedAccounts = await web3.eth.getAccounts();
	const result = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({gas: '1000000', from: fetchedAccounts[0]});

	console.log('Contract Deployed to: ', result.options.address);
};
deploy();
