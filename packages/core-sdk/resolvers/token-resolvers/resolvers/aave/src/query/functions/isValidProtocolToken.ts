import {
  V1_LENDING_POOL_CORE_ADDRESS,
  V1_LENDING_PROTOCOL_ID,
  V2_AMM_PROTOCOL_DATA_PROVIDER_ADDRESS,
  V2_AMM_PROTOCOL_ID,
  V2_LENDING_PROTOCOL_DATA_PROVIDER_ADDRESS,
  V2_LENDING_PROTOCOL_ID,
} from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function getDataProviderAddress(protocolId: string): string {
  if (protocolId == V2_LENDING_PROTOCOL_ID) {
    return V2_LENDING_PROTOCOL_DATA_PROVIDER_ADDRESS;
  } else if (protocolId == V2_AMM_PROTOCOL_ID) {
    return V2_AMM_PROTOCOL_DATA_PROVIDER_ADDRESS;
  } else if (protocolId == V1_LENDING_PROTOCOL_ID) {
    return V1_LENDING_POOL_CORE_ADDRESS;
  } else {
    throw new Error("Invalid protocol ID");
  }
}

function isValidAavePoolV2(
  tokenAddress: string,
  connection: Ethereum_Connection,
  protocolId: string,
): boolean {
  const assetAddressRes = Ethereum_Query.callContractView({
    address: tokenAddress,
    method: "function UNDERLYING_ASSET_ADDRESS() view returns (address)",
    args: null,
    connection: connection,
  });
  if (assetAddressRes.isErr) {
    return false;
  }
  const underlyingAssetAddress: string = assetAddressRes.unwrap();
  const dataProviderAddress: string = getDataProviderAddress(protocolId);
  const addressRes = Ethereum_Query.callContractView({
    address: dataProviderAddress,
    method:
      "function getReserveTokensAddresses(address asset) view returns(address, address, address)",
    args: [underlyingAssetAddress],
    connection: connection,
  });
  if (addressRes.isErr) {
    return false;
  }
  const addresses: string[] = addressRes.unwrap().split(",");
  return tokenAddress.toLowerCase() == addresses[0].toLowerCase();
}

function isValidAavePoolV1(tokenAddress: string, connection: Ethereum_Connection): boolean {
  const assetAddressRes = Ethereum_Query.callContractView({
    address: tokenAddress,
    method: "function underlyingAssetAddress() view returns (address)",
    args: null,
    connection: connection,
  });
  if (assetAddressRes.isErr) {
    return false;
  }
  const underlyingAssetAddress: string = assetAddressRes.unwrap();
  const dataProviderAddress: string = getDataProviderAddress(V1_LENDING_PROTOCOL_ID);
  const addressRes = Ethereum_Query.callContractView({
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

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == V2_LENDING_PROTOCOL_ID) {
    return isValidAavePoolV2(input.tokenAddress, connection, input.protocolId);
  } else if (input.protocolId == V2_AMM_PROTOCOL_ID) {
    return isValidAavePoolV2(input.tokenAddress, connection, input.protocolId);
  } else if (input.protocolId == V1_LENDING_PROTOCOL_ID) {
    return isValidAavePoolV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
