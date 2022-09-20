export const V2_LENDING_PROTOCOL_ID = "aave_lending_v2";
export const V2_STABLE_DEBT_PROTOCOL_ID = "aave_stable_debt_v2";
export const V2_VARIABLE_DEBT_PROTOCOL_ID = "aave_variable_debt_v2";
export const V2_AMM_LENDING_PROTOCOL_ID = "aave_amm_lending_v2";
export const V2_AMM_STABLE_DEBT_PROTOCOL_ID = "aave_amm_stable_debt_v2";
export const V2_AMM_VARIABLE_DEBT_PROTOCOL_ID = "aave_amm_variable_debt_v2";
export const V1_LENDING_PROTOCOL_ID = "aave_lending_v1";
export const V1_UNISWAP_PROTOCOL_ID = "aave_uniswap_v1";

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
}

export function getProtocolDataProviderAddress_V2Lending(chainId: u32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d".toLowerCase();
    case ChainId.KOVAN:
      return "0x3c73A5E5785cAC854D468F727c606C07488a29D6".toLowerCase();
    case ChainId.MATIC:
      return "0x7551b5D2763519d4e37e8B81929D336De671d46d".toLowerCase();
    case ChainId.MATIC_TESTNET:
      return "0xFA3bD19110d986c5e5E9DD5F69362d05035D045B".toLowerCase();
    case ChainId.AVALANCHE:
      return "0x65285E9dfab318f57051ab2b139ccCf232945451".toLowerCase();
    case ChainId.AVALANCHE_TESTNET:
      return "0x0668EDE013c1c475724523409b8B6bE633469585".toLowerCase();
    default:
      return "0x00";
  }
}

export const V2_AMM_PROTOCOL_DATA_PROVIDER_ADDRESS_MAINNET = "0xc443AD9DDE3cecfB9dfC5736578f447aFE3590ba".toLowerCase();

export function getLendingPoolCoreAddress_V1Lending(chainId: u32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3".toLowerCase();
    case ChainId.KOVAN:
      return "0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45".toLowerCase();
    case ChainId.ROPSTEN:
      return "0x4295Ee704716950A4dE7438086d6f0FBC0BA9472".toLowerCase();
    default:
      return "0x00";
  }
}

export function getLendingPoolCoreAddress_V1Uniswap(chainId: u32): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return "0x1012cfF81A1582ddD0616517eFB97D02c5c17E25".toLowerCase();
    case ChainId.ROPSTEN:
      return "0x07Cdaf84340410ca8dB93bDDf77783C61032B75d".toLowerCase();
    default:
      return "0x00";
  }
}
