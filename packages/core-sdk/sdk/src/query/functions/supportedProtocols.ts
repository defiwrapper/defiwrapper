import { Interface_Protocol, ProtocolResolver, ProtocolResolver_Query } from "../w3";

export function supportedProtocols(): Interface_Protocol[] {
  // This will aggregate all the supported protocols from all the implementations injected by client
  const implementations = ProtocolResolver.getImplementations();
  const supportedProtocolsMap = new Map<string, Interface_Protocol>();
  for (let i = 0; i < implementations.length; i++) {
    const protocolResolver = new ProtocolResolver_Query(implementations[i]);
    const supportedProtocolsResult = protocolResolver.supportedProtocols({});
    if (supportedProtocolsResult.isErr) continue;

    const _supportedProtocols = supportedProtocolsResult.unwrap();
    if (_supportedProtocols == null || _supportedProtocols.length == 0) continue;

    for (let j = 0; j < _supportedProtocols.length; j++) {
      supportedProtocolsMap.set(
        _supportedProtocols[j].id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: changetype is AS build-in function
        changetype<Interface_Protocol>(_supportedProtocols[j]),
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Map.values() returns Iterator in TS but Array in AS
  return supportedProtocolsMap.values();
}
