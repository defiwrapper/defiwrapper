export enum TokenType {
  ERC20 = "ERC20",
}

export type Token = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: string;
};

export type GetTokenResponse = {
  getToken: Token;
};
