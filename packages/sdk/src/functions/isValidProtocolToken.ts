import { wrap_debug_log } from "@polywrap/wasm-as";
import { Args_isValidProtocolToken, AssetResolver_Module } from "../wrap";

export function isValidProtocolToken(args: Args_isValidProtocolToken): boolean {
  const tokenResolver = new AssetResolver_Module(args.protocolAdapterUri);
  wrap_debug_log("Validating...");
  const isValidProtocolTokenResult = tokenResolver.isValidProtocolToken({
    tokenAddress: args.tokenAddress,
    protocolId: args.protocolId,
  });
  wrap_debug_log("Validation Eroror: " + (isValidProtocolTokenResult.isErr ? "true" : "false"));

  wrap_debug_log(isValidProtocolTokenResult.unwrap() ? "true" : "false")

  return isValidProtocolTokenResult.isErr ? false : isValidProtocolTokenResult.unwrap();
}
