import { BigInt } from "@polywrap/wasm-as";

import { getComptrollerAddress } from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function isValidCompoundPool(cTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const isListed = Ethereum_Module.callContractView({
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

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == "compound_v1") {
    return isValidCompoundPool(args.tokenAddress, env.connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
