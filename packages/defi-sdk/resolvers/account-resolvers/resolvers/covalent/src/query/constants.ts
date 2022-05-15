import { DataFormat, TokenResolver_Query } from "./w3";

export const COVALENT_API = "https://api.covalenthq.com";

export function getTokenResolverQuery(chainId: string): TokenResolver_Query {
  if (chainId == "1") {
    return new TokenResolver_Query("ens/ethereum.token.resolvers.defiwrapper.eth");
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
