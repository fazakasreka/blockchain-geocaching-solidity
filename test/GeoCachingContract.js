var TrackableContract = artifacts.require("TrackableContract");

const testCacheName =  "This is a test cache"
const testCacheDescription =  "This is the test cache's description"
const testLocation = "47°29'33″N  19°03'05″E"

const testCacheNameModifyed =  "This is a modifyed title"
const testCacheDescriptionModifyed  =  "This is a modifyed desc"
const testLocationModifyed  = "66°29'33″N  77°03'05″E modifyed"

const testTrackableName = "This is a test trackable"
const testTrackableDescription = "This is a test trackable description"

contract('TrackableContract', (accounts) => {
    var contract = TrackableContract.deployed()

    // it("initial: initial state", () => 

    // {
    //     return contract.then(async instance => 
    //     {

    //         isUncreatedCache_0 = await instance.isUnCreatedCache.call(0)
    //         assert.equal(true, isUncreatedCache_0, "Cache 0 exists at init.")

    //         getCacheOwner_0 = await instance.getCacheOwner.call(0)
    //         assert.equal(0, getCacheOwner_0, "Cache 0 has owner at init.")

    //         isUnCreatedTrackable_0 = await instance.isUnCreatedTrackable.call(0)
    //         assert.equal(true, isUnCreatedTrackable_0, "Trackable 0 exists at init.")

    //         getTrackableOwner_0 = await instance.getTrackableOwner.call(0)
    //         assert.equal(0, getTrackableOwner_0, "Trackable 0 has owner at init.")

    //     })
    // })

    // it("makeCache: normal function + cache getter functions", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         sender = accounts[0]
    //         publicKey = accounts[1]
            
    //         //make cache
    //         await instance.makeCache(
    //                 testCacheName, 
    //                 testCacheDescription, 
    //                 testLocation, 
    //                 publicKey,
    //                 {from: sender}
    //         )
            
    //         //test success of makeCache
    //         const cacheID = await instance.getLastCache.call()

    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Contract.makeCache(...) failed")

    //         //test getters and fileds of cache
    //         cacheOwner = await instance.getCacheOwner.call(cacheID)
    //         assert.equal(sender, cacheOwner, "Cache.owner incorrect.")

    //         cacheName = await instance.getCacheName.call(cacheID)
    //         assert.equal(testCacheName, cacheName, "Cache.name incorrect.")

    //         cacheDescription = await instance.getCacheDescription.call(cacheID)
    //         assert.equal(testCacheDescription, cacheDescription, "Cache.description incorrect.")

    //         cacheGPSCoords = await instance.getCacheGPSCoords.call(cacheID)
    //         assert.equal(testLocation, cacheGPSCoords, "Cache.GPSCoords incorrect.")

    //         cachePublicKey = await instance.getCachePublicKey.call(cacheID)
    //         assert.equal(publicKey, cachePublicKey, "Cache.publicKey incorrect.")

    //         cacheTrackables = await instance.getCacheTrackables.call(cacheID)
    //         assert.equal(0, cacheTrackables.length, "Cache.trackables incorrect.")

    //         cacheProblems = await instance.getCacheProblems.call(cacheID)
    //         assert.equal(0, cacheProblems.length, "Cache.problems incorrect.")
    //     })
    // })

    // it("modifyCache: normal function", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         sender = accounts[0]
    //         publicKey = accounts[1]
    //         newPublicKey = accounts[2]
            
    //         //make cache
    //         await instance.makeCache(
    //                 testCacheName, 
    //                 testCacheDescription, 
    //                 testLocation, 
    //                 publicKey,
    //                 {from: sender}
    //         )
            
    //         //test success of makeCache
    //         const cacheID = await instance.getLastCache.call()

    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Could not make cache for test.")

    //         //modify cache
    //         await instance.modifyCache(
    //             cacheID,
    //             testCacheNameModifyed, 
    //             testCacheDescriptionModifyed, 
    //             testLocationModifyed, 
    //             newPublicKey,
    //             {from: sender}
    //         )

    //         //test modyfiy sucessful
    //         cacheOwner = await instance.getCacheOwner.call(cacheID)
    //         assert.equal(sender, cacheOwner, "Cache.owner incorrect.")

    //         cacheName = await instance.getCacheName.call(cacheID)
    //         assert.equal(testCacheNameModifyed, cacheName, "Cache.name incorrect.")

    //         cacheDescription = await instance.getCacheDescription.call(cacheID)
    //         assert.equal(testCacheDescriptionModifyed, cacheDescription, "Cache.description incorrect.")

    //         cacheGPSCoords = await instance.getCacheGPSCoords.call(cacheID)
    //         assert.equal(testLocationModifyed, cacheGPSCoords, "Cache.GPSCoords incorrect.")

    //         cachePublicKey = await instance.getCachePublicKey.call(cacheID)
    //         assert.equal(newPublicKey, cachePublicKey, "Cache.publicKey incorrect.")

    //         cacheTrackables = await instance.getCacheTrackables.call(cacheID)
    //         assert.equal(0, cacheTrackables.length, "Cache.trackables incorrect.")

    //         cacheProblems = await instance.getCacheProblems.call(cacheID)
    //         assert.equal(0, cacheProblems.length, "Cache.problems incorrect.")
    //     })
    // })

    // it("modifyCache: only valid cache can be modifyed (onlyValidCache)", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         cacheOwner = accounts[0]
    //         newPublicKey = accounts[3]
            
    //         //get an UNCREATED cahe
    //         var cacheID = await instance.getLastCache.call()
    //         cacheID = cacheID.toNumber() + 1

    //         isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
    //         assert.equal(true, isUnCreatedCache, "Failed to aquire uncreated cache for test")
            
    //         //try to modify uncreated cache
    //         var failed = false
    //         await instance.modifyCache(
    //             cacheID,
    //             testCacheNameModifyed, 
    //             testCacheDescriptionModifyed, 
    //             testLocationModifyed, 
    //             newPublicKey,
    //             {from: cacheOwner}
    //         //test for error
    //         ).catch(error => {
    //             failed = true
    //             assert.include(
    //                 error.message,
    //                 'onlyValidCache',
    //                 'Modify uncreated cache failed as expected, but not because onlyValidCache modifier'
    //             )
    //         })
    //         assert.equal(true, failed, "An uncreated cache was modifed")

    //         //get DELETED cache
    //             //make cache
    //         await instance.makeCache(
    //             testCacheName, 
    //             testCacheDescription, 
    //             testLocation, 
    //             publicKey,
    //             {from: cacheOwner}
    //         )
    //             //remove cache
    //         cacheID = await instance.getLastCache.call()
    //         await instance.removeCache(
    //             cacheID
    //         )
    //             //check delete succesfull
    //         isDeletedCache = await instance.isDeletedCache.call(cacheID)
    //         assert.equal(true, isDeletedCache, "Failed to aquire deleted cache for test")
            
    //          //try to modify deleted cache
    //          var failed = false
    //          await instance.modifyCache(
    //              cacheID,
    //              testCacheNameModifyed, 
    //              testCacheDescriptionModifyed, 
    //              testLocationModifyed, 
    //              newPublicKey,
    //              {from: cacheOwner}
    //          //test for error
    //          ).catch(error => {
    //              failed = true
    //              assert.include(
    //                  error.message,
    //                  'onlyValidCache',
    //                  'Modify uncreated cache failed as expected, but not because onlyValidCache modifier'
    //              )
    //          })
    //          assert.equal(true, failed, "An uncreated cache was modifed")
        
    //     })
    // })

    // it("modifyCache: only cache.owner can modify (onlyOwnerOfCache)", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         cacheOwner = accounts[0]
    //         senderOfModify = accounts[1]
    //         publicKey = accounts[2]
    //         newPublicKey = accounts[3]
            
    //         //make cache
    //         await instance.makeCache(
    //                 testCacheName, 
    //                 testCacheDescription, 
    //                 testLocation, 
    //                 publicKey,
    //                 {from: cacheOwner}
    //         )
            
    //         //test success of makeCache
    //         const cacheID = await instance.getLastCache.call()

    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Could not make cache for test")

    //         //modify cache sent by not owner
    //         var failed = false
    //         await instance.modifyCache(
    //             cacheID,
    //             testCacheNameModifyed, 
    //             testCacheDescriptionModifyed, 
    //             testLocationModifyed, 
    //             newPublicKey,
    //             {from: senderOfModify}
    //         //test for error
    //         ).catch(error => {
    //             failed = true
    //             assert.include(
    //                 error.message,
    //                 'onlyOwnerOfCache',
    //                 'Cache modified by not owner failed as expected, but not because onlyOwnerOfCache modifier'
    //             )
    //         })
    //         assert.equal(true, failed, "Cache removed by not owner.")
            
            
    //     })
    // })

    // it("removeCache: normal function", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         sender = accounts[0]
    //         publicKey = accounts[1]
            
    //         //make cache
    //         await instance.makeCache(
    //                 testCacheName, 
    //                 testCacheDescription, 
    //                 testLocation, 
    //                 publicKey,
    //                 {from: sender}
    //         )
            
    //         //test success of makeCache
    //         const cacheID = await instance.getLastCache.call()

    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Could not make cache for test")

    //         //delete cache
    //         await instance.removeCache(
    //             cacheID,
    //             {from: sender}
    //         )

    //         //test sucess of removeCache
    //         cacheDeleted = await instance.isDeletedCache.call(cacheID)
    //         assert.equal(true, cacheDeleted, "Contract.removeCache(...) failed")
    //     })
    // })

    // it("removeCache: only valid cache can be removed (onlyValidCache)", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         cacheOwner = accounts[0]
    //         newPublicKey = accounts[3]
            
    //         //get an UNCREATED cahe
    //         var cacheID = await instance.getLastCache.call()
    //         cacheID = cacheID.toNumber() + 1

    //         isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
    //         assert.equal(true, isUnCreatedCache, "Failed to aquire uncreated cache for test")
            
    //         //try to remove uncreated cache
    //         var failed = false
    //         await instance.removeCache(
    //             cacheID,
    //             {from: cacheOwner}
    //         //test for error
    //         ).catch(error => {
    //             failed = true
    //             assert.include(
    //                 error.message,
    //                 'onlyValidCache',
    //                 'Remove uncreated cache failed as expected, but not because onlyValidCache modifier'
    //             )
    //         })
    //         assert.equal(true, failed, "An uncreated cache was removed")

    //         //get DELETED cache
    //             //make cache
    //         await instance.makeCache(
    //             testCacheName, 
    //             testCacheDescription, 
    //             testLocation, 
    //             publicKey,
    //             {from: cacheOwner}
    //         )
    //             //remove cache
    //         cacheID = await instance.getLastCache.call()
    //         await instance.removeCache(
    //             cacheID
    //         )
    //             //check delete succesfull
    //         isDeletedCache = await instance.isDeletedCache.call(cacheID)
    //         assert.equal(true, isDeletedCache, "Failed to aquire deleted cache for test")
            
    //          //try to remove deleted cache
    //          var failed = false
    //          await instance.removeCache(
    //              cacheID,
    //              {from: cacheOwner}
    //          //test for error
    //          ).catch(error => {
    //              failed = true
    //              assert.include(
    //                  error.message,
    //                  'onlyValidCache',
    //                  'Remove uncreated cache failed as expected, but not because onlyValidCache modifier'
    //              )
    //          })
    //          assert.equal(true, failed, "An uncreated cache was removed.")
        
    //     })
    // })

    // it("removeCache: only empty cache can be removed (onlyCacheEmpty)", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         cacheOwner = accounts[0]
    //         publicKey = accounts[3]
            
    //         //make cache
    //         await instance.makeCache(
    //             testCacheName, 
    //             testCacheDescription, 
    //             testLocation, 
    //             publicKey,
    //             {from: cacheOwner}
    //         )
    //         const cacheID = await instance.getLastCache.call()
    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Could not make cache for test")
            
    //         //find cache
    //         hashedAddress = web3.utils.keccak256(cacheOwner)
    //         signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
    //         await instance.findCache(
    //             cacheID,
    //             signature,
    //             {from: cacheOwner}
    //         )
    //         userHasFound = await instance.getCacheUserHasfound.call(cacheID, cacheOwner)
    //         assert.equal(true, userHasFound, "Could not get user to find cache for test.")

    //         //make trackable
    //         await instance.makeTrackable(
    //             testTrackableName,
    //             testCacheDescription,
    //             {from: cacheOwner}
    //         )
    //         const trackableID = await instance.getLastTrackable.call()
    //         isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
    //         assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

    //         //put trackable into cache
    //         await instance.putTrackable(
    //             trackableID, 
    //             cacheID,
    //             {from: cacheOwner}
    //         )
    //         getTrackableOwner = await instance.getTrackableOwner.call(trackableID)
    //         assert.equal(0, getTrackableOwner, "Could not put trackable in cache for test.")

    //          //try to deleted cache with items
    //          var failed = false
    //          await instance.removeCache(
    //              cacheID,
    //              {from: cacheOwner}
    //          //test for error
    //          ).catch(error => {
    //              failed = true
    //              assert.include(
    //                  error.message,
    //                  'onlyCacheEmpty',
    //                  'Remove uncreated cache failed as expected, but not because onlyCacheEmpty modifier'
    //              )
    //          })
    //          assert.equal(true, failed, "An cash with trackables cache was removed.")
        
    //     })
    // })

    // it("removeCache: only cache.owner can remove (onlyOwnerOfCache)", () => 
    // {
    //     return contract.then(async instance => 
    //     {
    //         cacheOwner = accounts[0]
    //         senderOfRemove = accounts[1]
    //         publicKey = accounts[2]
    //         newPublicKey = accounts[3]
            
    //         //make cache
    //         await instance.makeCache(
    //                 testCacheName, 
    //                 testCacheDescription, 
    //                 testLocation, 
    //                 publicKey,
    //                 {from: cacheOwner}
    //         )
            
    //         //test success of makeCache
    //         const cacheID = await instance.getLastCache.call()

    //         isValidCache = await instance.isValidCache.call(cacheID)
    //         assert.equal(true, isValidCache, "Contract.makeCache(...) failed")

    //         //remove cache sent by not owner
    //         var failed = false
    //         await instance.removeCache(
    //                 cacheID,
    //                 {from: senderOfRemove}
    //         //test fro faliour
    //         ).catch(error => {
    //             failed = true
    //             assert.include(
    //                 error.message,
    //                 'onlyOwnerOfCache',
    //                 'Cache remove by not owner failed as expected, but not because onlyOwnerOfCache modifier'
    //             )
    //         })
    //         assert.equal(true, failed, "Cache removed by not owner.")
            
            
    //     })
    // })




//     //Test case 4
//     it("Test case modify invalid cache", function(){
//         var id;
//         return TrackableContract.deployed().then(function(instance){
//             tc = instance;
//             id = 20;
//             return tc.isValidCache(id);
//         }).then(function(isValid){
//             assert.equal(false, isValid, "This cache should not be valid");
//         }).then(function(cacheID){
//             return tc.modifyCache(id,
//                 "modifiedName", 
//                 "modified", 
//                 "12, 2", 
//                 accounts[1],
//                 {from: accounts[1]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyValidCache',
//                'You can not modify invalid cache.'
//            )
//         });
//     });

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
                {from: accounts[1]});
        }).then(assert.fail("lol"))
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

//     //Test case 6
//     it("Remove own cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.removeCache(cacheID, {from: accounts[1]});
//         }).then(function(){
//             return tc.isDeletedCache(id);
//         }).then(function(isDeleted){
//             assert.equal(true, isDeleted, "Removed cache is not deleted");
//         });
//     });

//     //Test case 7
//     it("Remove own, not empty cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.makeTrackable("trackable1", "first");
//         }).then(function(){
//             return tc.putTrackable(0, id);
//         }).then(function(){
//             return tc.removeCache(id, {from: accounts[1]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'require',
//                'You can not delete non-empty cache.'
//            )
//         }).then(function(){
//             return tc.isValidCache(id);
//         }).then(function(isValid){
//             assert.equal(true, isValid, "The cache must remain valid")
//         });
//     });

//     //Test case 8
//     it("Remove not own cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.removeCache(id, {from: accounts[0]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyOwnerOfCache',
//                'You can not delete non-empty cache.'
//            )
//         }).then(function(){
//             return tc.isValidCache(id);
//         }).then(function(isValid){
//             assert.equal(true, isValid, "The cache should remain valid");
//         });
//     });

//     //Test case 9
//     it("Test report problem", function(){
//         var id;
//         return TrackableContract.deployed().then(function(instance){
//             tc = instance;
//             return tc.makeCache("originalName", 
//                 "original", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.reportProblem("problem", id);
//         }).then(function(){
//             return tc.getCacheProblems(id);
//         }).then(function(problems){
//             assert.equal(1, problems.length, "The problem list should be 1 length long");
//             assert.equal("problem", problems[0][1], "Wrong description of problem");
//         });
//     });

//     //Test case 10
//     it("Test report problem invalid cache", function(){
//         var id;
//         return TrackableContract.deployed().then(function(instance){
//             tc = instance;
//             id = 20;
//             return tc.isValidCache(id);
//         }).then(function(isValid){
//             assert.equal(false, isValid, "This cache should not be valid");
//         }).then(function(cacheID){
//             return tc.reportProblem("problem", id);
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyValidCache',
//                'You can not modify invalid cache.'
//            )
//         }).then(function(){
//             return tc.getCacheProblems(id);
//         }).then(function(problems){
//             assert.equal(0, problems.length, "The problem list should not contain anything");
//         });
//     });

//     //Test case 11
//     it("Create trackable", function() {
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
//         }).then(function(){
//             return tc.getTrackable(0);
//         }).then(function(trackable){
//             //assert.equal(accounts[1], trackable[0], "Trackable creator invalid");
//             //assert.equal(accounts[1], trackable[1], "Trackable owner invalid");
//             //assert.equal("trackable1", trackable[3], "Trackable name invalid");
//             assert.equal("first", trackable[4], "Trackable description invalid");
//         }).then(function(){
//             return tc.getTrackableOwner(0);
//         }).then(function(owner){
//             assert.equal(owner, accounts[1], "Trackable owner invalid lol");
//         });
//     });

//     //Test case 12
//     it("Put trackable to cache, not found cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
//         }).then(function(){
//             return tc.putTrackable(0, id, {from: accounts[1]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyIfSenderAlreadyFoundCache',
//                'You can not modify invalid cache.'
//            )
//         }).then(function(){
//             return tc.getCacheTrackables(id);
//         }).then(function(trackables){
//             assert.equal(0, trackables.length, "The trackable list should not contain anything");
//         });
//     });

//     //Test case 13
//     it("Put trackable to invalid cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             id = 20;
//             return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
//         }).then(function(){
//             return tc.putTrackable(0, id, {from: accounts[0]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyValidCache',
//                'You can not put trackable to not found.'
//            )
//         });
//     });

//     //Test case 14
//     it("Put not own trackable to cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[0]});
//         }).then(function(){
//             return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.putTrackable(0, id, {from: accounts[1]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyOwnerOfTrackable',
//                'You can not put trackable to invalid cache.'
//            )
//         }).then(function(){
//             return tc.getCacheTrackables(id);
//         }).then(function(trackables){
//             assert.equal(0, trackables.length, "The trackable list should not contain anything");
//         });
//     });

//     //TODO - find cache
//     //Test case 15
//     /*it("Put trackable to cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.makeTrackable("trackable1", "first", {from: accounts[1]});
//         }).then(function(){
//             return tc.putTrackable(0, id, {from: accounts[1]});
//         }).then(function(){
//             return tc.getTrackable(0);
//         }).then(function(trackable){
//             assert.equal(accounts[0], trackable[0], "Trackable creator invalid");
//             assert.equal(accounts[0], trackable[1], "Trackable owner invalid");
//             assert.equal(id, trackable[3], "Trackable cacheID invalid");
//             assert.equal("trackable1", trackable[3], "Trackable name invalid");
//             assert.equal("first", trackable[4], "Trackable description invalid");
//         }).then(function(){
//             return tc.getCacheTrackables(id);
//         }).then(function(tackables){
//             assert.equal(1, trackables.length, "The trackable list should be 1 long");
//             assert.equal(0, trackables[0], "The first trackable is invalid");
//         });
//     });*/

//     //Test case 16
//     //TODO find cache with account 0
//     it("Remove trackable from not found cache", function() {
//         var id;
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[0]});
//         }).then(function(){
//             return tc.makeTrackable("trackable1", "first", {from: accounts[0]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             id = cacheID;
//             return tc.putTrackable(0, id, {from: accounts[0]});
//         }).then(function(){
//             return tc.takeTrackable(0, id, {from: accounts[1]});
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'require',
//                'You can not take trackable from not found cache.'
//            )
//         }).then(function(){
//             return tc.getCacheTrackables(id);
//         }).then(function(trackables){
//             assert.equal(1, trackables.length, "The trackable list should not contain anything");
//         });
//     });

//     //Test case 17
//     it("Remove trackable from cache which is not there", function() {
//         return TrackableContract.deployed().then(function(instance) {
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[0]});
//         }).then(function(){
//             return tc.getLastCache();
//         }).then(function(cacheID){
//             return tc.takeTrackable(0, cacheID);
//         }).then(assert.fail)
//         .catch(function(error) {
//            assert.include(
//                error.message,
//                'onlyTrackableInCache',
//                'You can not take trackable from cache which is not there.'
//            )
//         });
//     });


//     it("Remove trackable from cache", function() {
//         return TrackableContract.deployed().then(function(instance){
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[0],
//                 {from: accounts[1]});
//         })
//         .then(function(){
//             hashedAccount = web3.utils.keccak256(accounts[2]);
//             return web3.eth.sign(hashedAccount, accounts[0]).then(function(signature){
//                     return tc.findCache(
//                         0,
//                         signature,
//                         {from: accounts[2]}
//                     )
//             })
//         }).then(function(){
//             return tc.makeTrackable("trackable1", "first", {from: accounts[2]});
//         }).then(function(){
//             assert.equal(false, tc.isUnCreatedCache.call(0));
//         }).then(function(){
//             return tc.putTrackable(
//                 0, //trackableID
//                 0, //cacheID
//                 {from: accounts[2]});
//         }).then(function(){
//             hashedAccount = web3.utils.keccak256(accounts[2]);
//             return web3.eth.sign(hashedAccount, accounts[1]).then(function(signature){
//                     return tc.findCache(
//                         0,
//                         signature,
//                         {from: accounts[2]}
//                     )
//             })
//         })
//         .then(function(){
//             return tc.takeTrackable(
//                 0, //trackableID
//                 0  //cacheID
//             );
//         }).then(function(){
//             assert.equal(0, tc.getCacheTrackables.call().length, "getCacheTrackables should be empty");
//             assert.equal(accounts[2], tc.getTrackableOwner.call(), "trackable not owned by the one who took it");
//         });
//     });

//     it("Find cache", function(){
//         return TrackableContract.deployed().then(function(instance){
//             tc = instance;
//             return tc.makeCache("cache1", 
//                 "first cache", 
//                 "12, 12", 
//                 accounts[1],
//                 {from: accounts[1]});
//         })
//         .then(function(){
//             hashedAccount = web3.utils.keccak256(accounts[2]);
//             return web3.eth.sign(web3.utils.toHex(hashedAccount), accounts[1]).then(function(signature){
//                     return tc.findCache(
//                         0,
//                         signature,
//                         {from: accounts[2]}
//                     )
//             })
//         }).then(function(){
//                 return tc.getCacheUserHasfound(0, accounts[2]);
//         }).then(function(userHasFound){
//             assert.equal(true, userHasFound, "User has not visited")
//         });
//     });

});




function modifyCache(_contract, _publicKey, _sender){
    return _contract.modifyCache(cacheID,
        testCacheNameModifyed, 
        testCacheDescriptionModifyed, 
        testLocationModifyed, 
        _publicKey,
        {from: _sender}
    ).then(x => {
        assert.equal(_contract.getCa)
    })
}

function removeCache(_contract, _cacheID, _sender){
    return _contract.removeCache(
            _cacheID,
            {from: _sender}
    )
}

const testProblemText = "This is a test problem. The cache is bad."
function reportProblem(_contract, _problem, _cacheID){
    return _contract.reportProblem(
        testProblemText,
        _cacheID,
        {from: _sender}
    )
}

function findCache(_contract, _cacheID, _privateKey, _signedAddress, _sender){
    hashedAddress = web3.utils.keccak256(_signedAddress);
    return web3.eth.sign(web3.utils.toHex(hashedAddress), _privateKey)
        .then(signature => {
            _contract.findCache(
                _cacheID,
                signature,
                {from: _sender}
            )
        })
}


function makeTrackable(_contract, _sender){
    return _contract.makeTrackable(
        testTrackableName, 
        testTrackableDescription, 
        {from: _sender}
    )
}

function getSingature(_signedAddress, _publicKey){
    hashedAddress = web3.utils.keccak256(_signedAddress);
    return web3.eth.sign(web3.utils.toHex(hashedAddress), _publicKey)
}

function hashedAddress(_signedAddress){
    return web3.utils.keccak256(_signedAddress);
}