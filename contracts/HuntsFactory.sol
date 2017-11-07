pragma solidity ^0.4.2;
import "./Hunt.sol";
contract HuntsFactory {
    Hunt[] hunts;
    uint public nb_hunts;

    function HuntsFactory(){
        nb_hunts = 0;
    }
    
    function AddHunt(string _host, string _question, string _answer, string _pos){
        hunts.push(new Hunt(_host, _question, _answer, _pos));
        nb_hunts = nb_hunts + 1;
    }
    
    function getHunt(uint _index) constant returns(address){
        return hunts[_index];
    }

    function getHuntsLength() returns(uint){
        return nb_hunts;
    }    
}