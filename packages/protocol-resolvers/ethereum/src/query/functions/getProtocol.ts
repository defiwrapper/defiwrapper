import { isValidTokenProtocol, resolveProtocol } from "..";
import { Input_getProtocol, ProtocolResolver_Protocol } from "../w3";

function resolveForkedProtocol(protocol: ProtocolResolver_Protocol): ProtocolResolver_Protocol {
  let currentProtocol: ProtocolResolver_Protocol | null = protocol;
  while (currentProtocol && currentProtocol.forkedFrom != null) {
    currentProtocol = currentProtocol.forkedFrom;
  }
  return currentProtocol as ProtocolResolver_Protocol;
}

export function getProtocol(input: Input_getProtocol): ProtocolResolver_Protocol | null {
  const resolvedProtocol = resolveProtocol({ token: input.token });
  if (resolvedProtocol == null) return null;

  const resolvedForkedProtocol = resolveForkedProtocol(resolvedProtocol);
  if (
    !isValidTokenProtocol({
      protocolId: resolvedForkedProtocol.id,
      tokenAddress: input.token.address,
    })
  ) {
    return null;
  }
  return resolvedProtocol;
}
