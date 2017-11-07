pragma solidity ^0.4.4;

contract Hunt{
    
    address public winner;
    string public name;
    string public question;
    string answer;
    bool public isAnswered;
    string pos;
    
    function Hunt(string _name, string _question, string _answer, string _pos){
        name = _name;
        question = _question;
        answer = _answer;
        pos = _pos;
        isAnswered = false;
    }
    
    modifier notAnswered(){
        require(isAnswered == false);
        _;
    }
    
    function answerQuestion(string _answer) notAnswered returns (string){
        if(keccak256(_answer) == keccak256(answer)){
            isAnswered = true;
            winner = msg.sender;
            return pos;
        }
        return "WRONG";
    }

    function getName() returns (string){
        return name;
    }
}