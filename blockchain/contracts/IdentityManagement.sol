// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityManagement {
    address public owner;

    struct Identity {
        bytes32 identityHash;
        bool verified;
        uint256 updatedAt;
    }

    mapping(string => Identity) private identities;

    event IdentityStored(string userId, bytes32 identityHash, uint256 timestamp);
    event IdentityVerified(string userId, uint256 timestamp);
    event IdentityRevoked(string userId, uint256 timestamp);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storeIdentityHash(string memory _userId, bytes32 _identityHash) public onlyOwner {
        require(bytes(_userId).length > 0, "User ID is required");
        require(_identityHash != bytes32(0), "Identity hash is required");

        identities[_userId] = Identity({
            identityHash: _identityHash,
            verified: false,
            updatedAt: block.timestamp
        });

        emit IdentityStored(_userId, _identityHash, block.timestamp);
    }

    function verifyIdentity(string memory _userId) public onlyOwner {
        require(bytes(_userId).length > 0, "User ID is required");
        require(identities[_userId].identityHash != bytes32(0), "Identity does not exist");

        identities[_userId].verified = true;
        identities[_userId].updatedAt = block.timestamp;

        emit IdentityVerified(_userId, block.timestamp);
    }

    function revokeIdentity(string memory _userId) public onlyOwner {
        require(bytes(_userId).length > 0, "User ID is required");
        require(identities[_userId].identityHash != bytes32(0), "Identity does not exist");

        identities[_userId].verified = false;
        identities[_userId].updatedAt = block.timestamp;

        emit IdentityRevoked(_userId, block.timestamp);
    }

    function getVerificationStatus(string memory _userId) public view returns (bool) {
        return identities[_userId].verified;
    }

    function getIdentityHash(string memory _userId) public view returns (bytes32) {
        return identities[_userId].identityHash;
    }

    function getIdentity(string memory _userId)
        public
        view
        returns (bytes32 identityHash, bool verified, uint256 updatedAt)
    {
        Identity memory identity = identities[_userId];
        return (identity.identityHash, identity.verified, identity.updatedAt);
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");

        address previousOwner = owner;
        owner = _newOwner;

        emit OwnershipTransferred(previousOwner, _newOwner);
    }
}