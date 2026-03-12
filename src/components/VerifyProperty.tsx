import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { getEtherscanUrl } from '../utils/formatters';

interface VerifyPropertyProps {
  isAdmin: boolean;
  onVerify: (propertyId: number) => Promise<string>;
}

export const VerifyProperty = ({ isAdmin, onVerify }: VerifyPropertyProps) => {
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await onVerify(Number(propertyId));
      setTxHash(hash);
      setPropertyId('');
    } catch (err: any) {
      setError(err.message || 'Failed to verify property');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-card">
        <div className="warning-badge">
          <AlertCircle className="w-5 h-5" />
          <span>Admin access required to verify properties</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-wrapper">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Verify Property</h2>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
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
            min="1"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Verify Property
            </>
          )}
        </button>
      </form>

      {txHash && (
        <div className="success-banner mt-4">
          <CheckCircle className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold">Property Verified!</p>
            <a
              href={getEtherscanUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-300 hover:text-blue-200 underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner mt-4">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};