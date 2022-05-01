// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract GeoCachingContract{
    mapping(uint=>Cache) caches;
    uint nextIndexCache;
    mapping(uint => Trackable) trackables;
    uint nextIndexTrackable;
    mapping(address => TarackableCollection) ownerToTrackables;

    //TODO we can only test public functions, do these as public 
    function getCache(uint cacheID) private view
    returns(Cache storage cache){
        return caches[cacheID];
    }

    function getTrackable(uint trackableID) private view
    returns(Trackable storage trackable){
        return trackables[trackableID];
    }

    function getTrackableOwner(uint trackableID)public view
    returns(address owner){
        return trackables[trackableID].owner;
    }

    function getCacheTrackables(uint cacheID) private view
    returns(uint[] memory cachedTrackables){
        return caches[cacheID].trackables;
    }

    struct GPS{
        uint latitude;
        uint longitude;
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

    function isInCache(uint trackableID) internal view returns(bool result){
       return trackables[trackableID].owner == address(0);
    }

    struct TarackableCollection{
        mapping(uint => bool) collectedTrackables;
    }

    struct Cache{
        address owner;
        string name;
        string description;
        GPS gpsCoord;
        uint publicKey;

        mapping(address => bool) finders;

        uint[] trackables;
        mapping(uint => uint) trackableToArrayIndex;

        Problem[] problems;
        
        bool isDeleted;
    }

    function isDeleted(uint cacheID) internal view returns(bool result){
        return(cacheID < nextIndexCache && caches[cacheID].isDeleted);
    }

    function isValid(uint cacheID)internal view returns(bool result){
        return(cacheID < nextIndexCache && !caches[cacheID].isDeleted);
    }

    function isUnCreated(uint cacheID)internal view returns(bool result){
        return(cacheID >= nextIndexCache);
    }

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
