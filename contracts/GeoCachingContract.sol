// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract GeoCachingContract{

////static data
    mapping(uint=>Cache) caches;
    uint nextIndexCache;
    mapping(uint => Trackable) trackables;
    uint nextIndexTrackable;
    mapping(address => TrackableCollection) ownerToTrackables;

////data structures
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

    struct Trackable{
        address creator;
        address owner;
        uint cacheID;
        string name;
        string description;
    }

    struct Problem{
        address reporter;
        string problem;
    }

    struct TrackableCollection{
        mapping(uint => bool) collectedTrackables;
    }


//////getters for cache
    function getCacheOwner(uint _cacheID) 
        public view
        returns(address owner)
    {
        return caches[_cacheID].owner;
    }

    function getCacheName(uint _cacheID)
        public view
        returns(string memory name)
    {
        return caches[_cacheID].name;
    }

    function getCacheDescription(uint _cacheID) 
        public view
        returns(string memory description)
    {
        return caches[_cacheID].description;
    }

    function getCacheGPSCoords(uint _cacheID) 
        public view
        returns(string memory gpsCoord)
    {
        return caches[_cacheID].gpsCoord;
    }

    function getCachePublicKey(uint _cacheID)
        public view
        returns(address publicKey)
    {
        return caches[_cacheID].publicKey;
    }

    function getCacheUserHasfound(uint _cacheID, address _user)
        public view
        returns(bool hasFound)
    {
        return caches[_cacheID].finders[_user];
    }

    function getCacheTrackables(uint _cacheID)
        public view
        returns(uint[] memory cachedTrackables)
    {
        return caches[_cacheID].trackables;
    }

    function getCacheProblems(uint _cacheID) 
        public view
        returns(Problem[] memory problems)
    {
        return caches[_cacheID].problems;
    }

    function getLastCache()
        public view
        returns(uint)
    {
        require(nextIndexCache > 0);
        return nextIndexCache - 1;
    }


//////getters for trackable
    function getTrackable(uint _trackableID) 
        public view
        returns(Trackable memory trackable)
    {
        return trackables[_trackableID];
    }

    function getTrackableOwner(uint _trackableID)
        public view
        returns(address owner)
    {
        return trackables[_trackableID].owner;
    }

    function getTrackableCache(uint _trackableID)
        public view
        returns(uint cacheID)
    {
        return trackables[_trackableID].cacheID;
    }

    function getLastTrackable()
        public view
        returns(uint)
    {
        require(nextIndexTrackable > 0);
        return nextIndexTrackable - 1;
    }


////cache state functions
    function isDeletedCache(uint _cacheID) 
        public view
        returns(bool result)
    {
        return(_cacheID < nextIndexCache && caches[_cacheID].isDeleted);
    }

    function isValidCache(uint _cacheID)
        public view 
        returns(bool result)
    {
        return(_cacheID < nextIndexCache && !caches[_cacheID].isDeleted);
    }
    function isUnCreatedCache(uint _cacheID)
        public view 
        returns(bool result)
    {
        return(_cacheID >= nextIndexCache);
    }


////trackable state functions
    function isInCacheTrackable(uint _trackableID)
        public view 
        returns(bool result)
    {
       return trackables[_trackableID].owner == address(0) && _trackableID < nextIndexTrackable;
    }
    function isAtOwnerTrackable(uint _trackableID) 
        public view
        returns(bool result)
    {
       return trackables[_trackableID].owner != address(0) && _trackableID < nextIndexTrackable;
    }
    function isUnCreatedTrackable(uint _trackableID) 
        public view 
        returns(bool result)
    {
       return _trackableID >= nextIndexTrackable;
    }


//KEEP INTERNAL!! //helper functions for handling trackable arrays
    function addTrackableToCache(uint _trackableID, uint _cacheID) 
        internal
    {
        Cache storage modifiedCache = caches[_cacheID];

        modifiedCache.trackables.push(_trackableID);
        modifiedCache.trackableToArrayIndex[_trackableID] = modifiedCache.trackables.length - 1;
    }

    function removeTrackableFromCache(uint _trackableID, uint _cacheID) 
        internal
    {
        Cache storage modifiedCache = caches[_cacheID];

        uint potentialIndex = modifiedCache.trackableToArrayIndex[_trackableID];
        require(modifiedCache.trackables[potentialIndex] == _trackableID);
        //index is good

        uint last = modifiedCache.trackables[modifiedCache.trackables.length - 1];
        modifiedCache.trackables[potentialIndex] = last;
        modifiedCache.trackableToArrayIndex[last] = potentialIndex;

        modifiedCache.trackables.pop();
    }

}
