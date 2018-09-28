pragma solidity ^0.4.17;

contract Lottery {
    address public creator;
    address[] public members;
    
    modifier auth() {
         //allow creator to only choose winner
        require(msg.sender == creator);
        _;
    }
    
    function Lottery() public {
        creator = msg.sender;
    }
    
    function enterLottery() public payable {
        require(msg.value > .001 ether);
        members.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty, members))%251);
    }
    
    function chooseWinner() public auth {
        uint winner = random() % members.length;
        //send money entered into lottery from current contract to winner's contract
        members[winner].transfer(this.balance); 
        //dynamic array with initial size 0
        members = new address[](0);
    }
    
    function displayMembers() public view returns (address[]) {
        return members;
    }
}