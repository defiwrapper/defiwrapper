import { YEARN_REGISTRY_ADAPTER_V2, YEARN_REGISTRY_V1 } from "../constants";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidYearnVaultV2(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  const isRegisteredRes = Ethereum_Query.callContractView({
    address: YEARN_REGISTRY_ADAPTER_V2,
    method:
      "function assetsStatic(address[] memory _assetsAddresses) public view returns (tuple(address id, string typeId, address tokenId, string name, string version, string symbol, uint8 decimals)[])",
    args: [`["${yTokenAddress}"]`],
    connection: connection,
  });
  if (isRegisteredRes.isErr) {
    const errMsg: string = isRegisteredRes.unwrapErr();
    if (errMsg.indexOf("exception: invalid address") > -1) {
      return false;
    }
    throw new Error(errMsg);
  }
  const assetImmutables: string[] = isRegisteredRes.unwrap().split(",");
  return assetImmutables[0].toLowerCase() == yTokenAddress.toLowerCase();
}

function isValidYearnVaultV1(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  const isRegisteredRes = Ethereum_Query.callContractView({
    address: YEARN_REGISTRY_V1,
    method:
      "function getVaultInfo(address _vault) external view returns (tuple(address controller, address token, address strategy, bool isWrapped, bool isDelegated))",
    args: [yTokenAddress],
    connection: connection,
  });
  if (isRegisteredRes.isErr) {
    const errMsg: string = isRegisteredRes.unwrapErr();
    if (errMsg.indexOf("exception: invalid address") > -1) {
      return false;
    }
    throw new Error(errMsg);
  }
  return true;
}

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (env == null) throw new Error("env is not set");
  const connection = (env as QueryEnv).connection;

  if (input.protocolId == "yearn_vault_v2") {
    return isValidYearnVaultV2(input.tokenAddress, connection);
  } else if (input.protocolId == "yearn_vault_v1") {
    return isValidYearnVaultV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}