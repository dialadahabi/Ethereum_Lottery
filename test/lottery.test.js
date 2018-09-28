const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {interface, bytecode} = require('../compile.js');

let lottery;
let fetchedAccounts;

beforeEach(async() => {
	fetchedAccounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode})
	.send({from: fetchedAccounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
	it('deploys contract', () => {
		assert.ok(lottery.options.address);
	});
	it('one account entered lottery', async() => {
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		const members = await lottery.methods.displayMembers().call({
			from: fetchedAccounts[0]
		});
		assert.equal(fetchedAccounts[0], members[0]);
		assert.equal(1, members.length);
	});
	it('multiple accounts entered lottery', async() => {
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});
		const members = await lottery.methods.displayMembers().call({
			from: fetchedAccounts[0]
		});
		assert.equal(fetchedAccounts[0], members[0]);
		assert.equal(fetchedAccounts[1], members[1]);
		assert.equal(fetchedAccounts[2], members[2]);
		assert.equal(3, members.length);
	});
	it('requires min amount of ether', async()=>{
		try {
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[0],
			value: 0
		});
		assert(false);
		} catch (error) {
			assert(error);
		}
	});
	it('creator only picks winner', async() => {
		try {
			await lottery.methods.chooseWinner().send({
				from: fetchedAccounts[1] //not creator
			});
			assert(false);
		} catch (error) {
			assert(error);
		}
	});
	it('sends money to winner and resets members array', async() => {
		await lottery.methods.enterLottery().send({
			from: fetchedAccounts[0],
			value: web3.utils.toWei('2','ether')
		});
		const initialBalance = await web3.eth.getBalance(fetchedAccounts[0]);
		const amountInLottery = await web3.eth.getBalance(lottery);
		await lottery.methods.chooseWinner().send({from: fetchedAccounts[0]});
		const members = await lottery.methods.displayMembers().call({
			from: fetchedAccounts[0]
		});
		const finalBalance = await web3.eth.getBalance(fetchedAccounts[0]);
		const difference = finalBalance - initialBalance;
		//console.log(difference);
		assert(difference > web3.utils.toWei('1.8','ether'));
		assert.equal(0, members.length);
	});
});
