pragma solidity ^0.4.2;
import "./Hunt.sol";
contract HuntFactory {
    Hunt[] hunts;
    
    function AddHunt(string _host, string _question, string _answer, string _pos){
        hunts.push(new Competition(_host, _question, _answer, _pos));
    }
    
    function getCompetition(uint _index) constant returns(address){
        return competitions[_index];
    }
    
    function getHuntsLength() returns(uint){
        return hunts.length;
    }    
}