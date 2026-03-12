export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const getEtherscanUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  return `https://sepolia.etherscan.io/${type}/${hash}`;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
