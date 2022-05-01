var GeoCachingContract = artifacts.require("./GeoCachingContract.sol");
var TrackableContract = artifacts.require("./TrackableContract.sol");
var CacheContract = artifacts.require("./CacheContract.sol");
module.exports = function(deployer) {
  deployer.deploy(GeoCachingContract);
  deployer.deploy(TrackableContract);
  deployer.deploy(CacheContract);
};