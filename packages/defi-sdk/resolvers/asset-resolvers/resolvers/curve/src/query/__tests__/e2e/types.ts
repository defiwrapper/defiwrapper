import { Interface_TokenComponent } from "../../wrap";

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

export type TokenComponent = Interface_TokenComponent;

export type GetTokenComponentsResponse = {
  // FIXME: use dapp codegen once we add support for it
  getTokenComponents: Interface_TokenComponent | null;
};

export type GetTokenResponse = {
  getToken: Token | null;
};
