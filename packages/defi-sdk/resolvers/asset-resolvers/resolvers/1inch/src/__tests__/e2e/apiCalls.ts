import { InvokeResult, PolywrapClient } from "@polywrap/client-js";

import { Interface_TokenComponent } from "../../wrap";

export const isValidProtocolToken = async (
  tokenAddress: string,
  protocolId: string,
  protocolUri: string,
  client: PolywrapClient,
): Promise<InvokeResult<boolean>> => {
  return client.invoke<boolean>({
    uri: protocolUri,
    method: "isValidProtocolToken",
    args: {
      tokenAddress,
      protocolId,
    },
  });
};

export const getTokenComponents = async (
  tokenAddress: string,
  protocolId: string,
  tokenUri: string,
  protocolUri: string,
  client: PolywrapClient,
): Promise<InvokeResult<Interface_TokenComponent>> => {
  return client.invoke<Interface_TokenComponent>({
    uri: protocolUri,
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
          env: {
            connection: {
              networkNameOrChainId: "mainnet",
            },
          },
        },
        {
          uri: "ens/ethereum.token.resolvers.defiwrapper.eth",
          env: {
            connection: {
              networkNameOrChainId: "mainnet",
            },
          },
        },
      ],
    },
  });
};
