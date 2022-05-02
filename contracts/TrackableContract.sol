// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";
import "./CacheContract.sol";

contract TrackableContract is CacheContract{

    modifier onlyOwnerOfTrackable(uint _trackableID)
    {
        require(trackables[_trackableID].owner == msg.sender, "onlyOwnerOfTrackable");
        _;
    }

    modifier onlyTrackableInCache(uint _trackableID, uint _cacheID) 
    {
        require(
            isValidCache(_cacheID) //cache exists and is not deleted
            && isInCacheTrackable(_trackableID) //trackable is in a cache
            && trackables[_trackableID].cacheID == _cacheID,  //its in this cache
            "onlyTrackableInCache"
        );
        _;
    }

    modifier onlyIfSenderAlreadyFoundCache(uint _cacheID)
    {
        require(caches[_cacheID].finders[msg.sender], "onlyIfSenderAlreadyFoundCache");
        _;
    }


    function makeTrackable (
        string memory _name,
        string memory _description
    ) 
        public
        returns (uint)
    {
        Trackable storage newTrackable  = trackables[nextIndexTrackable];

        newTrackable.creator = msg.sender;
        newTrackable.owner = msg.sender;
        newTrackable.name = _name;
        newTrackable.description = _description;

        ownerToTrackables[msg.sender].collectedTrackables[nextIndexTrackable] = true;

        nextIndexTrackable++;
        return nextIndexTrackable - 1;
    }


    function putTrackable(uint _trackableID, uint _cacheID) 
        public
        onlyOwnerOfTrackable(_trackableID)
        onlyValidCache(_cacheID)
        onlyIfSenderAlreadyFoundCache(_cacheID)
    {

        addTrackableToCache(_trackableID, _cacheID);

        trackables[_trackableID].owner = address(0);
        trackables[_trackableID].cacheID = _cacheID;

        ownerToTrackables[msg.sender].collectedTrackables[_cacheID] = false;
    }


    function takeTrackable(uint _trackableID, uint _cacheID) 
        public 
        onlyTrackableInCache(_trackableID, _cacheID)
        onlyIfSenderAlreadyFoundCache(_cacheID)
    {

        removeTrackableFromCache(_trackableID, _cacheID);

        trackables[_trackableID].owner = msg.sender;

        ownerToTrackables[msg.sender].collectedTrackables[_trackableID] = true;
    }

}