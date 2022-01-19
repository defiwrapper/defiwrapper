import { Interface_Protocol, ProtocolResolver, ProtocolResolver_Query } from "../w3";
import { Input_resolveProtocol } from "../w3/imported/Interface_Query/serialization";
import { Input_resolveProtocol as ProtocolResolver_Input_resolveProtocol } from "../w3/imported/ProtocolResolver_Query/serialization";

export function resolveProtocol(input: Input_resolveProtocol): Interface_Protocol | null {
  // This will try to resolveProtocol using the implementations injected by client
  // This will respect the order of implementations injected by client
  const implementations = ProtocolResolver.getImplementations();
  for (let i = 0; i < implementations.length; i++) {
    const protocolResolver = new ProtocolResolver_Query(implementations[i]);
    const resolvedProtocol = protocolResolver.resolveProtocol(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: changetype is AS build-in function
      changetype<ProtocolResolver_Input_resolveProtocol>(input),
    );
    if (resolvedProtocol != null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: changetype is AS build-in function
      return changetype<Interface_Protocol>(resolvedProtocol);
    }
  }
  return null;
}
