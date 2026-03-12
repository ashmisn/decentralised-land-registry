import { useState } from 'react';
import { Home, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getEtherscanUrl } from '../utils/formatters';

interface RegisterPropertyProps {
  isAdmin: boolean;
  onRegister: (location: string, area: number, owner: string) => Promise<string>;
}

export const RegisterProperty = ({ isAdmin, onRegister }: RegisterPropertyProps) => {
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [owner, setOwner] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const hash = await onRegister(location, Number(area), owner);
      setTxHash(hash);
      setLocation('');
      setArea('');
      setOwner('');
    } catch (err: any) {
      setError(err.message || 'Failed to register property');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-wrapper">
            <Home className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Register Property</h2>
        </div>
        <div className="warning-badge">
          <AlertCircle className="w-5 h-5" />
          <span>Admin access required</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-wrapper">
          <Home className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Register Property</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="input-label">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 123 Main Street, City, State"
            className="input-field"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="input-label">Area (sq.ft)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., 2500"
            className="input-field"
            required
            disabled={loading}
            min="1"
          />
        </div>

        <div>
          <label className="input-label">Owner Address</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="0x..."
            className="input-field"
            required
            disabled={loading}
            pattern="^0x[a-fA-F0-9]{40}$"
            title="Please enter a valid Ethereum address"
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Home className="w-5 h-5" />
              Register Property
            </>
          )}
        </button>
      </form>

      {txHash && (
        <div className="success-banner mt-4">
          <CheckCircle className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold">Property Registered Successfully!</p>
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
