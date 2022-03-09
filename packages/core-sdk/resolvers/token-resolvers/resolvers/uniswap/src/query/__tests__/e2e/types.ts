import { Interface_TokenComponent } from "../../w3";

export type Token = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type TokenComponent = Interface_TokenComponent;

export type GetTokenResponse = {
  getToken: Token | null;
};
