export const PROTOCOL_ID_V1 = "1inch_v1";
export const PROTOCOL_ID_V2 = "1inch_v2";
export const PROTOCOL_ID_CHI_GAS_TOKEN = "1inch_chi";

export const MOONISWAP_FACTORY_ADDRESS_MAINNET_V2 = "0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643".toLowerCase();
export const MOONISWAP_FACTORY_ADDRESS_KOVAN_V2 = "0x735247fb0a604c0adC6cab38ACE16D0DbA31295F".toLowerCase();
export const MOONISWAP_FACTORY_ADDRESS_MAINNET_V1 = "0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303".toLowerCase();
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000".toLowerCase();
export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase();
export const CHI_GAS_TOKEN_ADDRESS = "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c".toLowerCase();
export const ONESPLIT_CONTRACT_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E".toLowerCase();

export function getFactoryAddress_v2(chainId: u32): string {
  if (chainId == 42) {
    return MOONISWAP_FACTORY_ADDRESS_KOVAN_V2;
  }
  return MOONISWAP_FACTORY_ADDRESS_MAINNET_V2;
}
