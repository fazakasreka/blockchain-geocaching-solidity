var GeoCachingContract = artifacts.require("./GeoCachingContract.sol");
var TrackableContract = artifacts.require("./TrackableContract.sol");
var CacheContract = artifacts.require("./CacheContract.sol");
var SignatureVerifyerContract = artifacts.require("./SignatureVerifyerContract.sol");

module.exports = function(deployer) {
  deployer.deploy(GeoCachingContract);
  deployer.deploy(TrackableContract);
  deployer.deploy(CacheContract);
  deployer.deploy(SignatureVerifyerContract);
};