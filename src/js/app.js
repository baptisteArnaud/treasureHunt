App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContracts();
  },

  initContracts: function() {

    $.getJSON('HuntsFactory.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var HuntsFactoryArtifact = data;
      App.contracts.HuntsFactory = TruffleContract(HuntsFactoryArtifact);

      // Set the provider for our contract
      App.contracts.HuntsFactory.setProvider(App.web3Provider);
    });

    $.getJSON('Hunt.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var HuntArtifact = data;
      App.contracts.Hunt = TruffleContract(HuntArtifact);

      // Set the provider for our contract
      App.contracts.Hunt.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-deploy', App.addHunt);
    $(document).on('click', '.btn-answer', App.answerHunt);
    $(document).ready(App.getHunts);
    $(document).ready(App.loadAnswer);
    $(document).ready(App.loadMap);
  },

  addHunt: function(e) {
    e.preventDefault();
    var HuntsFactoryInstance;
    var name = $("#name").val();
    var enigma = $("#enigma").val();
    var answer = $("#answer").val();
    var location = $("#location").val();
    var nb_winners = $("#nb_winners").val();
    App.contracts.HuntsFactory.deployed().then(function(instance) {
      HuntsFactoryInstance = instance;
      return HuntsFactoryInstance.AddHunt(name, enigma, answer, location, nb_winners);
    }).then(function() {
      window.location.replace("index.html");
    });
  },

  getHunts: function() {
    //ridiculous timemout of 1ms to make sure contracts are initialized.
    setTimeout(function(){
      if(window.location.pathname == "/hunts.html"){
        var HuntsFactoryInstance;
        var addresses;
        var contracts;
        var names;
        var status;
        App.contracts.HuntsFactory.deployed().then(function(instance) {
          HuntsFactoryInstance = instance;
          return HuntsFactoryInstance.nb_hunts.call().then(nb_hunts => {
            var instanceIndexes = Array();
            for(i=0; i<nb_hunts; i++){
              instanceIndexes.push(i);
            }
            var instancesPromises = instanceIndexes.map(index => HuntsFactoryInstance.getHunt(index));
            return Promise.all(instancesPromises).then(addresses_ => {
              addresses = addresses_;
              var contractsPromises = addresses.map(address => App.contracts.Hunt.at(address));
              return Promise.all(contractsPromises).then(contracts_ => {
                contracts = contracts_;
                var namesPromises = contracts.map(contracts => contracts.name.call());
                return Promise.all(namesPromises).then(names_ => {
                  names = names_;
                  var statusPromises = contracts.map(contracts => contracts.closed.call());
                  return Promise.all(statusPromises).then(status_ => {
                    status = status_;
                  }).then(()=>{
                    for(i=0; i<nb_hunts; i++){
                      if(status[i] == false){
                        status[i] = "Open"
                        $(".hunts-list").append('<li><div><a href="answer.html?add=' + addresses[i] + '">' + names[i] + '</a><p>Status: ' + status[i] + '</p></div></li>');
                      }else{
                        status[i] = "Close"
                        $(".hunts-list").append('<li><div><a href="#" class="disabled">' + names[i] + '</a><p>Status: ' + status[i] + '</p></div></li>');
                      }
                    }
                  });
                });
              });
            });
          });
        });
      }
    } , 1);
  },

  loadAnswer: function(){
    //ridiculous timemout of 1ms to make sure contracts are initialized.
    setTimeout(function(){
      if(window.location.pathname == "/answer.html"){
        var address = getUrlParameter('add');
        var name;
        var question;
        var contract = App.contracts.Hunt.at(address).then((contract) =>{
          contract.name.call().then((name_)=>{
            name = name_;
            contract.question.call().then((question_)=>{
              question = question_;
            }).then(()=>{
              $('.contract-name').append(name);
              $('.contract-question').append(question);
            });
          });
        });
      }
    }, 1);
  },

  answerHunt: function(e) {
    e.preventDefault();
    var address = getUrlParameter('add');
    var answer = web3.sha3($("#answer").val());
    var response;
    var contract = App.contracts.Hunt.at(address).then((contract) =>{
      contract.answerQuestion.call(answer).then((response_) => {
        response = response_;
        if(response != "WRONG"){
          contract.answerQuestion(answer).then(() => {
            window.location.replace("winner.html?location=" + response);
          });
        }else{
          window.location.replace("looser.html");
        }
      });
    });
  },

  loadMap: function(e){
    setTimeout(function(){
      if(window.location.pathname == "/winner.html"){
        var location = getUrlParameter('location');
        $(".the-map").attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyAAE1B-kRyhuB5GAyb8s12RDcequNV26-A&q=" + location);
        $(".location-title").append(location);
      }
    },1);
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};