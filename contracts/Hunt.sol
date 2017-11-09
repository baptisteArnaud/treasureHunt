pragma solidity ^0.4.4;

contract Hunt{
    
    address[] winners;
    uint public winners_allowed;
    uint public nb_winners;
    string public name;
    string public question;
    string answer;
    bool public closed;
    string pos;
    
    function Hunt(string _name, string _question, string _answer, string _pos, uint winners_allowed_){
        name = _name;
        question = _question;
        answer = _answer;
        pos = _pos;
        winners_allowed = winners_allowed_;
        closed = false;
        nb_winners = 0;
    }
    
    modifier notClosed(){
        require(!closed);
        _;
    }
    
    function answerQuestion(string _answer) notClosed returns (string){
        if(keccak256(_answer) == keccak256(answer)){
            winners.push(msg.sender);
            nb_winners = nb_winners + 1;
            if(nb_winners == winners_allowed){
                closed = true;
            }
            return "WHAT??";
        }
        return "WHAT??";
    }
}