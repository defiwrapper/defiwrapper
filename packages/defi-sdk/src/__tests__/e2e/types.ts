export enum TokenProtocolType {
  Native,
  YearnV1,
  YearnV2,
  CurveGauge,
  Curve,
  AaveV1,
  AaveV2,
  AaveAMM,
  UniswapV2,
  UniswapV3,
  Sushiswap,
  Linkswap,
  Compound,
  Sushibar,
  Cream,
}

export type TokenComponent = {
  token: Token;
  rate: string;
  type: TokenProtocolType;
};

export type Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: BigInt;
};

export type TokenComponentsList = {
  token: Token;
  type: TokenProtocolType;
  underlyingTokenComponents: TokenComponent[];
};

export type GetComponentsResponse = {
  getComponents: TokenComponentsList;
};
