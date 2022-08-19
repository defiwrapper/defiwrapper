import { BigInt } from "@polywrap/wasm-as";

import { getFactoryAddress, XSUSHI_ADDRESS } from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function isValidSushiswapPool(tokenAddress: string, connection: Ethereum_Connection): boolean {
  // token0 address
  const token0AddressResult = Ethereum_Module.callContractView({
    address: tokenAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
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
    connection: connection,
  });
  if (token1AddressResult.isErr) {
    return false;
  }
  const token1Address = token1AddressResult.unwrap();
  // pair address
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const factoryAddress: string = getFactoryAddress(chainId.toUInt64());
  const pairAddressResult = Ethereum_Module.callContractView({
    address: factoryAddress,
    method: "function getPair(address, address) view returns (address)",
    args: [token0Address, token1Address],
    connection: connection,
  });
  if (pairAddressResult.isErr) {
    return false;
  }
  const pairAddress = pairAddressResult.unwrap();
  return tokenAddress.toLowerCase() == pairAddress.toLowerCase();
}

function isValidSushibarToken(tokenAddress: string): boolean {
  return tokenAddress.toLowerCase() == XSUSHI_ADDRESS.toLowerCase();
}

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == "sushiswap_v1") {
    return isValidSushiswapPool(args.tokenAddress, env.connection);
  } else if (args.protocolId == "sushibar_v1") {
    return isValidSushibarToken(args.tokenAddress);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
