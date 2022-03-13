import { InvokeApiResult, Web3ApiClient } from "@web3api/client-js";

import { Interface_TokenComponent } from "../../w3";

export const isValidProtocolToken = async (
  tokenAddress: string,
  protocolId: string,
  protocolEnsUri: string,
  client: Web3ApiClient,
): Promise<InvokeApiResult<boolean>> => {
  return client.invoke<boolean>({
    uri: protocolEnsUri,
    module: "query",
    method: "isValidProtocolToken",
    input: {
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
  client: Web3ApiClient,
): Promise<InvokeApiResult<Interface_TokenComponent>> => {
  return client.invoke<Interface_TokenComponent>({
    uri: protocolEnsUri,
    module: "query",
    method: "getTokenComponents",
    input: {
      tokenAddress,
      protocolId,
    },
    config: {
      redirects: [
        {
          from: "ens/token.defiwrapper.eth",
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
          uri: "ens/token.defiwrapper.eth",
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
