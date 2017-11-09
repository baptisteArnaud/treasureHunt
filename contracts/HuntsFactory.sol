pragma solidity ^0.4.2;


import "./Hunt.sol";
contract HuntsFactory {
    Hunt[] hunts;
    uint public nb_hunts;

    function HuntsFactory(){
        nb_hunts = 0;
    }
    
    function AddHunt(string _name, string _question, string _answer, string _pos, uint _winners_allowed){
        hunts.push(new Hunt(_name, _question, _answer, _pos, _winners_allowed));
        nb_hunts = nb_hunts + 1;
    }
    
    function getHunt(uint _index) constant returns(address){
        return hunts[_index];
    }  
}