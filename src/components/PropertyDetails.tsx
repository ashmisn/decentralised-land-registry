import { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Maximize, User, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { shortenAddress, formatTimestamp, getEtherscanUrl } from '../utils/formatters';
import { Property } from '../types/land-registry';

interface PropertyDetailsProps {
  isAdmin: boolean;
  onGetDetails: (propertyId: number) => Promise<Property>;
  onFreeze: (propertyId: number) => Promise<string>;
  onUnfreeze: (propertyId: number) => Promise<string>;
  onRate: (propertyId: number, rating: number) => Promise<string>;
  onGetAvgRating: (propertyId: number) => Promise<number>;
  onPayTax: (propertyId: number, amount: string) => Promise<string>;
  onIsFrozen: (propertyId: number) => Promise<boolean>;
  onHasUserRated: (propertyId: number, user: string) => Promise<boolean>;
  onGetLastTaxPaid: (propertyId: number) => Promise<string>;
  currentUser: string;
}

export const PropertyDetails = ({
  isAdmin,
  onGetDetails,
  onFreeze,
  onUnfreeze,
  onRate,
  onGetAvgRating,
  onPayTax,
  onIsFrozen,
  onHasUserRated,
  onGetLastTaxPaid,
  currentUser,
}: PropertyDetailsProps) => {
  const [propertyId, setPropertyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [userRating, setUserRating] = useState<number>(1);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [frozen, setFrozen] = useState<boolean | null>(null);
  const [taxAmount, setTaxAmount] = useState('');
  const [lastTax, setLastTax] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProperty(null);

    try {
      const details = await onGetDetails(Number(propertyId));
      setProperty(details);
    } catch (err: any) {
      setError(err.message || 'Property not found');
    } finally {
      setLoading(false);
    }
  };

  const refreshMeta = async (id: number) => {
    setLoadingData(true);
    try {
      const [avg, isFrozen, last] = await Promise.all([
        onGetAvgRating(id),
        onIsFrozen(id),
        onGetLastTaxPaid(id),
      ]);
      setAvgRating(avg);
      setFrozen(isFrozen);
      setLastTax(last.toString());
      if (currentUser) {
        const rated = await onHasUserRated(id, currentUser);
        setHasRated(rated);
      }
    } catch (err) {
      console.error('meta refresh error', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFreeze = async () => {
    if (!property) return;
    await onFreeze(Number(property.propertyId));
    refreshMeta(Number(property.propertyId));
  };

  const handleUnfreeze = async () => {
    if (!property) return;
    await onUnfreeze(Number(property.propertyId));
    refreshMeta(Number(property.propertyId));
  };

  const handleRate = async () => {
    if (!property) return;
    await onRate(Number(property.propertyId), userRating);
    setHasRated(true);
    refreshMeta(Number(property.propertyId));
  };

  const handlePayTax = async () => {
    if (!property || !taxAmount) return;
    await onPayTax(Number(property.propertyId), taxAmount);
    setTaxAmount('');
    refreshMeta(Number(property.propertyId));
  };

  useEffect(() => {
    if (property) {
      refreshMeta(Number(property.propertyId));
    }
  }, [property]);

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-wrapper">
          <Search className="w-6 h-6 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">View Property Details</h2>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <div>
          <label className="input-label">Property ID</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              placeholder="Enter property ID"
              className="input-field flex-1"
              required
              disabled={loading}
              min="0"
            />
            <button type="submit" className="btn-accent" disabled={loading}>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-banner">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {property && (
        <div className="space-y-6 animate-fadeIn">
          <div className="property-card">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
                <p className="text-gray-300">{property.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <Maximize className="w-5 h-5 text-green-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Area</h3>
                <p className="text-gray-300">{property.area} sq.ft</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <User className="w-5 h-5 text-purple-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Current Owner</h3>
                <a
                  href={getEtherscanUrl(property.currentOwner, 'address')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                >
                  {property.currentOwner}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <Clock className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Registered</h3>
                <p className="text-gray-300">{formatTimestamp(property.registeredAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Verification Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  property.isVerified
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {property.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>

            {/* frozen status and admin controls */}
            <div className="flex items-start gap-3 mt-4">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Frozen Status</h3>
                <p className="text-gray-300">
                  {frozen === null ? '…' : frozen ? 'Frozen' : 'Not frozen'}
                </p>
                {isAdmin && frozen !== null && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="btn-accent"
                      onClick={handleFreeze}
                      disabled={frozen}
                    >
                      Freeze
                    </button>
                    <button
                      className="btn-accent"
                      onClick={handleUnfreeze}
                      disabled={!frozen}
                    >
                      Unfreeze
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-blue-400" />
              Ownership History
            </h3>
            <div className="ownership-timeline">
              {property.ownershipHistory.map((owner, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                    {index < property.ownershipHistory.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-label">Owner {index + 1}</span>
                    <a
                      href={getEtherscanUrl(owner, 'address')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-address"
                    >
                      {shortenAddress(owner)}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* tax payment & rating sections */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Pay Tax</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={taxAmount}
                  onChange={(e) => setTaxAmount(e.target.value)}
                  placeholder="Amount in ETH"
                  className="input-field"
                  disabled={loadingData}
                />
                <button
                  className="btn-accent"
                  onClick={handlePayTax}
                  disabled={loadingData || !taxAmount}
                >
                  Pay
                </button>
              </div>
              {lastTax && <p className="text-gray-300 mt-1">Last paid: {lastTax}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Rate Property</h3>
              <div className="flex gap-2 items-center">
                <select
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  className="input-field w-20"
                  disabled={hasRated || loadingData}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <button
                  className="btn-accent"
                  onClick={handleRate}
                  disabled={hasRated || loadingData}
                >
                  Submit
                </button>
              </div>
              {avgRating !== null && (
                <p className="text-gray-300 mt-1">Average rating: {avgRating}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
