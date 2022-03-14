import { getCoreFactoryV1, getSmartFactoryV1, getVaultAddressV2 } from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidBalancerV2Pool(lpTokenAddress: string, connection: Ethereum_Connection): boolean {
  const poolIdRes = Ethereum_Query.callContractView({
    address: lpTokenAddress,
    method: "function getPoolId() public view returns (bytes32)",
    args: [],
    connection: connection,
  });
  if (poolIdRes.isErr) {
    return false;
  }
  const poolId: string = poolIdRes.unwrap();
  // get vault address
  const chainId: i32 = getChainId(connection);
  const vaultAddress: string = getVaultAddressV2(chainId);
  // confirm pool is registered
  const poolRes = Ethereum_Query.callContractView({
    address: vaultAddress,
    method: "function getPool(bytes32 poolId) external view returns (tuple(address, uint))",
    args: [poolId],
    connection: connection,
  });
  if (poolRes.isErr) {
    return false;
  }
  const registeredPoolAddress: string = poolRes.unwrap().split(",")[0];
  return lpTokenAddress.toLowerCase() == registeredPoolAddress.toLowerCase();
}

function isValidBalancerV1Pool(lpTokenAddress: string, connection: Ethereum_Connection): boolean {
  // check if smart pool
  const isSmartPoolRes = Ethereum_Query.callContractView({
    address: lpTokenAddress,
    method: "function NAME() view returns (string)",
    args: [],
    connection: connection,
  });
  const isSmart: boolean = isSmartPoolRes.isOk && isSmartPoolRes.unwrap() == "Balancer Smart Pool";
  // check if pool is registered
  const chainId: i32 = getChainId(connection);
  const isPoolRes = Ethereum_Query.callContractView({
    address: isSmart ? getSmartFactoryV1(chainId) : getCoreFactoryV1(chainId),
    method: isSmart
      ? "function isCrp(address addr) external view returns (bool)"
      : "function isBPool(address b) external view returns (bool)",
    args: [lpTokenAddress],
    connection: connection,
  });
  return isPoolRes.isOk && isPoolRes.unwrap() == "true";
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "balancer_v2") {
    return isValidBalancerV2Pool(input.tokenAddress, connection);
  } else if (input.protocolId == "balancer_v1") {
    return isValidBalancerV1Pool(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
