// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./GeoCachingContract.sol";
import "./CacheContract.sol";

contract TrackableContract is GeoCachingContract, CacheContract{

    modifier onlyOwnerOfTrackable(uint trackableID) {
        require(msg.sender == trackables[trackableID].owner);
        _;
    }

    modifier onlyTrackableInCache(uint trackableID, uint cacheID) {
        require(
            isValidCache(cacheID)
            && isInCacheTrackable(trackableID)
            && trackables[trackableID].cacheID == cacheID
        );
        _;
    }

    modifier onlyIfSenderAlreadyFoundCache(uint cacheID) {
        require(caches[cacheID].finders[msg.sender]);
        _;
    }


    function makeTrackable (
        string memory name,
        string memory description
    ) public {
        Trackable storage newTrackable  = trackables[nextIndexTrackable];

        newTrackable.creator = msg.sender;
        newTrackable.owner = msg.sender;
        newTrackable.name = name;
        newTrackable.description = description;

        ownerToTrackables[msg.sender].collectedTrackables[nextIndexTrackable] = true;

        nextIndexTrackable++;
    }

    function putTrackable(uint trackableID, uint cacheID) public
    onlyOwnerOfTrackable(trackableID)
    onlyValidCache(cacheID)
    onlyIfSenderAlreadyFoundCache(cacheID){

        addTrackableToCache(trackableID, cacheID);

        trackables[trackableID].owner = address(0);
        trackables[trackableID].cacheID = cacheID;

        ownerToTrackables[msg.sender].collectedTrackables[cacheID] = false;
    }

    function takeTrackable(uint trackableID, uint cacheID) public 
    onlyTrackableInCache(trackableID, cacheID)
    onlyIfSenderAlreadyFoundCache(cacheID){

        removeTrackableFromCache(trackableID, cacheID);

        trackables[trackableID].owner = msg.sender;

        ownerToTrackables[msg.sender].collectedTrackables[trackableID] = true;
    }

}