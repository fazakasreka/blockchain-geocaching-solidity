// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;
pragma solidity <=0.10.0;

contract SignatureVerifyerContract{
     function verifySendersAddressSignedWithCacheAddress(
        bytes memory signature,
        address cachePublicKey,
        address senderAddress
    ) public pure returns (bool) {
        bytes32 ethSignedAddressHash = getEthSignedAddressHash(senderAddress);
        return recoverSigner(ethSignedAddressHash, signature) == cachePublicKey;
    }

    function getEthSignedAddressHash(address signedAddress)
        public pure returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32", 
                    keccak256(abi.encodePacked(string(abi.encodePacked(signedAddress)))))
            );
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory signature)
        public
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

}