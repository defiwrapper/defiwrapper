import { V2_FACTORY_ADDRESS } from "../constants";
import { Args_isValidProtocolToken, Ethereum_Module } from "../wrap";

function isValidUniswapV2Pool(tokenAddress: string): boolean {
  // token0 address
  const token0AddressResult = Ethereum_Module.callContractView({
    address: tokenAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: null,
  });
  if (token0AddressResult.isErr) {
    return false;
  }
  const token0Address = token0AddressResult.unwrap();
  // token1 address
  const token1AddressResult = Ethereum_Module.callContractView({
    address: tokenAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: null,
  });
  if (token1AddressResult.isErr) {
    return false;
  }
  const token1Address = token1AddressResult.unwrap();
  // pair address
  const pairAddressResult = Ethereum_Module.callContractView({
    address: V2_FACTORY_ADDRESS,
    method: "function getPair(address, address) view returns (address)",
    args: [token0Address, token1Address],
    connection: null,
  });
  if (pairAddressResult.isErr) {
    return false;
  }
  const pairAddress = pairAddressResult.unwrap();
  return tokenAddress.toLowerCase() == pairAddress.toLowerCase();
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (args.protocolId == "uniswap_v2") {
    return isValidUniswapV2Pool(args.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
