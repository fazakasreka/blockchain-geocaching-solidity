// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;
import "./CacheContract.sol";

contract TrackableContract is CacheContract{
    function fv() public view {
        caches[1].isDeleted;
    }
}