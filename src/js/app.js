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
    $(document).on('click', App.getHunts);
  },

  addHunt: function(e) {
    e.preventDefault();

    var HuntsFactoryInstance;
    var name = $("#name").val();
    var enigma = $("#enigma").val();
    var answer = $("#answer").val();
    var location = $("#location").val();

    App.contracts.HuntsFactory.deployed().then(function(instance) {
      HuntsFactoryInstance = instance;

      return HuntsFactoryInstance.AddHunt(name, enigma, answer, location);
    }).then(function() {
      window.location.replace("index.html");
    });
  },

  getHunts: function(nb_hunts, hunt) {

    if(window.location.pathname == "/hunts.html"){

      var HuntsFactoryInstance;
      App.contracts.HuntsFactory.deployed().then(function(instance) {
        HuntsFactoryInstance = instance;
        return HuntsFactoryInstance.getHuntsLength.call();
      }).then(function(nb_hunts){
        for(i=0; i<nb_hunts; i++){
          App.contracts.HuntsFactory.deployed().then(function(instance) {

            HuntsFactoryInstance = instance;
            return HuntsFactoryInstance.getHunt(i);

          }).then(function(hunt){
            alert(hunt);
          })
        }
      })

      

    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});