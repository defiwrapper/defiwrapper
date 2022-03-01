import { YEARN_REGISTERY_ADAPTER_V2, YEARN_REGISTRY_ADAPTER_IRON_BANK } from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isRegisteredYearn(
  yTokenAddress: string,
  registryAddress: string,
  connection: Ethereum_Connection,
): boolean {
  const isRegisteredRes = Ethereum_Query.callContractView({
    address: registryAddress,
    method:
      "function assetsStatic(address[] memory _assetsAddresses) public view returns (AssetStatic[] memory)",
    args: [`["${yTokenAddress}"]`],
    connection: connection,
  });
  if (isRegisteredRes.isErr) {
    return false;
  }
  const assetImmutables: string[] = isRegisteredRes.unwrap().split(",");
  return assetImmutables[0] == yTokenAddress;
}

function isActiveYearn(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  const isActiveRes = Ethereum_Query.callContractView({
    address: yTokenAddress,
    method: "function isActive() external view returns (bool)",
    args: [],
    connection: connection,
  });
  if (isActiveRes.isErr) {
    return false;
  }
  return isActiveRes.unwrap() == "true";
}

function isValidYearnVaultV2(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  return (
    isRegisteredYearn(yTokenAddress, YEARN_REGISTERY_ADAPTER_V2, connection) &&
    isActiveYearn(yTokenAddress, connection)
  );
}

function isValidYearnIronBank(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  return (
    isRegisteredYearn(yTokenAddress, YEARN_REGISTRY_ADAPTER_IRON_BANK, connection) &&
    isActiveYearn(yTokenAddress, connection)
  );
}

function isValidYearnVaultV1(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  return (
    isRegisteredYearn(yTokenAddress, YEARN_REGISTERY_ADAPTER_V2, connection) &&
    isActiveYearn(yTokenAddress, connection)
  );
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "yearn_vault_v2") {
    return isValidYearnVaultV2(input.tokenAddress, connection);
  } else if (input.protocolId == "yearn_iron_bank") {
    return isValidYearnIronBank(input.tokenAddress, connection);
  } else if (input.protocolId == "yearn_vault_v1") {
    return isValidYearnVaultV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
