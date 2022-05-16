import { supportedProtocolsMap } from "../supported-protocols-map";
import { ProtocolResolver_Protocol } from "../w3";

export function supportedProtocols(): ProtocolResolver_Protocol[] {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Map.values() returns Iterator in TS but Array in AS
  return supportedProtocolsMap.values();
}
