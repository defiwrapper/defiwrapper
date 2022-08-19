import { BigInt } from "@polywrap/wasm-as";

import { getCreamComptrollerAddress, IRON_BANK_COMPTROLLER_ADDRESS } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Module,
  Args_isValidProtocolToken,
  Env,
} from "../wrap";

function isValidCreamPool(
  token: string,
  comptroller: string,
  connection: Ethereum_Connection,
): boolean {
  const isListed = Ethereum_Module.callContractView({
    address: comptroller,
    method: "function markets(address) view returns (bool)",
    args: [token],
    connection: connection,
  });
  if (isListed.isErr) return false;
  return isListed.unwrap() == "true";
}

function isValidCreamPoolV1(token: string, connection: Ethereum_Connection): boolean {
  const chainId: BigInt | null = getChainId(connection);
  if (!chainId) {
    return false;
  }
  const comptroller: string = getCreamComptrollerAddress(chainId.toUInt32());
  return isValidCreamPool(token, comptroller, connection);
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as Env).connection;

  if (args.protocolId == "cream_v1") {
    return isValidCreamPoolV1(args.tokenAddress, connection);
  } else if (args.protocolId == "cream_v2") {
    return isValidCreamPool(args.tokenAddress, IRON_BANK_COMPTROLLER_ADDRESS, connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
