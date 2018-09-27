pragma solidity ^0.4.17;

contract Lottery {
    address public creator;
    address[] public members;
    
    function Lottery() public {
        creator = msg.sender;
    }
    
    function enterLottery() public payable {
        require(msg.value > .001 ether);
        members.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%251);
    }
    
    function chooseWinner() public {
        uint winner = random() % members.length;
        //send money entered into lottery from current contract to winner's contract
        members[winner].transfer(this.balance); 
    }
}