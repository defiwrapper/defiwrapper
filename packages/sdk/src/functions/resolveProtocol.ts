import {
  Interface_ProtocolResolver_Protocol,
  ProtocolResolver,
  ProtocolResolver_Module,
} from "../wrap";
import { Args_resolveProtocol } from "../wrap/imported/Interface_Module/serialization";
import { Args_resolveProtocol as ProtocolResolver_Args_resolveProtocol } from "../wrap/imported/ProtocolResolver_Module/serialization";

export function resolveProtocol(
  input: Args_resolveProtocol,
): Interface_ProtocolResolver_Protocol | null {
  // This will try to resolveProtocol using the implementations injected by client
  // This will respect the order of implementations injected by client
  const implementations = ProtocolResolver.getImplementations();
  for (let i = 0; i < implementations.length; i++) {
    const protocolResolver = new ProtocolResolver_Module(implementations[i]);
    const resolvedProtocolResult = protocolResolver.resolveProtocol(
      changetype<ProtocolResolver_Args_resolveProtocol>(input),
    );
    if (resolvedProtocolResult.isErr) continue;

    const resolvedProtocol = resolvedProtocolResult.unwrap();
    if (resolvedProtocol == null) continue;

    return changetype<Interface_ProtocolResolver_Protocol>(resolvedProtocol);
  }
  return null;
}
