import {
  getRegistryAdapterV2,
  YEARN_REGISTRY_V1,
  YEARN_V1_PROTOCOL_ID,
  YEARN_V2_PROTOCOL_ID,
} from "../constants";
import { getChainId } from "../utils/network";
import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidYearnVaultV2(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: i32 = getChainId(connection);
  const isRegisteredRes = Ethereum_Query.callContractView({
    address: getRegistryAdapterV2(chainId),
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

  if (input.protocolId == YEARN_V2_PROTOCOL_ID) {
    return isValidYearnVaultV2(input.tokenAddress, connection);
  } else if (input.protocolId == YEARN_V1_PROTOCOL_ID) {
    return isValidYearnVaultV1(input.tokenAddress, connection);
  } else {
    throw new Error(`Unknown protocolId: ${input.protocolId}`);
  }
}
