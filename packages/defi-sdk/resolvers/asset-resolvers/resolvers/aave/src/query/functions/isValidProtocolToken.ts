import {
  getLendingPoolCoreAddress_V1Lending,
  getLendingPoolCoreAddress_V1Uniswap,
  getProtocolDataProviderAddress_V2Lending,
  V1_LENDING_PROTOCOL_ID,
  V1_UNISWAP_PROTOCOL_ID,
  V2_AMM_LENDING_PROTOCOL_ID,
  V2_AMM_PROTOCOL_DATA_PROVIDER_ADDRESS_MAINNET,
  V2_AMM_STABLE_DEBT_PROTOCOL_ID,
  V2_AMM_VARIABLE_DEBT_PROTOCOL_ID,
  V2_LENDING_PROTOCOL_ID,
  V2_STABLE_DEBT_PROTOCOL_ID,
  V2_VARIABLE_DEBT_PROTOCOL_ID,
} from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Module,
  Args_isValidProtocolToken,
  Env,
} from "../wrap";

function getDataProviderAddress(protocolId: string, connection: Ethereum_Connection): string {
  if (
    protocolId == V2_LENDING_PROTOCOL_ID ||
    protocolId == V2_STABLE_DEBT_PROTOCOL_ID ||
    protocolId == V2_VARIABLE_DEBT_PROTOCOL_ID
  ) {
    const chainId: u32 = getChainId(connection).toUInt32();
    return getProtocolDataProviderAddress_V2Lending(chainId);
  } else if (
    protocolId == V2_AMM_LENDING_PROTOCOL_ID ||
    protocolId == V2_AMM_STABLE_DEBT_PROTOCOL_ID ||
    protocolId == V2_AMM_VARIABLE_DEBT_PROTOCOL_ID
  ) {
    return V2_AMM_PROTOCOL_DATA_PROVIDER_ADDRESS_MAINNET;
  } else if (protocolId == V1_LENDING_PROTOCOL_ID) {
    const chainId: u32 = getChainId(connection).toUInt32();
    return getLendingPoolCoreAddress_V1Lending(chainId);
  } else if (protocolId == V1_UNISWAP_PROTOCOL_ID) {
    const chainId: u32 = getChainId(connection).toUInt32();
    return getLendingPoolCoreAddress_V1Uniswap(chainId);
  } else {
    throw new Error("Invalid protocol ID");
  }
}

function isValidAavePoolV2(
  tokenAddress: string,
  connection: Ethereum_Connection,
  protocolId: string,
): boolean {
  const assetAddressRes = Ethereum_Module.callContractView({
    address: tokenAddress,
    method: "function UNDERLYING_ASSET_ADDRESS() view returns (address)",
    args: null,
    connection: connection,
  });
  if (assetAddressRes.isErr) {
    return false;
  }
  const underlyingAssetAddress: string = assetAddressRes.unwrap();
  const dataProviderAddress: string = getDataProviderAddress(protocolId, connection);
  const addressRes = Ethereum_Module.callContractView({
    address: dataProviderAddress,
    method:
      "function getReserveTokensAddresses(address asset) view returns(address, address, address)",
    args: [underlyingAssetAddress],
    connection: connection,
  });
  if (addressRes.isErr) {
    return false;
  }
  // addresses = [aToken, sToken, vToken]
  const addresses: string[] = addressRes.unwrap().split(",");
  const toCompare: string =
    protocolId == V2_LENDING_PROTOCOL_ID || protocolId == V2_AMM_LENDING_PROTOCOL_ID
      ? addresses[0]
      : protocolId == V2_STABLE_DEBT_PROTOCOL_ID || protocolId == V2_AMM_STABLE_DEBT_PROTOCOL_ID
      ? addresses[1]
      : addresses[2]; // V2_VARIABLE_DEBT_PROTOCOL_ID || V2_AMM_VARIABLE_DEBT_PROTOCOL_ID
  return tokenAddress.toLowerCase() == toCompare.toLowerCase();
}

function isValidAavePoolV1(
  tokenAddress: string,
  connection: Ethereum_Connection,
  protocolId: string,
): boolean {
  const assetAddressRes = Ethereum_Module.callContractView({
    address: tokenAddress,
    method: "function underlyingAssetAddress() view returns (address)",
    args: null,
    connection: connection,
  });
  if (assetAddressRes.isErr) {
    return false;
  }
  const underlyingAssetAddress: string = assetAddressRes.unwrap();
  const dataProviderAddress: string = getDataProviderAddress(protocolId, connection);
  const addressRes = Ethereum_Module.callContractView({
    address: dataProviderAddress,
    method: "function getReserveATokenAddress(address _reserve) public view returns (address)",
    args: [underlyingAssetAddress],
    connection: connection,
  });
  if (addressRes.isErr) {
    return false;
  }
  return tokenAddress.toLowerCase() == addressRes.unwrap().toLowerCase();
}

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as Env).connection;

  if (args.protocolId == V2_LENDING_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V2_STABLE_DEBT_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V2_VARIABLE_DEBT_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V2_AMM_LENDING_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V2_AMM_STABLE_DEBT_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V2_AMM_VARIABLE_DEBT_PROTOCOL_ID) {
    return isValidAavePoolV2(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V1_LENDING_PROTOCOL_ID) {
    return isValidAavePoolV1(args.tokenAddress, connection, args.protocolId);
  } else if (args.protocolId == V1_UNISWAP_PROTOCOL_ID) {
    return isValidAavePoolV1(args.tokenAddress, connection, args.protocolId);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
