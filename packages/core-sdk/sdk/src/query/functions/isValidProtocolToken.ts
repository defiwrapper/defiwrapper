import { Input_isValidProtocolToken, AssetResolver_Query } from "../w3";

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  const tokenResolver = new AssetResolver_Query(input.protocolAdapterUri);
  const isValidProtocolTokenResult = tokenResolver.isValidProtocolToken({
    tokenAddress: input.tokenAddress,
    protocolId: input.protocolId,
  });

  return isValidProtocolTokenResult.isErr ? false : isValidProtocolTokenResult.unwrap();
}
