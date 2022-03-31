import { BigInt } from "@web3api/wasm-as";

import { getContractRegistry, PROTOCOL_ID_1, PROTOCOL_ID_2 } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidPoolV2(protocolTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const isValid = Ethereum_Query.callContractView({
    address: getContractRegistry(chainId.toUInt32()),
    method: "function replaceWithRealAbi(address token) public view returns (bool)",
    args: [protocolTokenAddress],
    connection: connection,
  });
  if (isValid.isErr) {
    return false;
  }
  return isValid.unwrap() == "true";
}

function isValidPoolV1(protocolTokenAddress: string, connection: Ethereum_Connection): boolean {
  return isValidPoolV2(protocolTokenAddress, connection);
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == PROTOCOL_ID_2) {
    return isValidPoolV2(input.tokenAddress, connection);
  } else if (input.protocolId == PROTOCOL_ID_1) {
    return isValidPoolV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
