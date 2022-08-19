import {
  getRegistryAdapterV2,
  YEARN_REGISTRY_V1,
  YEARN_V1_PROTOCOL_ID,
  YEARN_V2_PROTOCOL_ID,
} from "../constants";
import { getChainId } from "../utils/network";
import { Args_isValidProtocolToken, Env, Ethereum_Connection, Ethereum_Module } from "../wrap";

function isValidYearnVaultV2(yTokenAddress: string, connection: Ethereum_Connection): boolean {
  const chainId: u32 = getChainId(connection).toUInt32();
  const isRegisteredRes = Ethereum_Module.callContractView({
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
  const isRegisteredRes = Ethereum_Module.callContractView({
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

export function isValidProtocolToken(args: Args_isValidProtocolToken, env: Env): boolean {
  if (args.protocolId == YEARN_V2_PROTOCOL_ID) {
    return isValidYearnVaultV2(args.tokenAddress, env.connection);
  } else if (args.protocolId == YEARN_V1_PROTOCOL_ID) {
    return isValidYearnVaultV1(args.tokenAddress, env.connection);
  } else {
    throw new Error(`Unknown protocolId: ${args.protocolId}`);
  }
}
