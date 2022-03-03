import { pairAddress } from "../utils/addressUtils";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidSushiswapPoolV2(tokenAddress: string, connection: Ethereum_Connection): boolean {
  const token0AddressResult = Ethereum_Query.callContractView({
    address: tokenAddress,
    method: "function token0() external view returns (address)",
    args: [],
    connection: connection,
  });
  // if exception encountered, pair contract presumed not to exist
  if (token0AddressResult.isErr) {
    return false;
  }
  const token0Address = token0AddressResult.unwrap();
  const token1AddressResult = Ethereum_Query.callContractView({
    address: tokenAddress,
    method: "function token1() external view returns (address)",
    args: [],
    connection: connection,
  }).unwrap();
  if (token1AddressResult.isErr) {
    throw new Error("Invalid protocol token");
  }
  const token1Address = token0AddressResult.unwrap();
  return tokenAddress == pairAddress(token0Address, token1Address);
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "sushiswap_v1") {
    return isValidSushiswapPoolV2(input.tokenAddress, connection);
  } else if (input.protocolId == "sushibar_v1") {
    return isValidSushiswapPoolV2(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
