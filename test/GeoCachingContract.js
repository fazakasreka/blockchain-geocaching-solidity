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
    it("Test case modify own cache", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("originalName", 
                "original", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.modifyCache(cacheID,
                "modifiedName", 
                "modified", 
                "12, 2", 
                accounts[1],
                {from: accounts[1]});
        }).then(function(){ //VALID
            return tc.isValidCache(id);
        }).then(function(isValidCache){
            assert.equal(true, isValidCache, "Created cache not valid");
        }).then(function(){ //NAME
            return tc.getCacheName(id);
        }).then(function(cacheName){
            assert.equal("modifiedName", cacheName, "Modified cache name invalid");
        }).then(function(){ //DESCRIPTION
            return tc.getCacheDescription(id);
        }).then(function(desc){
            assert.equal("modified", desc, "Modified cache name invalid");
        }).then(function(){ //GPS COORDS
            return tc.getCacheGPSCoords(id);
        }).then(function(gpsCoords){
            assert.equal("12, 2", gpsCoords, "Modified cache name invalid");
        }).then(function(){ //PUBLIC KEY
            return tc.getCachePublicKey(id);
        }).then(function(publicKey){
            assert.equal(accounts[1], publicKey, "Modified cache name invalid");
        });
    });

    //Test case 4
    it("Test case modify invalid cache", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            id = 20;
            return tc.isValidCache(id);
        }).then(function(isValid){
            assert.equal(false, isValid, "This cache should not be valid");
        }).then(function(cacheID){
            return tc.modifyCache(id,
                "modifiedName", 
                "modified", 
                "12, 2", 
                accounts[1],
                {from: accounts[1]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'require',
               'You can not modify invalid cache.'
           )
        });
    });

     //Test case 5
    it("Test case modify not own cache", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("originalName", 
                "original", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.modifyCache(cacheID,
                "modifiedName", 
                "modified", 
                "12, 2", 
                accounts[1],
                {from: accounts[0]});
        }).then(assert.fail)
            .catch(function(error) {
               assert.include(
                   error.message,
                   'require',
                   'You can not modify others cache.'
               )
        //CHECK IF ORIGINAL CACHE NOT MOFIDIED
        }).then(function(){ //NAME
            return tc.getCacheName(id);
        }).then(function(cacheName){
            assert.equal("originalName", cacheName, "Modified cache name invalid");
        }).then(function(){ //DESCRIPTION
            return tc.getCacheDescription(id);
        }).then(function(desc){
            assert.equal("original", desc, "Modified cache name invalid");
        }).then(function(){ //GPS COORDS
            return tc.getCacheGPSCoords(id);
        }).then(function(gpsCoords){
            assert.equal("12, 12", gpsCoords, "Modified cache name invalid");
        }).then(function(){ //PUBLIC KEY
            return tc.getCachePublicKey(id);
        }).then(function(publicKey){
            assert.equal(accounts[0], publicKey, "Modified cache name invalid");
        });
    });

    //Test case 6
    it("Remove own cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.removeCache(cacheID, {from: accounts[1]});
        }).then(function(){
            return tc.isDeletedCache(id);
        }).then(function(isDeleted){
            assert.equal(true, isDeleted, "Removed cache is not deleted");
        });
    });

    //Test case 7
    it("Remove own, not empty cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.makeTrackable("trackable1", "first");
        }).then(function(){
            return tc.putTrackable(0, id);
        }).then(function(){
            return tc.removeCache(id, {from: accounts[1]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'require',
               'You can not delete non-empty cache.'
           )
        });
    });

    //Test case 8
    it("Remove not own cache", function() {
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            return tc.removeCache(cacheID, {from: accounts[0]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'require',
               'You can not delete non-empty cache.'
           )
        });
    });

    //Test case 9
    it("Test report problem", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("originalName", 
                "original", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.reportProblem("problem", id);
        }).then(function(){
            return tc.getCacheProblems(id);
        }).then(function(problems){
            assert.equal(1, problems.length, "The problem list should be 1 length long");
            assert.equal("problem", problems[0][1], "Wrong description of problem");
        });
    });

    //Test case 10
    it("Test report problem invalid cache", function(){
        var id;
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            id = 20;
            return tc.isValidCache(id);
        }).then(function(isValid){
            assert.equal(false, isValid, "This cache should not be valid");
        }).then(function(cacheID){
            return tc.reportProblem("problem", id);
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'require',
               'You can not modify invalid cache.'
           )
        });
    });

    it("Lol", function(){
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
    
});