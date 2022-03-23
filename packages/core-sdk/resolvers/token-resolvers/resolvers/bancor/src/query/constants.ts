export const CONTRACT_REGISTRY_ADDRESS_MAINNET = "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4";
export const CONTRACT_REGISTRY_ADDRESS_ROPSTEN = "0xA6DB4B0963C37Bc959CbC0a874B5bDDf2250f26F";
export const CONVERTER_REGISTRY_ID =
  "0x42616e636f72436f6e7665727465725265676973747279000000000000000000";
export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export function getContractRegistry(chainId: i32): string {
  switch (chainId) {
    case 1:
      return CONTRACT_REGISTRY_ADDRESS_MAINNET;
    case 3:
      return CONTRACT_REGISTRY_ADDRESS_ROPSTEN;
    default:
      return "0x00";
  }
}
