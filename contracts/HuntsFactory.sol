pragma solidity ^0.4.2;
import "./Hunt.sol";
contract HuntFactory {
    Hunt[] hunts;
    
    function AddHunt(string _host, string _question, string _answer, string _pos){
        hunts.push(new Hunt(_host, _question, _answer, _pos));
    }
    
    function getHunt(uint _index) constant returns(address){
        return hunts[_index];
    }

    function getHuntsLength() returns(uint){
        return hunts.length;
    }    
}