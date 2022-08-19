import { BigInt } from "@polywrap/wasm-as";

import { getComptrollerAddress } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Module,
  Args_isValidProtocolToken,
  Env,
} from "../wrap";

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

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as Env).connection;

  if (args.protocolId == "compound_v1") {
    return isValidCompoundPool(args.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
