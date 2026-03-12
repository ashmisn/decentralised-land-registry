import { useState } from 'react';
import { ArrowRightLeft, Loader2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { getEtherscanUrl, shortenAddress } from '../utils/formatters';

interface TransferOwnershipProps {
  isAdmin: boolean;
  onRequestTransfer: (propertyId: number, newOwner: string) => Promise<string>;
  onApproveTransfer: (propertyId: number) => Promise<string>;
  onGetDetails: (propertyId: number) => Promise<any>;
  onGetTransferRequest: (propertyId: number) => Promise<any>;
}

export const TransferOwnership = ({
  isAdmin,
  onRequestTransfer,
  onApproveTransfer,
  onGetDetails,
  onGetTransferRequest
}: TransferOwnershipProps) => {
  const [propertyId, setPropertyId] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentOwner, setCurrentOwner] = useState<string | null>(null);
  const [transferRequest, setTransferRequest] = useState<any>(null);

  const handleRequestTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const details = await onGetDetails(Number(propertyId));
      setCurrentOwner(details.currentOwner);

      const hash = await onRequestTransfer(Number(propertyId), newOwner);
      setTxHash(hash);
      setPropertyId('');
      setNewOwner('');
    } catch (err: any) {
      setError(err.message || 'Failed to request transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const request = await onGetTransferRequest(Number(propertyId));
      setTransferRequest(request);

      const hash = await onApproveTransfer(Number(propertyId));
      setTxHash(hash);
      setPropertyId('');
    } catch (err: any) {
      setError(err.message || 'Failed to approve transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-wrapper">
          <ArrowRightLeft className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Transfer Ownership</h2>
      </div>

      {!isAdmin ? (
        // Request Transfer Form
        <>
          <p className="text-gray-300 mb-4">Request ownership transfer for your property</p>
          <form onSubmit={handleRequestTransfer} className="space-y-4">
            <div>
              <label className="input-label">Property ID</label>
              <input
                type="number"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID"
                className="input-field"
                required
                disabled={loading}
                min="0"
              />
            </div>

            <div>
              <label className="input-label">New Owner Address</label>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="0x..."
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowRightLeft className="w-5 h-5" />
                  Request Transfer
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        // Approve Transfer Form
        <>
          <p className="text-gray-300 mb-4">Approve pending ownership transfer requests</p>
          <form onSubmit={handleApproveTransfer} className="space-y-4">
            <div>
              <label className="input-label">Property ID</label>
              <input
                type="number"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID"
                className="input-field"
                required
                disabled={loading}
                min="0"
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  Approve Transfer
                </>
              )}
            </button>
          </form>
        </>
      )}

      {error && (
        <div className="error-banner">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {txHash && (
        <div className="success-banner">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Transaction Successful!</p>
            <a
              href={getEtherscanUrl(txHash, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-mono text-sm"
            >
              {shortenAddress(txHash)}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
