var GeoCachingContract = artifacts.require("GeoCachingContract");
var TrackableContract = artifacts.require("TrackableContract");
var CacheContract = artifacts.require("CacheContract");
var SignatureVerifyerContract = artifacts.require("SignatureVerifyerContract");

contract('TrackableContract', function(accounts) {
    var tc;

    //Test case 1
    it("Initial test", function() {
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
                accounts[2],
                {from: accounts[1]});
        })
        .then(function(){
            return tc.isValidCache(0);
        })
        .then(function(isValidCache){
            assert.equal(true, isValidCache, "Created cache not valid");
        }).then(function(){
            return tc.getCacheOwner(0)
        }).then(function(owner){
            assert.equal(owner, accounts[1], "Created cache not valid");
        })
        ;
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
               'onlyValidCache',
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
                   'onlyOwnerOfCache',
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
            assert.equal("original", desc, "Modified cache description invalid");
        }).then(function(){ //GPS COORDS
            return tc.getCacheGPSCoords(id);
        }).then(function(gpsCoords){
            assert.equal("12, 12", gpsCoords, "Modified cache GPS coords invalid");
        }).then(function(){ //PUBLIC KEY
            return tc.getCachePublicKey(id);
        }).then(function(publicKey){
            assert.equal(accounts[0], publicKey, "Modified cache publicKey invalid");
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
        }).then(function(){
            return tc.isValidCache(id);
        }).then(function(isValid){
            assert.equal(true, isValid, "The cache must remain valid")
        });
    });

    //Test case 8
    it("Remove not own cache", function() {
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
            return tc.removeCache(id, {from: accounts[0]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'onlyOwnerOfCache',
               'You can not delete non-empty cache.'
           )
        }).then(function(){
            return tc.isValidCache(id);
        }).then(function(isValid){
            assert.equal(true, isValid, "The cache should remain valid");
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
               'onlyValidCache',
               'You can not modify invalid cache.'
           )
        }).then(function(){
            return tc.getCacheProblems(id);
        }).then(function(problems){
            assert.equal(0, problems.length, "The problem list should not contain anything");
        });
    });

    //Test case 11
    it("Create trackable", function() {
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
        }).then(function(){
            return tc.getTrackable(0);
        }).then(function(trackable){
            //assert.equal(accounts[1], trackable[0], "Trackable creator invalid");
            //assert.equal(accounts[1], trackable[1], "Trackable owner invalid");
            //assert.equal("trackable1", trackable[3], "Trackable name invalid");
           // assert.equal("first", trackable[4], "Trackable description invalid");
        }).then(function(){
            return tc.getTrackableOwner(0);
        }).then(function(owner){
            assert.equal(owner, accounts[1], "Trackable owner invalid lol");
        });
    });

    //Test case 12
    it("Put trackable to cache, not found cache", function() {
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
            return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
        }).then(function(){
            return tc.putTrackable(0, id, {from: accounts[1]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'onlyIfSenderAlreadyFoundCache',
               'You can not modify invalid cache.'
           )
        }).then(function(){
            return tc.getCacheTrackables(id);
        }).then(function(trackables){
            assert.equal(0, trackables.length, "The trackable list should not contain anything");
        });
    });

    //Test case 13
    it("Put trackable to invalid cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            id = 20;
            return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
        }).then(function(){
            return tc.putTrackable(0, id, {from: accounts[0]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'onlyValidCache',
               'You can not put trackable to not found.'
           )
        });
    });

    //Test case 14
    it("Put not own trackable to cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[0]});
        }).then(function(){
            return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.putTrackable(0, id, {from: accounts[1]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'onlyOwnerOfTrackable',
               'You can not put trackable to invalid cache.'
           )
        }).then(function(){
            return tc.getCacheTrackables(id);
        }).then(function(trackables){
            assert.equal(0, trackables.length, "The trackable list should not contain anything");
        });
    });

    //TODO - find cache
    //Test case 15
    /*it("Put trackable to cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
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
            return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
        }).then(function(){
            return tc.putTrackable(0, id, {from: accounts[1]});
        }).then(function(){
            return tc.getTrackable(0);
        }).then(function(trackable){
            assert.equal(accounts[0], trackable[0], "Trackable creator invalid");
            assert.equal(accounts[0], trackable[1], "Trackable owner invalid");
            assert.equal(id, trackable[3], "Trackable cacheID invalid");
            assert.equal("trackable1", trackable[3], "Trackable name invalid");
            assert.equal("first", trackable[4], "Trackable description invalid");
        }).then(function(){
            return tc.getCacheTrackables(id);
        }).then(function(tackables){
            assert.equal(1, trackables.length, "The trackable list should be 1 long");
            assert.equal(0, trackables[0], "The first trackable is invalid");
        });
    });*/

    //Test case 16
    //TODO find cache with account 0
    it("Remove trackable from not found cache", function() {
        var id;
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[0]});
        }).then(function(){
            return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            id = cacheID;
            return tc.putTrackable(0, id, {from: accounts[0]});
        }).then(function(){
            return tc.takeTrackable(0, id, {from: accounts[1]});
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'require',
               'You can not take trackable from not found cache.'
           )
        }).then(function(){
            return tc.getCacheTrackables(id);
        }).then(function(trackables){
            assert.equal(1, trackables.length, "The trackable list should not contain anything");
        });
    });

    //Test case 17
    it("Remove trackable from cache which is not there", function() {
        return TrackableContract.deployed().then(function(instance) {
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[0]});
        }).then(function(){
            return tc.getLastCache();
        }).then(function(cacheID){
            return tc.takeTrackable(0, cacheID);
        }).then(assert.fail)
        .catch(function(error) {
           assert.include(
               error.message,
               'onlyTrackableInCache',
               'You can not take trackable from cache which is not there.'
           )
        });
    });


    it("Remove trackable from cache", function() {
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        })
        .then(function(){
            hashedAccount = web3.utils.keccak256(accounts[2]);
            return web3.eth.sign(hashedAccount, accounts[0]).then(function(signature){
                    return tc.findCache(
                        0,
                        signature,
                        {from: accounts[2]}
                    )
            })
        }).then(function(){
            return tc.makeTrackable("trackable1", "first", {from: accounts[2]});
        }).then(function(){
            assert.equal(false, tc.isUnCreatedCache.call(0));
        }).then(function(){
            return tc.putTrackable(
                0, //trackableID
                0, //cacheID
                {from: accounts[2]});
        }).then(function(){
            hashedAccount = web3.utils.keccak256(accounts[2]);
            return web3.eth.sign(hashedAccount, accounts[1]).then(function(signature){
                    return tc.findCache(
                        0,
                        signature,
                        {from: accounts[2]}
                    )
            })
        })
        .then(function(){
            return tc.takeTrackable(
                0, //trackableID
                0  //cacheID
            );
        }).then(function(){
            assert.equal(0, tc.getCacheTrackables.call().length, "getCacheTrackables should be empty");
            assert.equal(accounts[2], tc.getTrackableOwner.call(), "trackable not owned by the one who took it");
        });
    });

    it("Find cache", function(){
        return TrackableContract.deployed().then(function(instance){
            tc = instance;
            return tc.makeCache("cache1", 
                "first cache", 
                "12, 12", 
                accounts[0],
                {from: accounts[1]});
        })
        .then(function(){
            hashedAccount = web3.utils.keccak256(accounts[2]);
            return web3.eth.sign(hashedAccount, accounts[0]).then(function(signature){
                    return tc.findCache(
                        0,
                        signature,
                        {from: accounts[2]}
                    )
            })
        }).then(function(){
                return tc.getCacheUserHasfound(0, accounts[2]);
        }).then(function(userHasFound){
            assert.equal(true, userHasFound, "User has not visited")
        });
    });

});