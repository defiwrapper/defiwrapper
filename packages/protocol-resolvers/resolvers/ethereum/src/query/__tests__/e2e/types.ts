export type Token = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type Protocol = {
  id: string;
  organization: string;
  name: string;
  version: string;
  forkedFrom: Protocol | null;
};

export type ResolveProtocolResponse = {
  resolveProtocol: Protocol | null;
};

export type SupportedProtocolsResponse = {
  supportedProtocols: Protocol[];
};
