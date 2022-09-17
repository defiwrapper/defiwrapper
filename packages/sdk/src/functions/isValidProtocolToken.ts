import { Args_isValidProtocolToken, AssetResolver_Module } from "../wrap";

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  const tokenResolver = new AssetResolver_Module(args.protocolAdapterUri);
  const isValidProtocolTokenResult = tokenResolver.isValidProtocolToken({
    tokenAddress: args.tokenAddress,
    protocolId: args.protocolId,
  });
  return isValidProtocolTokenResult.isErr ? false : isValidProtocolTokenResult.unwrap();
}
