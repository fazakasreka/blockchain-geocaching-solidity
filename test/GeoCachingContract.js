var TrackableContract = artifacts.require("TrackableContract");

const testCacheName =  "This is a test cache"
const testCacheDescription =  "This is the test cache's description"
const testLocation = "47°29'33″N  19°03'05″E"

const testCacheNameModifyed =  "This is a modified title"
const testCacheDescriptionModifyed  =  "This is a modified description"
const testLocationModifyed  = "66°29'33″N  77°03'05″E modified"

const testTrackableName = "This is a test trackable"
const testTrackableDescription = "This is a test trackable description"

const testProblemText = "This is a test problem. The cache is bad."

contract('TrackableContract', (accounts) => {
    var contract = TrackableContract.deployed()

    it("initial: initial state", () => 

    {
        return contract.then(async instance => 
        {

            isUncreatedCache_0 = await instance.isUnCreatedCache.call(0)
            assert.equal(true, isUncreatedCache_0, "Cache 0 exists at init.")

            getCacheOwner_0 = await instance.getCacheOwner.call(0)
            assert.equal(0, getCacheOwner_0, "Cache 0 has owner at init.")

            isUnCreatedTrackable_0 = await instance.isUnCreatedTrackable.call(0)
            assert.equal(true, isUnCreatedTrackable_0, "Trackable 0 exists at init.")

            getTrackableOwner_0 = await instance.getTrackableOwner.call(0)
            assert.equal(0, getTrackableOwner_0, "Trackable 0 has owner at init.")

        })
    })

    it("makeCache: normal function + cache getter functions", () => 
    {
        return contract.then(async instance => 
        {
            sender = accounts[0]
            publicKey = accounts[1]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: sender}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Contract.makeCache(...) failed")

            //test getters and fileds of cache
            cacheOwner = await instance.getCacheOwner.call(cacheID)
            assert.equal(sender, cacheOwner, "Cache.owner incorrect.")

            cacheName = await instance.getCacheName.call(cacheID)
            assert.equal(testCacheName, cacheName, "Cache.name incorrect.")

            cacheDescription = await instance.getCacheDescription.call(cacheID)
            assert.equal(testCacheDescription, cacheDescription, "Cache.description incorrect.")

            cacheGPSCoords = await instance.getCacheGPSCoords.call(cacheID)
            assert.equal(testLocation, cacheGPSCoords, "Cache.GPSCoords incorrect.")

            cachePublicKey = await instance.getCachePublicKey.call(cacheID)
            assert.equal(publicKey, cachePublicKey, "Cache.publicKey incorrect.")

            cacheTrackables = await instance.getCacheTrackables.call(cacheID)
            assert.equal(0, cacheTrackables.length, "Cache.trackables incorrect.")

            cacheProblems = await instance.getCacheProblems.call(cacheID)
            assert.equal(0, cacheProblems.length, "Cache.problems incorrect.")
        })
    })

    it("modifyCache: normal function", () => 
    {
        return contract.then(async instance => 
        {
            sender = accounts[0]
            publicKey = accounts[1]
            newPublicKey = accounts[2]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: sender}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test.")

            //modify cache
            await instance.modifyCache(
                cacheID,
                testCacheNameModifyed, 
                testCacheDescriptionModifyed, 
                testLocationModifyed, 
                newPublicKey,
                {from: sender}
            )

            //test modyfiy sucessful
            cacheOwner = await instance.getCacheOwner.call(cacheID)
            assert.equal(sender, cacheOwner, "Cache.owner incorrect.")

            cacheName = await instance.getCacheName.call(cacheID)
            assert.equal(testCacheNameModifyed, cacheName, "Cache.name incorrect.")

            cacheDescription = await instance.getCacheDescription.call(cacheID)
            assert.equal(testCacheDescriptionModifyed, cacheDescription, "Cache.description incorrect.")

            cacheGPSCoords = await instance.getCacheGPSCoords.call(cacheID)
            assert.equal(testLocationModifyed, cacheGPSCoords, "Cache.GPSCoords incorrect.")

            cachePublicKey = await instance.getCachePublicKey.call(cacheID)
            assert.equal(newPublicKey, cachePublicKey, "Cache.publicKey incorrect.")

            cacheTrackables = await instance.getCacheTrackables.call(cacheID)
            assert.equal(0, cacheTrackables.length, "Cache.trackables incorrect.")

            cacheProblems = await instance.getCacheProblems.call(cacheID)
            assert.equal(0, cacheProblems.length, "Cache.problems incorrect.")
        })
    })

    it("modifyCache: only valid cache can be modified (onlyValidCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            newPublicKey = accounts[3]
            
            //get an UNCREATED cache
            var cacheID = await instance.getLastCache.call()
            cacheID = cacheID.toNumber() + 1

            isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
            assert.equal(true, isUnCreatedCache, "Failed to acquire uncreated cache for test")
            
            //try to modify uncreated cache
            var failed = false
            await instance.modifyCache(
                cacheID,
                testCacheNameModifyed, 
                testCacheDescriptionModifyed, 
                testLocationModifyed, 
                newPublicKey,
                {from: cacheOwner}
            //test for error
            ).catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidCache',
                    'Modify uncreated cache failed as expected, but not because onlyValidCache modifier'
                )
            })
            assert.equal(true, failed, "An uncreated cache was modified")

            //get DELETED cache
                //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
                //remove cache
            cacheID = await instance.getLastCache.call()
            await instance.removeCache(
                cacheID
            )
                //check delete successfull
            isDeletedCache = await instance.isDeletedCache.call(cacheID)
            assert.equal(true, isDeletedCache, "Failed to acquire deleted cache for test")
            
             //try to modify deleted cache
             var failed = false
             await instance.modifyCache(
                 cacheID,
                 testCacheNameModifyed, 
                 testCacheDescriptionModifyed, 
                 testLocationModifyed, 
                 newPublicKey,
                 {from: cacheOwner}
             //test for error
             ).catch(error => {
                 failed = true
                 assert.include(
                     error.message,
                     'onlyValidCache',
                     'Modify uncreated cache failed as expected, but not because onlyValidCache modifier'
                 )
             })
             assert.equal(true, failed, "An uncreated cache was modified")
        
        })
    })

    it("modifyCache: only cache.owner can modify (onlyOwnerOfCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            senderOfModify = accounts[1]
            publicKey = accounts[2]
            newPublicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: cacheOwner}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")

            //modify cache sent by not owner
            var failed = false
            await instance.modifyCache(
                cacheID,
                testCacheNameModifyed, 
                testCacheDescriptionModifyed, 
                testLocationModifyed, 
                newPublicKey,
                {from: senderOfModify}
            //test for error
            ).catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyOwnerOfCache',
                    'Cache modified by not owner failed as expected, but not because onlyOwnerOfCache modifier'
                )
            })
            assert.equal(true, failed, "Cache removed by not owner.")
            
            
        })
    })

    it("removeCache: normal function", () => 
    {
        return contract.then(async instance => 
        {
            sender = accounts[0]
            publicKey = accounts[1]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: sender}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")

            //delete cache
            await instance.removeCache(
                cacheID,
                {from: sender}
            )

            //test success of removeCache
            cacheDeleted = await instance.isDeletedCache.call(cacheID)
            assert.equal(true, cacheDeleted, "Contract.removeCache(...) failed")
        })
    })

    it("removeCache: only valid cache can be removed (onlyValidCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            newPublicKey = accounts[3]
            
            //get an UNCREATED cache
            var cacheID = await instance.getLastCache.call()
            cacheID = cacheID.toNumber() + 1

            isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
            assert.equal(true, isUnCreatedCache, "Failed to acquire uncreated cache for test")
            
            //try to remove uncreated cache
            var failed = false
            await instance.removeCache(
                cacheID,
                {from: cacheOwner}
            //test for error
            ).catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidCache',
                    'Remove uncreated cache failed as expected, but not because onlyValidCache modifier'
                )
            })
            assert.equal(true, failed, "An uncreated cache was removed")

            //get DELETED cache
                //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
                //remove cache
            cacheID = await instance.getLastCache.call()
            await instance.removeCache(
                cacheID
            )
                //check delete succesfull
            isDeletedCache = await instance.isDeletedCache.call(cacheID)
            assert.equal(true, isDeletedCache, "Failed to acquire deleted cache for test")
            
             //try to remove deleted cache
             var failed = false
             await instance.removeCache(
                 cacheID,
                 {from: cacheOwner}
             //test for error
             ).catch(error => {
                 failed = true
                 assert.include(
                     error.message,
                     'onlyValidCache',
                     'Remove uncreated cache failed as expected, but not because onlyValidCache modifier'
                 )
             })
             assert.equal(true, failed, "An uncreated cache was removed.")
        
        })
    })

    it("removeCache: only empty cache can be removed (onlyCacheEmpty)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache
            hashedAddress = web3.utils.keccak256(cacheOwner)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: cacheOwner}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, cacheOwner)
            assert.equal(true, userHasFound, "Could not get user to find cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: cacheOwner}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: cacheOwner}
            )
            getTrackableOwner = await instance.getTrackableOwner.call(trackableID)
            assert.equal(0, getTrackableOwner, "Could not put trackable in cache for test.")

             //try to deleted cache with items
             var failed = false
             await instance.removeCache(
                 cacheID,
                 {from: cacheOwner}
             //test for error
             ).catch(error => {
                 failed = true
                 assert.include(
                     error.message,
                     'onlyCacheEmpty',
                     'Remove uncreated cache failed as expected, but not because onlyCacheEmpty modifier'
                 )
             })
             assert.equal(true, failed, "A cache with trackables was removed.")
        
        })
    })

    it("removeCache: only cache.owner can remove (onlyOwnerOfCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            senderOfRemove = accounts[1]
            publicKey = accounts[2]
            newPublicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: cacheOwner}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test.")

            //remove cache sent by not owner
            var failed = false
            await instance.removeCache(
                    cacheID,
                    {from: senderOfRemove}
            //test fro failure
            ).catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyOwnerOfCache',
                    'Cache remove by not owner failed as expected, but not because onlyOwnerOfCache modifier'
                )
            })
            assert.equal(true, failed, "Cache removed by not owner.")
            
            
        })
    })

    it("reportProblem: normal function", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            publicKey = accounts[2]
            
            //make cache
            await instance.makeCache(
                    testCacheName, 
                    testCacheDescription, 
                    testLocation, 
                    publicKey,
                    {from: cacheOwner}
            )
            
            //test success of makeCache
            const cacheID = await instance.getLastCache.call()

            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test.")

            //report problem
            await instance.reportProblem(
                testProblemText,
                cacheID,
                {from: cacheOwner}
            )
            //test problem there
            const problems = await instance.getCacheProblems(cacheID)
            assert.equal(testProblemText, problems[0][1], "Problem text does not match.")
            assert.equal(cacheOwner, problems[0][0], "Problem owner does not match.")
        
            
        })
    })

    it("reportProblem: invalid cache", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            publicKey = accounts[2]
            
            //get invalid cache id
            var cacheID = await instance.getLastCache.call()
            cacheID = cacheID.toNumber() + 1

            isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
            assert.equal(true, isUnCreatedCache, "Could not get invalid cache for test.")

            //report problem on invalid cache
            var failed = false
            await instance.reportProblem(
                testProblemText,
                cacheID,
            //test for failure
            ).catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidCache',
                    'Report problem on invalid cache failed as expected, but not because onlyValidCache modifier'
                )
            })
            assert.equal(true, failed, "Problem reported on invalid cache.")
        
            
        })
    })

    it("findCache: normal function", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache
            hashedAddress = web3.utils.keccak256(cacheOwner)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: cacheOwner}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, cacheOwner)
            assert.equal(true, userHasFound, "User finding cache failed.")
        })
    })

    it("findCache: invalid cache (onlyValidCache)", () => 
    {
        return contract.then(async instance => 
        {
            sender = accounts[0]
            publicKey = accounts[2]
            
            var cacheID = await instance.getLastCache.call()
            cacheID = cacheID.toNumber() + 1
            isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
            assert.equal(true, isUnCreatedCache, "Could get invalid cache for test")
            
            //find cache
            hashedAddress = web3.utils.keccak256(sender)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            var fail = false
            await instance.findCache(
                cacheID,
                signature,
                {from: sender}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidCache',
                    'User finding invalid cache failed as expected, but not because onlyValidCache modifier'
                )
            })
            assert.equal(true, failed, "User found invalid cache.")
        })
    })
    

    it("findCache: sign with wrong private key (onlyValidSignature)", () => 
    {
        return contract.then(async instance => 
        {
            player = accounts[0]
            publicKey = accounts[2]
            wrongPublicKey = accounts[1]

            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: player}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")

            //find cache with wrong address signed
            hashedAddress = web3.utils.keccak256(player)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), wrongPublicKey)
            var fail = false
            await instance.findCache(
                cacheID,
                signature,
                {from: player}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidSignature',
                    'User finding cache signed with wrong private key failed, but not because onlyValidSignature modifier'
                )
            })
            assert.equal(true, failed, "User found cache with wrong private key")
        })
    })


    it("findCache: sign wrong address (onlyValidSignature)", () => 
    {
        return contract.then(async instance => 
        {
            player0 = accounts[0]
            player1 = accounts[3]
            publicKey = accounts[2]

            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: player0}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")

            //find cache with wrong address signed
            hashedAddress = web3.utils.keccak256(player0)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            var failed = false
            await instance.findCache(
                cacheID,
                signature,
                {from: player1}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidSignature',
                    'User finding cache with wrong address signed failed, but not because onlyValidSignature modifier'
                )
            })
            assert.equal(true, failed, "User found cache with wrong adress signed with publicKey")
        })
    })

    it("makeTrackable: normal function, getters", () => 
    {
        return contract.then(async instance => 
        {
            trackableOwner = accounts[0]
            player1 = accounts[3]
            publicKey = accounts[2]

            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: trackableOwner}
            )
            const trackableID = await instance.getLastTrackable.call()

            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Trackable.maketrackable(...) failed.")

            creator = await instance.getTrackableCreator(trackableID)
            assert.equal(trackableOwner, creator, "Trackable.creator does not match.")

            owner = await instance.getTrackableOwner(trackableID)
            assert.equal(trackableOwner, owner, "Trackable.owner does not match.")

            cacheID = await instance.getTrackableCacheID(trackableID)
            assert.equal(0, cacheID, "Trackable.cacheID does not match.")
            
            trackableName = await instance.getTrackableName(trackableID)
            assert.equal(testTrackableName, trackableName, "Trackable.name does not match.")

            description = await instance.getTrackableDescription(trackableID)
            assert.equal(testTrackableDescription, description, "Trackable.description does not match.")
        })
    })

    it("putTrackable: normal function", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache
            hashedAddress = web3.utils.keccak256(cacheOwner)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: cacheOwner}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, cacheOwner)
            assert.equal(true, userHasFound, "Could not get user to find cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: cacheOwner}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: cacheOwner}
            )
            getTrackableOwner = await instance.getTrackableOwner.call(trackableID)
            assert.equal(0, getTrackableOwner, "Trackable.putTrackable(...) failed.")
        })
    })

    it("putTrackable: only owner can put it in a cache (onlyOwnerOfTrackable)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            userPuttingInCache = accounts[4]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache
            hashedAddress = web3.utils.keccak256(cacheOwner)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: cacheOwner}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, cacheOwner)
            assert.equal(true, userHasFound, "Could not get user to find cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: cacheOwner}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: userPuttingInCache}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyOwnerOfTrackable',
                    'User not owner of trackable putting trackable in cache failed, but not because onlyOwnerOfTrackable modifier'
                )
            })
            assert.equal(true, failed, "User not owner of trackable put trackable in cache")
        })
    })

    it("putTrackable: only valid cache can recive trackable (onlyValidCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            trackabeOwner = accounts[4]
            publicKey = accounts[3]
            
            //get invalid cache id
            var cacheID = await instance.getLastCache.call()
            cacheID = cacheID.toNumber() + 1

            isUnCreatedCache = await instance.isUnCreatedCache.call(cacheID)
            assert.equal(true, isUnCreatedCache, "Could not get invalid cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: trackabeOwner}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: trackabeOwner}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyValidCache',
                    'User not owner of trackable puting trackable in cache failed, but not because onlyValidCache modifier'
                )
            })
            assert.equal(true, failed, "Trackable was put into invalid cache.")
        })
    })

    it("putTrackable: only one who found the cache can put things into the cache (onlyIfSenderAlreadyFoundCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            trackableOwner = accounts[4]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: trackableOwner}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache without finding it
            var failed = false
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: trackableOwner}
            )//test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyIfSenderAlreadyFoundCache',
                    'User who did not find cache could not put a trackable in it, but not because onlyIfSenderAlreadyFoundCache modifier'
                )
            })
            assert.equal(true, failed, "User who did not find the cache a put trackable into it.")
        })
    })

    it("takeTrackable: normal function", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            makerTrackable = accounts[2]
            takerOftrackable = accounts[4]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache creatorOfTrackable
            hashedAddress = web3.utils.keccak256(makerTrackable)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: makerTrackable}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, makerTrackable)
            assert.equal(true, userHasFound, "Could not get makerTrackable to find cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: makerTrackable}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: makerTrackable}
            )
            getTrackableOwner = await instance.getTrackableOwner.call(trackableID)
            assert.equal(0, getTrackableOwner, "Could not put trackable in cache for the test.")

            //find cache takerOftrackable
            hashedAddress = web3.utils.keccak256(takerOftrackable)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: takerOftrackable}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, takerOftrackable)
            assert.equal(true, userHasFound, "Could not get takerOftrackable to find cache for test.")
        
            //take Trackable
            await instance.takeTrackable(
                trackableID,
                cacheID,
                {from: takerOftrackable}
            )
            trackableOwner = await instance.getTrackableOwner.call(trackableID)
            assert.equal(takerOftrackable, trackableOwner, "Trackable.takeTrackable(...) failed.")
        
        })
    })

    it("takeTrackable: take trackable not in cache", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            makerTrackable = accounts[2]
            takerOftrackable = accounts[4]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: makerTrackable}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //find cache takerOftrackable
            hashedAddress = web3.utils.keccak256(takerOftrackable)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: takerOftrackable}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, takerOftrackable)
            assert.equal(true, userHasFound, "Could not get takerOftrackable to find cache for test.")
        
            //take Trackable
            var failed =false
            await instance.takeTrackable(
                trackableID,
                cacheID,
                {from: takerOftrackable}
            )
            //test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyTrackableInCache',
                    'Taking a trackable from a cache that it is not in failed, but not because onlyTrackableInCache modifier'
                )
            })
            assert.equal(true, failed, "A trackable was taken from a cache it was not in.")
        })
    })
    
    it("takeTrackable: user cant take trackable if they havent found the cache (onlyIfSenderAlreadyFoundCache)", () => 
    {
        return contract.then(async instance => 
        {
            cacheOwner = accounts[0]
            makerTrackable = accounts[2]
            takerOftrackable = accounts[4]
            publicKey = accounts[3]
            
            //make cache
            await instance.makeCache(
                testCacheName, 
                testCacheDescription, 
                testLocation, 
                publicKey,
                {from: cacheOwner}
            )
            const cacheID = await instance.getLastCache.call()
            isValidCache = await instance.isValidCache.call(cacheID)
            assert.equal(true, isValidCache, "Could not make cache for test")
            
            //find cache creatorOfTrackable
            hashedAddress = web3.utils.keccak256(makerTrackable)
            signature = await web3.eth.sign(web3.utils.toHex(hashedAddress), publicKey)
            await instance.findCache(
                cacheID,
                signature,
                {from: makerTrackable}
            )
            userHasFound = await instance.getCacheUserHasfound.call(cacheID, makerTrackable)
            assert.equal(true, userHasFound, "Could not get makerTrackable to find cache for test.")

            //make trackable
            await instance.makeTrackable(
                testTrackableName,
                testTrackableDescription,
                {from: makerTrackable}
            )
            const trackableID = await instance.getLastTrackable.call()
            isAtOwnerTrackable = await instance.isAtOwnerTrackable.call(trackableID)
            assert.equal(true, isAtOwnerTrackable, "Could not make trackable for test.")

            //put trackable into cache
            await instance.putTrackable(
                trackableID, 
                cacheID,
                {from: makerTrackable}
            )
            getTrackableOwner = await instance.getTrackableOwner.call(trackableID)
            assert.equal(0, getTrackableOwner, "Could not put trackable in cache for the test.")

        
            //take Trackable
            await instance.takeTrackable(
                trackableID,
                cacheID,
                {from: takerOftrackable}
            )
            //test for failure
            .catch(error => {
                failed = true
                assert.include(
                    error.message,
                    'onlyIfSenderAlreadyFoundCache',
                    'User who had not found the cache taking the trackable failed, but not because onlyIfSenderAlreadyFoundCache modifier'
                )
            })
            assert.equal(true, failed, "User who had not found the cache took a trackable from it.")
        
        })
    })
})