import { useState } from 'react';
import { Building2, Shield, AlertCircle } from 'lucide-react';
import { useBlockchain } from './hooks/useBlockchain';
import { WalletConnect } from './components/WalletConnect';
import { RegisterProperty } from './components/RegisterProperty';
import { VerifyProperty } from './components/VerifyProperty';
import { TransferOwnership } from './components/TransferOwnership';
import { PropertyDetails } from './components/PropertyDetails';
import { shortenAddress } from './utils/formatters';

function App() {
  const {
    account,
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
  } = useBlockchain();

  const [contractUpdateError, setContractUpdateError] = useState<string | null>(null);

  const handleUpdateContract = async (address: string) => {
    try {
      setContractUpdateError(null);
      await updateContractAddress(address);
    } catch (error: any) {
      setContractUpdateError(error.message || 'Failed to update contract address');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <nav className="navbar">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="logo-icon">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Decentralized Land Registry
                </h1>
                <p className="text-sm text-gray-400">Blockchain-Powered Property System</p>
              </div>
            </div>

            {isConnected && (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <div className="admin-badge">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </div>
                )}
                <div className="wallet-badge">
                  <div className="wallet-indicator"></div>
                  <span className="font-mono text-sm">{shortenAddress(account)}</span>
                </div>
                <div className="network-badge">
                  <span className="capitalize">{network || 'Unknown'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="container-custom py-8">
        {contractUpdateError && (
          <div className="error-banner mb-6">
            <AlertCircle className="w-5 h-5" />
            <p>{contractUpdateError}</p>
          </div>
        )}

        <div className="grid-layout">
          <WalletConnect
            isConnected={isConnected}
            account={account}
            network={network}
            contractAddress={contractAddress}
            onConnect={connectWallet}
            onUpdateContract={handleUpdateContract}
          />

          {isConnected && contractAddress && (
            <>
              <RegisterProperty isAdmin={isAdmin} onRegister={registerProperty} />
              <VerifyProperty isAdmin={isAdmin} onVerify={verifyProperty} />
              <TransferOwnership
                isAdmin={isAdmin}
                onRequestTransfer={requestTransfer}
                onApproveTransfer={approveTransfer}
                onGetDetails={getPropertyDetails}
                onGetTransferRequest={getTransferRequest}
              />
              <PropertyDetails
                isAdmin={isAdmin}
                currentUser={account}
                onGetDetails={getPropertyDetails}
                onFreeze={freezeProperty}
                onUnfreeze={unfreezeProperty}
                onRate={rateProperty}
                onGetAvgRating={getAverageRating}
                onPayTax={payTax}
                onIsFrozen={isPropertyFrozen}
                onHasUserRated={hasUserRated}
                onGetLastTaxPaid={getLastTaxPaid}
              />
            </>
          )}
        </div>

        {!contractAddress && isConnected && (
          <div className="info-banner mt-6">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Contract Address Required</p>
              <p className="text-sm text-gray-300 mt-1">
                Please enter your deployed contract address above to interact with the blockchain
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container-custom">
          <p className="text-gray-400 text-sm text-center">
            Ethereum Sepolia Testnet | Secured by Blockchain Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
