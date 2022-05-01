var GeoCachingContract = artifacts.require("GeoCachingContract");
var TrackableContract = artifacts.require("TrackableContract");
var CacheContract = artifacts.require("CacheContract");
var SignatureVerifyerContract = artifacts.require("SignatureVerifyerContract");

contract('TrackableContract', function(accounts) {
    var tc;

    // Test case 1
    it("Test owner of initial trackable is no one", function() {
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.getTrackableOwner(1);
        }).then(function(x) {
            assert.equal(0, x, "Wrong initial trackable owner with ID 1");
        }).then(function(){
            return tc.isUnCreatedCache(1);
        }).then(function(x){
            assert.equal(true, x, "Uncreated cache wrongly exists")
        });
    });

    //Test case 2
    it("Test create cache", function(){
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        })
        .then(function(){
            return tc.getLastCache();
        })
        .then(function(lastAddedCache){
            return tc.isValidCache(lastAddedCache);
        })
        .then(function(isValidCache){
            assert.equal(true, isValidCache, "Created cache not valid");
        });
    });

    //Test case 3
    /*it("Test modify cache", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            id = tc.makeCache("cache1", "original", "1, 1", 123);
            tc.modifyCache(id, "cache2", "modified", "1, 2", 345);
            return id;
        }).then(function(id){
            //cache valid-e
            assert(false, tc.isUnCreatedCache(id), "Created cache does not exist");
            assert(true, tc.isValidCache(id), "Created cache is not valid");
            assert(false, tc.isDeletedCache(id), "Created cache wrongly deleted");

            //módosultak-e az értékek
            assert("cache2", tc.getCacheName(id), "Cache name invalid");
            assert("modified", tc.getCacheDescription(id), "Cache description invalid");
            assert("1, 2", tc.getCacheGPSCoords(id), "Cache GPS coordinates invalid");
            assert(345, tc.getCachePublicKey(id), "Cache public key invalid");

        });
    });*/

    /*it("Test balance after deposit", function() {
        return SimpleBank.deployed().then(function(instance) {
            sb = instance;
            return sb.deposit({ from: accounts[0], value: web3.utils.toWei('10', 'ether') });
        }).then(function(tx_receipt) {
            return sb.getBalance({ from: accounts[0] });
        }).then(function(x) {
            assert.equal(web3.utils.toWei('10', 'ether'), x, "Wrong balance");
        }).then(function() {
            return sb.getBalance({ from: accounts[1] });
        }).then(function(x) {
            assert.equal(0, x, "Wrong balance");
        });
    });*/
});