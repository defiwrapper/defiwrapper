import { supportedProtocolsMap } from "../supported-protocols-map";
import { Args_supportedProtocols, ProtocolResolver_Protocol } from "../wrap";

export function supportedProtocols(_: Args_supportedProtocols): ProtocolResolver_Protocol[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Map.values() returns Iterator in TS but Array in AS
  return supportedProtocolsMap.values();
}
