export type Token = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type IsValidProtocolTokenResponse = {
  isValidProtocolToken: boolean;
};
