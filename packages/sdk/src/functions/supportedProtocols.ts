import {
  Args_supportedProtocols,
  Interface_ProtocolResolver_Protocol,
  ProtocolResolver,
  ProtocolResolver_Module,
} from "../wrap";

export function supportedProtocols(
  _: Args_supportedProtocols,
): Interface_ProtocolResolver_Protocol[] {
  // This will aggregate all the supported protocols from all the implementations injected by client
  const implementations = ProtocolResolver.getImplementations();
  const supportedProtocolsMap = new Map<string, Interface_ProtocolResolver_Protocol>();
  for (let i = 0; i < implementations.length; i++) {
    const protocolResolver = new ProtocolResolver_Module(implementations[i]);
    const supportedProtocolsResult = protocolResolver.supportedProtocols({});
    if (supportedProtocolsResult.isErr) continue;

    const _supportedProtocols = supportedProtocolsResult.unwrap();
    if (_supportedProtocols == null || _supportedProtocols.length == 0) continue;

    for (let j = 0; j < _supportedProtocols.length; j++) {
      supportedProtocolsMap.set(
        _supportedProtocols[j].id,
        changetype<Interface_ProtocolResolver_Protocol>(_supportedProtocols[j]),
      );
    }
  }

  return supportedProtocolsMap.values();
}
