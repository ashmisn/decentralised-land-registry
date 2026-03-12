// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    address public admin;
    uint public propertyCount;

    constructor() {
        admin = msg.sender;
    }

    struct Property {
        uint propertyId;
        string location;
        uint area;
        address currentOwner;
        address[] ownershipHistory;
        uint registeredAt;
        bool isVerified;
    }

    struct TransferRequest {
        address newOwner;
        bool approved;
        bool exists;
    }

    mapping(uint => Property) public properties;
    mapping(uint => TransferRequest) public transferRequests;

    mapping(uint => bool) public frozen;

    mapping(uint => uint) public propertyRatings;
    mapping(uint => uint) public ratingCount;

    mapping(uint => mapping(address => bool)) public hasRated;

    mapping(uint => uint) public lastTaxPaid;

    event PropertyRegistered(uint propertyId, address owner);
    event PropertyVerified(uint propertyId);
    event TransferRequested(uint propertyId, address newOwner);
    event OwnershipTransferred(uint propertyId, address previousOwner, address newOwner);
    event PropertyFrozen(uint propertyId);
    event PropertyUnfrozen(uint propertyId);
    event PropertyRated(uint propertyId, uint rating);
    event TaxPaid(uint propertyId, uint amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier onlyOwner(uint _propertyId) {
        require(
            properties[_propertyId].currentOwner == msg.sender,
            "Not property owner"
        );
        _;
    }

    modifier propertyExists(uint _propertyId) {
        require(_propertyId > 0 && _propertyId <= propertyCount, "Invalid property");
        _;
    }

    function registerProperty(
        string memory _location,
        uint _area,
        address _owner
    ) public onlyAdmin {

        require(_owner != address(0), "Invalid owner");

        propertyCount++;

        Property storage newProperty = properties[propertyCount];

        newProperty.propertyId = propertyCount;
        newProperty.location = _location;
        newProperty.area = _area;
        newProperty.currentOwner = _owner;
        newProperty.registeredAt = block.timestamp;
        newProperty.isVerified = false;

        newProperty.ownershipHistory.push(_owner);

        emit PropertyRegistered(propertyCount, _owner);
    }

    function verifyProperty(uint _propertyId)
        public
        onlyAdmin
        propertyExists(_propertyId)
    {
        properties[_propertyId].isVerified = true;

        emit PropertyVerified(_propertyId);
    }

    function requestTransfer(uint _propertyId, address _newOwner)
        public
        onlyOwner(_propertyId)
        propertyExists(_propertyId)
    {
        require(!frozen[_propertyId], "Property frozen");
        require(properties[_propertyId].isVerified, "Property not verified");
        require(_newOwner != address(0), "Invalid address");

        transferRequests[_propertyId] = TransferRequest(
            _newOwner,
            false,
            true
        );

        emit TransferRequested(_propertyId, _newOwner);
    }

    function approveTransfer(uint _propertyId)
        public
        onlyAdmin
        propertyExists(_propertyId)
    {
        TransferRequest storage req = transferRequests[_propertyId];

        require(req.exists, "No transfer request");
        require(!req.approved, "Already approved");

        address previousOwner = properties[_propertyId].currentOwner;

        properties[_propertyId].currentOwner = req.newOwner;
        properties[_propertyId].ownershipHistory.push(req.newOwner);

        req.approved = true;

        emit OwnershipTransferred(_propertyId, previousOwner, req.newOwner);
    }

    function freezeProperty(uint _propertyId)
        public
        onlyAdmin
        propertyExists(_propertyId)
    {
        frozen[_propertyId] = true;

        emit PropertyFrozen(_propertyId);
    }

    function unfreezeProperty(uint _propertyId)
        public
        onlyAdmin
        propertyExists(_propertyId)
    {
        frozen[_propertyId] = false;

        emit PropertyUnfrozen(_propertyId);
    }

    function rateProperty(uint _propertyId, uint _rating)
        public
        propertyExists(_propertyId)
    {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(!hasRated[_propertyId][msg.sender], "Already rated");

        propertyRatings[_propertyId] += _rating;
        ratingCount[_propertyId] += 1;

        hasRated[_propertyId][msg.sender] = true;

        emit PropertyRated(_propertyId, _rating);
    }

    function getAverageRating(uint _propertyId)
        public
        view
        propertyExists(_propertyId)
        returns (uint)
    {
        if (ratingCount[_propertyId] == 0) {
            return 0;
        }

        return propertyRatings[_propertyId] / ratingCount[_propertyId];
    }

    function payTax(uint _propertyId)
        public
        payable
        onlyOwner(_propertyId)
        propertyExists(_propertyId)
    {
        require(msg.value > 0, "Tax required");

        lastTaxPaid[_propertyId] = block.timestamp;

        payable(admin).transfer(msg.value);

        emit TaxPaid(_propertyId, msg.value);
    }

    function getProperty(uint _propertyId)
        public
        view
        propertyExists(_propertyId)
        returns (
            uint,
            string memory,
            uint,
            address,
            address[] memory,
            uint,
            bool
        )
    {
        Property memory p = properties[_propertyId];

        return (
            p.propertyId,
            p.location,
            p.area,
            p.currentOwner,
            p.ownershipHistory,
            p.registeredAt,
            p.isVerified
        );
    }
}
