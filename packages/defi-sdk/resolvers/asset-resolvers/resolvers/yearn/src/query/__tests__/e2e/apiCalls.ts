import { InvokeApiResult, PolywrapClient } from "@polywrap/client-js";

import { Interface_TokenComponent } from "../../wrap";

export const isValidProtocolToken = async (
  tokenAddress: string,
  protocolId: string,
  protocolEnsUri: string,
  client: PolywrapClient,
): Promise<InvokeApiResult<boolean>> => {
  return client.invoke<boolean>({
    uri: protocolEnsUri,
    module: "query",
    method: "isValidProtocolToken",
    args: {
      tokenAddress,
      protocolId,
    },
    config: {
      envs: [
        {
          uri: protocolEnsUri,
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
  tokenEnsUri: string,
  protocolEnsUri: string,
  client: PolywrapClient,
): Promise<InvokeApiResult<Interface_TokenComponent>> => {
  return client.invoke<Interface_TokenComponent>({
    uri: protocolEnsUri,
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
          to: tokenEnsUri,
        },
      ],
      envs: [
        {
          uri: protocolEnsUri,
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
