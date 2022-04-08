import { BigInt } from "@web3api/wasm-as";

import { getComptrollerAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidCompoundPool(cTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const isListed = Ethereum_Query.callContractView({
    address: getComptrollerAddress(chainId.toUInt32()),
    method: "function markets(address) view returns (bool)",
    args: [cTokenAddress],
    connection: connection,
  });
  if (isListed.isErr) {
    return false;
  }
  return isListed.unwrap() == "true";
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "compound_v1") {
    return isValidCompoundPool(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
