import { supportedProtocolsMap } from "../supported-protocols-map";
import { ProtocolResolver_Protocol } from "../w3";

export function supportedProtocols(): ProtocolResolver_Protocol[] {
  return supportedProtocolsMap.values();
}
