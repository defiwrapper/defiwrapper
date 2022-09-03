import { DataFormat, TokenResolver_Module } from "./wrap";

export const COVALENT_API = "https://api.covalenthq.com";

export function getTokenResolverModule(chainId: string): TokenResolver_Module {
  if (chainId == "1") {
    return new TokenResolver_Module("ens/ethereum.token.resolvers.defiwrapper.eth");
  } else {
    throw new Error("Unsupported chainId");
  }
}

export function getDataFormatType(format: DataFormat): string {
  switch (format) {
    case DataFormat.JSON:
      return "JSON";
    case DataFormat.CSV:
      return "CSV";
    default:
      throw new Error("Unsupported data format");
  }
}
