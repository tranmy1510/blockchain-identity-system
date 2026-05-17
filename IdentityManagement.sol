// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityManagement {
    
    // 2. Cấu trúc lưu trữ thông tin tối thiểu trên blockchain
    struct Identity {
        bytes32 identityHash; // hash của hồ sơ người dùng
        bool verified;        // trạng thái đã xác minh hay chưa
        uint256 updatedAt;    // thời gian cập nhật gần nhất
    }

    // 3. Mapping dùng userId để tìm identity tương ứng trên blockchain
    mapping(string => Identity) private identities;

    // 8. Các Events giúp ghi lại sự kiện trên blockchain phục vụ cho việc demo giao dịch thật
    event IdentityStored(string userId, bytes32 identityHash, uint256 timestamp);
    event IdentityVerified(string userId, uint256 timestamp);

    // 4. Hàm storeIdentityHash: Lưu hash của hồ sơ khi backend approve user
    function storeIdentityHash(string memory _userId, bytes32 _identityHash) public {
        identities[_userId] = Identity({
            identityHash: _identityHash,
            verified: false, // Mặc định ban đầu chưa xác minh
            updatedAt: block.timestamp
        });

        emit IdentityStored(_userId, _identityHash, block.timestamp);
    }

    // 5. Hàm verifyIdentity: Đánh dấu user đã được xác minh (verified = true)
    function verifyIdentity(string memory _userId) public {
        require(identities[_userId].identityHash != bytes32(0), "Identity dung khong ton tai");
        
        identities[_userId].verified = true;
        identities[_userId].updatedAt = block.timestamp;

        emit IdentityVerified(_userId, block.timestamp);
    }

    // 6. Hàm getVerificationStatus: Cho phép backend/frontend kiểm tra trạng thái xác minh
    function getVerificationStatus(string memory _userId) public view returns (bool) {
        return identities[_userId].verified;
    }

    // 7. Hàm getIdentityHash: Lấy hash đã lưu để đối chiếu chống chỉnh sửa trái phép
    function getIdentityHash(string memory _userId) public view returns (bytes32) {
        return identities[_userId].identityHash;
    }
}