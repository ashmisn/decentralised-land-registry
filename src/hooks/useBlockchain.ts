import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, SEPOLIA_CHAIN_ID } from '../constants/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useBlockchain = () => {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this application');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const networkInfo = await browserProvider.getNetwork();

      setAccount(accounts[0]);
      setProvider(browserProvider);
      setIsConnected(true);
      setNetwork(networkInfo.name);

      if (CONTRACT_CONFIG.address) {
        const landContract = new ethers.Contract(
          CONTRACT_CONFIG.address,
          CONTRACT_CONFIG.abi,
          signer
        );
        setContract(landContract);
        setContractAddress(CONTRACT_CONFIG.address);

        const adminAddress = await landContract.admin();
        setIsAdmin(adminAddress.toLowerCase() === accounts[0].toLowerCase());
      }

      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        setAccount(newAccounts[0] || '');
        if (newAccounts.length === 0) {
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const updateContractAddress = async (address: string) => {
    try {
      if (!provider || !account) {
        throw new Error('Wallet not connected');
      }

      CONTRACT_CONFIG.address = address;
      const signer = await provider.getSigner();
      const landContract = new ethers.Contract(
        address,
        CONTRACT_CONFIG.abi,
        signer
      );

      setContract(landContract);
      setContractAddress(address);

      const adminAddress = await landContract.admin();
      setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
    } catch (error) {
      console.error('Error updating contract address:', error);
      throw error;
    }
  };

  const registerProperty = async (location: string, area: number, owner: string) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.registerProperty(location, area, owner);
    await tx.wait();
    return tx.hash;
  };

  const verifyProperty = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.verifyProperty(propertyId);
    await tx.wait();
    return tx.hash;
  };

  const requestTransfer = async (propertyId: number, newOwner: string) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.requestTransfer(propertyId, newOwner);
    await tx.wait();
    return tx.hash;
  };

  const approveTransfer = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.approveTransfer(propertyId);
    await tx.wait();
    return tx.hash;
  };

  const freezeProperty = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.freezeProperty(propertyId);
    await tx.wait();
    return tx.hash;
  };

  const unfreezeProperty = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.unfreezeProperty(propertyId);
    await tx.wait();
    return tx.hash;
  };

  const rateProperty = async (propertyId: number, rating: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.rateProperty(propertyId, rating);
    await tx.wait();
    return tx.hash;
  };

  const getAverageRating = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.getAverageRating(propertyId);
  };

  const payTax = async (propertyId: number, amount: string) => {
    if (!contract) throw new Error('Contract not initialized');

    const tx = await contract.payTax(propertyId, { value: ethers.parseEther(amount) });
    await tx.wait();
    return tx.hash;
  };

  const getPropertyDetails = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const details = await contract.getProperty(propertyId);

    return {
      propertyId: details[0].toString(),
      location: details[1],
      area: details[2].toString(),
      currentOwner: details[3],
      ownershipHistory: details[4],
      registeredAt: details[5].toString(),
      isVerified: details[6],
    };
  };

  const getTransferRequest = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    const request = await contract.transferRequests(propertyId);
    return {
      newOwner: request[0],
      approved: request[1],
      exists: request[2],
    };
  };

  const isPropertyFrozen = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.frozen(propertyId);
  };

  const hasUserRated = async (propertyId: number, user: string) => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.hasRated(propertyId, user);
  };

  const getLastTaxPaid = async (propertyId: number) => {
    if (!contract) throw new Error('Contract not initialized');

    return await contract.lastTaxPaid(propertyId);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        if (newAccounts.length > 0) {
          setAccount(newAccounts[0]);
        } else {
          setAccount('');
          setIsConnected(false);
        }
      });
    }
  }, []);

  return {
    account,
    contract,
    provider,
    isAdmin,
    isConnected,
    network,
    contractAddress,
    connectWallet,
    updateContractAddress,
    registerProperty,
    verifyProperty,
    requestTransfer,
    approveTransfer,
    freezeProperty,
    unfreezeProperty,
    rateProperty,
    getAverageRating,
    payTax,
    getPropertyDetails,
    getTransferRequest,
    isPropertyFrozen,
    hasUserRated,
    getLastTaxPaid,
  };
};
// import { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import { CONTRACT_CONFIG, SEPOLIA_CHAIN_ID } from '../constants/contract';

// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// export const useBlockchain = () => {
//   const [account, setAccount] = useState<string>('');
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [network, setNetwork] = useState<string>('');
//   const [contractAddress, setContractAddress] = useState<string>('');

//   const connectWallet = async () => {
//     try {
//       if (!window.ethereum) {
//         alert('Please install MetaMask to use this application');
//         return;
//       }

//       const accounts = await window.ethereum.request({
//         method: 'eth_requestAccounts',
//       });

//       const browserProvider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await browserProvider.getSigner();
//       const networkInfo = await browserProvider.getNetwork();

//       setAccount(accounts[0]);
//       setProvider(browserProvider);
//       setIsConnected(true);
//       setNetwork(networkInfo.name);

//       if (CONTRACT_CONFIG.address) {
//         const landContract = new ethers.Contract(
//           CONTRACT_CONFIG.address,
//           CONTRACT_CONFIG.abi,
//           signer
//         );
//         setContract(landContract);
//         setContractAddress(CONTRACT_CONFIG.address);

//         const adminAddress = await landContract.admin();
//         setIsAdmin(adminAddress.toLowerCase() === accounts[0].toLowerCase());
//       }

//       window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
//         setAccount(newAccounts[0] || '');
//         if (newAccounts.length === 0) {
//           setIsConnected(false);
//         }
//       });

//       window.ethereum.on('chainChanged', () => {
//         window.location.reload();
//       });

//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//       alert('Failed to connect wallet');
//     }
//   };

//   const updateContractAddress = async (address: string) => {
//     try {
//       if (!provider || !account) {
//         throw new Error('Wallet not connected');
//       }

//       CONTRACT_CONFIG.address = address;
//       const signer = await provider.getSigner();
//       const landContract = new ethers.Contract(
//         address,
//         CONTRACT_CONFIG.abi,
//         signer
//       );

//       setContract(landContract);
//       setContractAddress(address);

//       const adminAddress = await landContract.admin();
//       setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
//     } catch (error) {
//       console.error('Error updating contract address:', error);
//       throw error;
//     }
//   };

//   const registerProperty = async (location: string, area: number, owner: string) => {
//     if (!contract) throw new Error('Contract not initialized');

//     const tx = await contract.registerProperty(location, area, owner);
//     await tx.wait();
//     return tx.hash;
//   };

//   const transferOwnership = async (propertyId: number, newOwner: string) => {
//     if (!contract) throw new Error('Contract not initialized');

//     const tx = await contract.transferOwnership(propertyId, newOwner);
//     await tx.wait();
//     return tx.hash;
//   };

//   const getPropertyDetails = async (propertyId: number) => {
//     if (!contract) throw new Error('Contract not initialized');

//     const details = await contract.getPropertyDetails(propertyId);
//     return {
//       location: details[0],
//       area: details[1].toString(),
//       currentOwner: details[2],
//       ownershipHistory: details[3],
//       timestamp: details[4].toString(),
//     };
//   };

//   useEffect(() => {
//     if (window.ethereum) {
//       window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
//         if (newAccounts.length > 0) {
//           setAccount(newAccounts[0]);
//         } else {
//           setAccount('');
//           setIsConnected(false);
//         }
//       });
//     }
//   }, []);

//   return {
//     account,
//     contract,
//     provider,
//     isAdmin,
//     isConnected,
//     network,
//     contractAddress,
//     connectWallet,
//     updateContractAddress,
//     registerProperty,
//     transferOwnership,
//     getPropertyDetails,
//   };
// };
