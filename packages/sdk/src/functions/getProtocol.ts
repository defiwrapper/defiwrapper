import { isValidProtocolToken, resolveProtocol } from "..";
import { Input_getProtocol, Interface_ProtocolResolver_Protocol } from "../w3";

function resolveForkedProtocol(
  protocol: Interface_ProtocolResolver_Protocol,
): Interface_ProtocolResolver_Protocol {
  let currentProtocol: Interface_ProtocolResolver_Protocol | null = protocol;
  while (currentProtocol && currentProtocol.forkedFrom != null) {
    currentProtocol = currentProtocol.forkedFrom;
  }
  return currentProtocol as Interface_ProtocolResolver_Protocol;
}

export function getProtocol(input: Input_getProtocol): Interface_ProtocolResolver_Protocol | null {
  const resolvedProtocol = resolveProtocol({ tokenAddress: input.tokenAddress });
  if (resolvedProtocol == null) return null;

  const resolvedForkedProtocol = resolveForkedProtocol(resolvedProtocol);
  if (
    !resolvedForkedProtocol.adapterUri ||
    !isValidProtocolToken({
      protocolAdapterUri: resolvedForkedProtocol.adapterUri as string,
      protocolId: resolvedForkedProtocol.id,
      tokenAddress: input.tokenAddress,
    })
  ) {
    return null;
  }
  return resolvedProtocol;
}
