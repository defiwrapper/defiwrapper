import { LINKSWAP_FACTORY_ADDRESS } from "../constants";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function isValidLinkswapPool(tokenAddress: string, connection: Ethereum_Connection): boolean {
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
  const pairAddressResult = Ethereum_Module.callContractView({
    address: LINKSWAP_FACTORY_ADDRESS,
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

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == "linkswap_v1") {
    return isValidLinkswapPool(args.tokenAddress, env.connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
