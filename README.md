# Decentralized Land Registry System

A blockchain-based land registry system built with **Ethereum Smart Contracts**, **React**, and **ethers.js**. This application provides tamper-proof property records, secure ownership transfers, and transparent transaction history.

## Features

- **Blockchain-Powered**: All data stored immutably on Ethereum Sepolia testnet
- **Wallet Authentication**: Connect via MetaMask for secure transactions
- **Admin Controls**: Role-based access for property registration
- **Property Registration**: Register new properties with location, area, and owner
- **Ownership Transfer**: Transfer property ownership securely on-chain
- **Property Details**: View complete property information and ownership history
- **Transaction Tracking**: All transactions viewable on Etherscan
- **Modern UI**: Dark theme with glassmorphism design

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solidity, Ethereum Sepolia Testnet
- **Web3**: ethers.js, MetaMask
- **Deployment Tool**: Remix IDE

## Prerequisites

Before you begin, ensure you have:

1. **MetaMask Wallet** installed in your browser
   - Download: [https://metamask.io](https://metamask.io)

2. **Sepolia Test ETH**
   - Get free test ETH from: [https://sepoliafaucet.com](https://sepoliafaucet.com)

3. **Node.js** (v18 or higher)
   - Download: [https://nodejs.org](https://nodejs.org)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org)
2. Create a new file: `LandRegistry.sol`
3. Copy the contract code from `CONTRACT.md`
4. Compile the contract
5. Deploy to Sepolia testnet via MetaMask
6. Copy the deployed contract address

For detailed deployment instructions, see `CONTRACT.md`.

### 3. Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 4. Connect to Blockchain

1. Click "Connect MetaMask" button
2. Approve the connection in MetaMask
3. Paste your deployed contract address
4. Start interacting with the blockchain!

## Usage Guide

### For Admins

**Register Property**
1. Navigate to "Register Property" card
2. Enter property location (e.g., "123 Main St, City, State")
3. Enter area in square feet
4. Enter owner's wallet address
5. Click "Register Property"
6. Confirm transaction in MetaMask
7. View transaction on Etherscan

### For Property Owners

**Transfer Ownership**
1. Navigate to "Transfer Ownership" card
2. Enter your Property ID
3. Enter new owner's wallet address
4. Click "Transfer Ownership"
5. Confirm transaction in MetaMask
6. View updated ownership on Etherscan

### View Property Details

1. Navigate to "View Property Details" card
2. Enter Property ID
3. Click search button
4. View complete property information including:
   - Location
   - Area
   - Current owner
   - Ownership history timeline
   - Registration timestamp

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── WalletConnect.tsx
│   │   ├── RegisterProperty.tsx
│   │   ├── TransferOwnership.tsx
│   │   └── PropertyDetails.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useBlockchain.ts
│   ├── types/               # TypeScript types
│   │   └── land-registry.ts
│   ├── utils/               # Utility functions
│   │   └── formatters.ts
│   ├── constants/           # Contract ABI and config
│   │   └── contract.ts
│   ├── App.tsx              # Main application
│   └── index.css            # Global styles
├── CONTRACT.md              # Smart contract code
└── README.md                # This file
```

## Smart Contract Functions

### Admin Functions
- `registerProperty(location, area, owner)` - Register new property

### Owner Functions
- `transferOwnership(propertyId, newOwner)` - Transfer ownership

### View Functions
- `getPropertyDetails(propertyId)` - Get property details
- `admin()` - Get admin address
- `propertyCount()` - Get total properties

## Demo Workflow

Perfect for presentations and demonstrations:

1. **Connect Wallet**
   - Show MetaMask connection
   - Display connected address and network

2. **Register Property**
   - Demonstrate admin-only access
   - Register a sample property
   - Show transaction hash

3. **View on Etherscan**
   - Open transaction on Sepolia Etherscan
   - Show on-chain verification

4. **Transfer Ownership**
   - Transfer to another address
   - Show ownership history update

5. **View Details**
   - Display complete property information
   - Show ownership timeline visualization

## Security Features

- **Role-Based Access**: Only admin can register properties
- **Ownership Verification**: Only current owner can transfer
- **Immutable Records**: All data permanently stored on blockchain
- **Event Logging**: All actions emit events for transparency
- **Wallet Authentication**: No passwords, wallet-based security

## Network Configuration

**Sepolia Testnet**
- Chain ID: 11155111 (0xaa36a7)
- RPC URL: Auto-configured via MetaMask
- Explorer: https://sepolia.etherscan.io

## Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask extension is installed
- Refresh the page
- Check browser console for errors

### Transaction Failed
- Ensure you have sufficient Sepolia ETH
- Check gas price settings
- Verify contract address is correct

### Property Not Found
- Verify Property ID exists
- Check if property was registered successfully
- Ensure contract address is correct

### Admin Access Denied
- Only the contract deployer is admin
- Connect with the wallet that deployed the contract

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

This is an educational project demonstrating blockchain integration. Feel free to:
- Fork the repository
- Add new features
- Improve the UI/UX
- Enhance security

## License

MIT License - Free to use for educational purposes

## Resources

- [Ethereum Documentation](https://ethereum.org/developers)
- [ethers.js Documentation](https://docs.ethers.org)
- [Solidity Documentation](https://docs.soliditylang.org)
- [MetaMask Documentation](https://docs.metamask.io)
- [Remix IDE](https://remix.ethereum.org)

## Support

For questions or issues:
- Check the troubleshooting section
- Review the contract code in `CONTRACT.md`
- Verify MetaMask and Sepolia configuration

---

Built with React, Ethereum, and Web3 Technologies
