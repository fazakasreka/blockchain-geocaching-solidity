// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";

contract CacheContract is GeoCachingContract{
    
    modifier onlyOwner(uint cacheID) {
        require(msg.sender == caches[cacheID].owner);
        _;
    }

    modifier onlyValidCache(uint cacheID){
        require(isValid(cacheID));
        _;
    }

    modifier onlyValidSignature(uint cacheID, uint signedAddress){
        caches[cacheID].publicKey;
        signedAddress;
        msg.sender;
        require(true);
        _;
    }


    //Only cache owners/maintainers may remove or modify caches.
    //However, all players have the option to report problems with caches, e.g., if it seems to have gone missing or been damaged.
    function makeCache(
        string memory name,
        string memory description,
        GPS memory gpsCoord,
        uint publicKey
    ) public{
        Cache storage newCache = caches[nextIndex++];

        newCache.owner = msg.sender;
        newCache.name = name;
        newCache.description = description;
        newCache.gpsCoord = gpsCoord;
        newCache.publicKey = publicKey;
        newCache.isDeleted = false;
    }

    function modifyCache(
        uint cacheID,
        string memory name,
        string memory description,
        GPS memory gpsCoord,
        uint publicKey
    ) public 
    onlyOwner(cacheID)
    onlyValidCache(cacheID){
        Cache storage newCache = caches[cacheID];

        newCache.owner = msg.sender;
        newCache.name = name;
        newCache.description = description;
        newCache.gpsCoord = gpsCoord;
        newCache.publicKey = publicKey;
        newCache.isDeleted = false;
    }
    
    function removeCache(uint cacheID) public 
    onlyOwner(cacheID){
        caches[cacheID].isDeleted = true;
    }
    function reportProblem(string memory problem, uint cacheID) public
    onlyValidCache(cacheID){
        caches[cacheID].problems[caches[cacheID].problemCount++] = Problem(msg.sender, problem);
    }

    //You must implement some mechanism that ensures only those who actually found the cache can log their success.
    function findCache(uint cacheID, uint signedAddress) public 
    onlyValidSignature(cacheID, signedAddress)
    onlyValidCache(cacheID){
        caches[cacheID].finders.push(msg.sender);
    }

}