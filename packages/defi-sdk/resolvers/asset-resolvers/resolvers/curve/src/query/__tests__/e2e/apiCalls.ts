import { InvokeApiResult, PolywrapClient } from "@polywrap/client-js";

import { Interface_TokenComponent } from "../../wrap";

export const isValidProtocolToken = async (
  tokenAddress: string,
  protocolId: string,
  protocolUri: string,
  client: PolywrapClient,
): Promise<InvokeApiResult<boolean>> => {
  return client.invoke<boolean>({
    uri: protocolUri,
    module: "query",
    method: "isValidProtocolToken",
    args: {
      tokenAddress,
      protocolId,
    },
    config: {
      envs: [
        {
          uri: protocolUri,
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
      ],
    },
  });
};

export const getTokenComponents = async (
  tokenAddress: string,
  protocolId: string,
  tokenUri: string,
  protocolUri: string,
  client: PolywrapClient,
): Promise<InvokeApiResult<Interface_TokenComponent>> => {
  return client.invoke<Interface_TokenComponent>({
    uri: protocolUri,
    module: "query",
    method: "getTokenComponents",
    args: {
      tokenAddress,
      protocolId,
    },
    config: {
      redirects: [
        {
          from: "ens/ethereum.token.resolvers.defiwrapper.eth",
          to: tokenUri,
        },
      ],
      envs: [
        {
          uri: protocolUri,
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
        {
          uri: "ens/ethereum.token.resolvers.defiwrapper.eth",
          query: {
            connection: {
              networkNameOrChainId: "MAINNET",
            },
          },
        },
      ],
    },
  });
};
