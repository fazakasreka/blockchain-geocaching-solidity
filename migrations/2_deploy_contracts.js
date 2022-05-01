var GeoCachingContract = artifacts.require("./GeoCachingContract.sol");
module.exports = function(deployer) {
  deployer.deploy(GeoCachingContract);
};