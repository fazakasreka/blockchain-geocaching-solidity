// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract GeoCachingContract{
    mapping(uint=>Cache) caches;
    uint nextIndexCache;
    mapping(uint => Trackable) trackables;
    uint nextIndexTrackable;
    mapping(address => TarackableCollection) ownerToTrackables;

    //getters for cache
    function getCacheName(uint cacheID) public view
    returns(string memory name){
        return caches[cacheID].name;
    }

    function getCacheDescription(uint cacheID) public view
    returns(string memory description){
        return caches[cacheID].description;
    }
    function getCacheGPSCoords(uint cacheID) public view
    returns(string memory gpsCoord){
        return caches[cacheID].gpsCoord;
    }
    function getCachePublicKey(uint cacheID) public view
    returns(address publicKey){
        return caches[cacheID].publicKey;
    }
    function getCacheUserHasfound(uint cacheID, address user) public view
    returns(bool hasFound){
        return caches[cacheID].finders[user];
    }

    function getCacheTrackables(uint cacheID) public view
    returns(uint[] memory cachedTrackables){
        return caches[cacheID].trackables;
    }

    function getCacheProblems(uint cacheID) public view
    returns(Problem[] memory problems){
        return caches[cacheID].problems;
    }

    //getters for trackable
    function getTrackable(uint trackableID) public view
    returns(Trackable memory trackable){
        return trackables[trackableID];
    }

    function getTrackableOwner(uint trackableID)public view
    returns(address owner){
        return trackables[trackableID].owner;
    }

    struct Problem{
        address reporter;
        string problem;
    }

    struct Trackable{
        address creator;
        address owner;
        uint cacheID;
        string name;
        string description;
    }
    function isInCacheTrackable(uint trackableID) internal view returns(bool result){
       return trackables[trackableID].owner == address(0) && trackableID < nextIndexTrackable;
    }
    function isAtOwnerTrackable(uint trackableID) internal view returns(bool result){
       return trackables[trackableID].owner != address(0) && trackableID < nextIndexTrackable;
    }
    function isUnCreatedTrackable(uint trackableID) internal view returns(bool result){
       return trackableID >= nextIndexTrackable;
    }

    struct TarackableCollection{
        mapping(uint => bool) collectedTrackables;
    }

    struct Cache{
        address owner;
        string name;
        string description;
        string gpsCoord;
        address publicKey;

        mapping(address => bool) finders;

        uint[] trackables;
        mapping(uint => uint) trackableToArrayIndex;

        Problem[] problems;
        
        bool isDeleted;
    }
    function isDeletedCache(uint cacheID) public view returns(bool result){
        return(cacheID < nextIndexCache && caches[cacheID].isDeleted);
    }
    function isValidCache(uint cacheID)public view returns(bool result){
        return(cacheID < nextIndexCache && !caches[cacheID].isDeleted);
    }
    function isUnCreatedCache(uint cacheID)public view returns(bool result){
        return(cacheID >= nextIndexCache);
    }
    modifier onlyValidCache(uint cacheID){
        require(isValidCache(cacheID));
        _;
    }


//INTERNAL!!!!!
    function addTrackableToCache(uint trackableID, uint cacheID) internal{
        Cache storage modifiedCache = caches[cacheID];

        modifiedCache.trackables.push(trackableID);
        modifiedCache.trackableToArrayIndex[trackableID] = modifiedCache.trackables.length - 1;
    }

    function removeTrackableFromCache(uint trackableID, uint cacheID) internal{
        Cache storage modifiedCache = caches[cacheID];

        uint potentialIndex = modifiedCache.trackableToArrayIndex[trackableID];
        require(modifiedCache.trackables[potentialIndex] == trackableID);
        //index is good

        uint last = modifiedCache.trackables[modifiedCache.trackables.length - 1];
        modifiedCache.trackables[potentialIndex] = last;
        modifiedCache.trackableToArrayIndex[last] = potentialIndex;

        modifiedCache.trackables.pop();
    }

}
