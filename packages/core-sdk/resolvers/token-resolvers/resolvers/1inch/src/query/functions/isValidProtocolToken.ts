import { getFactoryAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidMooniswapPool(tokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: i32 = getChainId(connection);
  const isPoolRes = Ethereum_Query.callContractView({
    address: getFactoryAddress(chainId),
    method: "function isPool(address) view returns (bool)",
    args: [tokenAddress],
    connection: connection,
  });
  if (isPoolRes.isErr) {
    return false;
  }
  return isPoolRes.unwrap() == "true";
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "1inch_v1") {
    return isValidMooniswapPool(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
