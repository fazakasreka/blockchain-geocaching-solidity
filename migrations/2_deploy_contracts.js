var TrackableContract = artifacts.require("./TrackableContract.sol");

module.exports = function(deployer) {
  deployer.deploy(TrackableContract);
};