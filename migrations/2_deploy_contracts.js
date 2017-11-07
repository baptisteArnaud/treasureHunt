var Hunt = artifacts.require("./Hunt.sol");
var HuntsFactory = artifacts.require("./HuntsFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Hunt);
  deployer.deploy(HuntsFactory);
};