import { Interface_AssetBalance } from "../../w3";

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

export type GetTokenComponentsResponse = {
  // FIXME: use dapp codegen once we add support for it
  getTokenComponents: Interface_AssetBalance | null;
};

export type GetTokenResponse = {
  getToken: Token | null;
};
