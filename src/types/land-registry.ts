export interface Property {
  propertyId: string;
  location: string;
  area: string;
  currentOwner: string;
  ownershipHistory: string[];
  registeredAt: string;
  isVerified: boolean;
}

export interface TransferRequest {
  newOwner: string;
  approved: boolean;
  exists: boolean;
}

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface TransactionStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  hash: string | null;
}
