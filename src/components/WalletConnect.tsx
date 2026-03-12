import { Wallet, Check } from 'lucide-react';
import { shortenAddress } from '../utils/formatters';

interface WalletConnectProps {
  isConnected: boolean;
  account: string;
  network: string;
  contractAddress: string;
  onConnect: () => void;
  onUpdateContract: (address: string) => void;
}

export const WalletConnect = ({
  isConnected,
  account,
  network,
  contractAddress,
  onConnect,
  onUpdateContract,
}: WalletConnectProps) => {
  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-wrapper">
          <Wallet className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Connect to Blockchain</h2>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-300">
            Connect your MetaMask wallet to interact with the Land Registry smart contract
          </p>
          <button onClick={onConnect} className="btn-primary w-full">
            <Wallet className="w-5 h-5" />
            Connect MetaMask
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="success-badge">
            <Check className="w-5 h-5" />
            <span>Wallet Connected</span>
          </div>

          <div className="info-box">
            <div className="info-row">
              <span className="info-label">Address:</span>
              <span className="info-value">{shortenAddress(account)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Network:</span>
              <span className="info-value capitalize">{network || 'Unknown'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="input-label">Contract Address</label>
            <input
              type="text"
              placeholder="Enter deployed contract address (0x...)"
              className="input-field"
              defaultValue={contractAddress}
              onBlur={(e) => {
                if (e.target.value && e.target.value !== contractAddress) {
                  onUpdateContract(e.target.value);
                }
              }}
            />
            <p className="text-xs text-gray-400">
              Paste your contract address after deploying via Remix
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
