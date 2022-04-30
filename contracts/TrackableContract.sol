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

    function putTrackable(uint cacheID, uint trackableID) public
    onlyOwnerOfTrackable(trackableID)
    onlyValidCache(cacheID){
        caches[cacheID].trackables[
            caches[cacheID].trackableCount++
        ] = trackableID;
    }

}