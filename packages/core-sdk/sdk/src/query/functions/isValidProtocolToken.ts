import { Input_isValidProtocolToken, TokenResolver_Query } from "../w3";

export function isValidProtocolToken(input: Input_isValidProtocolToken): boolean {
  if (!input.protocol.adapterUri) return false;
  const tokenResolver = new TokenResolver_Query(input.protocol.adapterUri as string);
  const isValidProtocolTokenResult = tokenResolver.isValidProtocolToken({
    tokenAddress: input.tokenAddress,
    protocolId: input.protocol.id,
  });

  return isValidProtocolTokenResult.isErr ? false : isValidProtocolTokenResult.unwrap();
}
