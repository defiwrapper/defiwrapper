import { wrap_debug_log } from "@polywrap/wasm-as";
import { isValidProtocolToken, resolveProtocol } from "..";
import { Args_getProtocol, Interface_ProtocolResolver_Protocol } from "../wrap";

function resolveForkedProtocol(
  protocol: Interface_ProtocolResolver_Protocol,
): Interface_ProtocolResolver_Protocol {
  let currentProtocol: Interface_ProtocolResolver_Protocol | null = protocol;
  while (currentProtocol && currentProtocol.forkedFrom != null) {
    currentProtocol = currentProtocol.forkedFrom;
  }
  return currentProtocol as Interface_ProtocolResolver_Protocol;
}

export function getProtocol(args: Args_getProtocol): Interface_ProtocolResolver_Protocol | null {
  const resolvedProtocol = resolveProtocol({ tokenAddress: args.tokenAddress });
  wrap_debug_log(resolvedProtocol ? resolvedProtocol.id as string : "NOT RESOLVED")
  if (resolvedProtocol == null) return null;

  const resolvedForkedProtocol = resolveForkedProtocol(resolvedProtocol);
  if (
    !resolvedForkedProtocol.adapterUri ||
    !isValidProtocolToken({
      protocolAdapterUri: resolvedForkedProtocol.adapterUri as string,
      protocolId: resolvedForkedProtocol.id,
      tokenAddress: args.tokenAddress,
    })
  ) {
    return null;
  }
  return resolvedProtocol;
}
