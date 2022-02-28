import {
  env,
  Ethereum_Connection,
  Ethereum_Query,
  Input_isValidProtocolToken,
  QueryEnv,
} from "../w3";

function isValidYearnVaultV2(lpTokenAddress: string, connection: Ethereum_Connection): boolean {

}

function isValidYearnVaultV1(lpTokenAddress: string, connection: Ethereum_Connection): boolean {

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
