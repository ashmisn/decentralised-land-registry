# Land Registry Smart Contract

## Solidity Smart Contract

Deploy this contract via **Remix IDE** on the **Ethereum Sepolia Testnet**.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandRegistry {

    struct Property {
        uint256 id;
        string location;
        uint256 area;
        address currentOwner;
        address[] ownershipHistory;
        uint256 timestamp;
    }

    address public admin;
    uint256 public propertyCount;
    mapping(uint256 => Property) public properties;

    event PropertyRegistered(uint256 indexed propertyId, string location, address owner);
    event OwnershipTransferred(uint256 indexed propertyId, address newOwner);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOwner(uint256 _propertyId) {
        require(msg.sender == properties[_propertyId].currentOwner, "Only property owner can transfer");
        _;
    }

    constructor() {
        admin = msg.sender;
        propertyCount = 0;
    }

    function registerProperty(
        string memory _location,
        uint256 _area,
        address _owner
    ) public onlyAdmin {
        require(_owner != address(0), "Invalid owner address");

        properties[propertyCount] = Property({
            id: propertyCount,
            location: _location,
            area: _area,
            currentOwner: _owner,
            ownershipHistory: new address[](0),
            timestamp: block.timestamp
        });

        properties[propertyCount].ownershipHistory.push(_owner);

        emit PropertyRegistered(propertyCount, _location, _owner);
        propertyCount++;
    }

    function transferOwnership(
        uint256 _propertyId,
        address _newOwner
    ) public onlyOwner(_propertyId) {
        require(_newOwner != address(0), "Invalid new owner address");
        require(_propertyId < propertyCount, "Property does not exist");

        properties[_propertyId].currentOwner = _newOwner;
        properties[_propertyId].ownershipHistory.push(_newOwner);

        emit OwnershipTransferred(_propertyId, _newOwner);
    }

    function getPropertyDetails(uint256 _propertyId)
        public
        view
        returns (
            string memory location,
            uint256 area,
            address currentOwner,
            address[] memory ownershipHistory,
            uint256 timestamp
        )
    {
        require(_propertyId < propertyCount, "Property does not exist");

        Property memory prop = properties[_propertyId];
        return (
            prop.location,
            prop.area,
            prop.currentOwner,
            prop.ownershipHistory,
            prop.timestamp
        );
    }
}
```

## Deployment Steps

### 1. Open Remix IDE
- Go to [https://remix.ethereum.org](https://remix.ethereum.org)

### 2. Create Contract File
- Create a new file: `LandRegistry.sol`
- Paste the above contract code

### 3. Compile Contract
- Click on "Solidity Compiler" tab
- Select compiler version: `0.8.0` or higher
- Click "Compile LandRegistry.sol"

### 4. Deploy to Sepolia
- Click on "Deploy & Run Transactions" tab
- Select Environment: "Injected Provider - MetaMask"
- Make sure MetaMask is connected to **Sepolia Testnet**
- Click "Deploy" button
- Confirm transaction in MetaMask

### 5. Get Contract Address
- After deployment, copy the deployed contract address
- Example: `0x1234567890abcdef1234567890abcdef12345678`

### 6. Configure Frontend
- Paste the contract address into the "Contract Address" field in the frontend
- The application will automatically connect to your deployed contract

## Contract Functions

### Admin Functions
- **registerProperty(location, area, owner)**: Register a new property (Admin only)

### Owner Functions
- **transferOwnership(propertyId, newOwner)**: Transfer property to new owner

### View Functions
- **getPropertyDetails(propertyId)**: Get complete property information
- **admin()**: Get admin address
- **propertyCount()**: Get total number of properties

## Events

### PropertyRegistered
Emitted when a new property is registered.
- **propertyId**: ID of the registered property
- **location**: Property location
- **owner**: Initial owner address

### OwnershipTransferred
Emitted when property ownership is transferred.
- **propertyId**: ID of the property
- **newOwner**: New owner address

## Testing on Sepolia

### Get Test ETH
1. Visit [Sepolia Faucet](https://sepoliafaucet.com)
2. Enter your wallet address
3. Request test ETH

### Verify Transactions
- View all transactions on [Sepolia Etherscan](https://sepolia.etherscan.io)
- Search by transaction hash or contract address
