// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";

contract CacheContract is GeoCachingContract{
    
    modifier onlyOwnerOfCache(uint cacheID) {
        require(msg.sender == caches[cacheID].owner);
        _;
    }

    modifier onlyValidCache(uint cacheID){
        require(isValid(cacheID));
        _;
    }

    //TODO
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
        Cache storage newCache = caches[nextIndexCache++];
        newCache.owner = msg.sender;
        newCache.name = name;
        newCache.description = description;
        newCache.gpsCoord = gpsCoord;
        newCache.publicKey = publicKey;
    }

    function modifyCache(
        uint cacheID,
        string memory name,
        string memory description,
        GPS memory gpsCoord,
        uint publicKey
    ) public 
    onlyOwnerOfCache(cacheID)
    onlyValidCache(cacheID){
        Cache storage modifiedCache = caches[cacheID];

        modifiedCache.owner = msg.sender;
        modifiedCache.name = name;
        modifiedCache.description = description;
        modifiedCache.gpsCoord = gpsCoord;
        modifiedCache.publicKey = publicKey;
    }
    
    function removeCache(uint cacheID) public 
    onlyOwnerOfCache(cacheID){
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
        caches[cacheID].finders[msg.sender] = true;
    }

}