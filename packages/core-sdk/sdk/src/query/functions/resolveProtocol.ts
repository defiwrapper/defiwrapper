import {
  Input_resolveProtocol,
  Input_resolveProtocol as ProtocolResolver_Input_resolveProtocol,
  Interface_ProtocolResolver_Protocol,
  ProtocolResolver,
  ProtocolResolver_Query,
} from "../w3";

export function resolveProtocol(
  input: Input_resolveProtocol,
): Interface_ProtocolResolver_Protocol | null {
  // This will try to resolveProtocol using the implementations injected by client
  // This will respect the order of implementations injected by client
  const implementations = ProtocolResolver.getImplementations();
  for (let i = 0; i < implementations.length; i++) {
    const protocolResolver = new ProtocolResolver_Query(implementations[i]);
    const resolvedProtocolResult = protocolResolver.resolveProtocol(
      changetype<ProtocolResolver_Input_resolveProtocol>(input),
    );
    if (resolvedProtocolResult.isErr) continue;

    const resolvedProtocol = resolvedProtocolResult.unwrap();
    if (resolvedProtocol == null) continue;

    return changetype<Interface_ProtocolResolver_Protocol>(resolvedProtocol);
  }
  return null;
}
