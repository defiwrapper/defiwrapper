import { isValidProtocolToken, resolveProtocol } from "..";
import { Input_getProtocol, Interface_Protocol } from "../w3";

function resolveForkedProtocol(protocol: Interface_Protocol): Interface_Protocol {
  let currentProtocol: Interface_Protocol | null = protocol;
  while (currentProtocol && currentProtocol.forkedFrom != null) {
    currentProtocol = currentProtocol.forkedFrom;
  }
  return currentProtocol as Interface_Protocol;
}

export function getProtocol(input: Input_getProtocol): Interface_Protocol | null {
  const resolvedProtocol = resolveProtocol({ token: input.token });
  if (resolvedProtocol == null) return null;

  const resolvedForkedProtocol = resolveForkedProtocol(resolvedProtocol);
  if (
    !isValidProtocolToken({
      protocol: resolvedForkedProtocol,
      tokenAddress: input.token.address,
    })
  ) {
    return null;
  }
  return resolvedProtocol;
}
