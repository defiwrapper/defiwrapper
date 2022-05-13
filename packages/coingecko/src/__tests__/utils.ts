import { ClientConfig, coreInterfaceUris } from "@web3api/client-js";
import { ensPlugin } from "@web3api/ens-plugin-js";
import { ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ipfsPlugin } from "@web3api/ipfs-plugin-js";
import axios from "axios";

interface TestEnvironment {
  ipfs: string;
  ethereum: string;
  ensAddress: string;
  registrarAddress: string;
  reverseAddress: string;
  resolverAddress: string;
  clientConfig: Partial<ClientConfig>;
}

export function getPlugins(
  ethereum: string,
  ipfs: string,
  ensAddress: string,
): Partial<ClientConfig> {
  return {
    redirects: [],
    plugins: [
      {
        uri: "w3://ens/ipfs.web3api.eth",
        plugin: ipfsPlugin({ provider: ipfs }),
      },
      {
        uri: "w3://ens/ens.web3api.eth",
        plugin: ensPlugin({ query: { addresses: { testnet: ensAddress } } }),
      },
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: {
            testnet: {
              provider: ethereum,
            },
            MAINNET: {
              provider: "http://localhost:8546",
            },
          },
          defaultNetwork: "testnet",
        }),
      },
    ],
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver.uri,
        implementations: ["w3://ens/ipfs.web3api.eth", "w3://ens/ens.web3api.eth"],
      },
      {
        interface: coreInterfaceUris.logger.uri,
        implementations: ["w3://ens/js-logger.web3api.eth"],
      },
    ],
  };
}

export async function getProviders(): Promise<TestEnvironment> {
  const {
    data: { ipfs, ethereum },
  } = await axios.get("http://localhost:4040/providers");
  const { data } = await axios.get("http://localhost:4040/deploy-ens");
  const clientConfig: Partial<ClientConfig> = getPlugins(ethereum, ipfs, data.ensAddress);
  return { ipfs, ethereum, ...data, clientConfig };
}

export async function getEnsUri(apiAbsPath: string): Promise<string> {
  const { ipfs, ensAddress, registrarAddress, resolverAddress, ethereum } = await getProviders();
  const api = await buildAndDeployApi({
    apiAbsPath,
    ipfsProvider: ipfs,
    ensRegistryAddress: ensAddress,
    ensRegistrarAddress: registrarAddress,
    ensResolverAddress: resolverAddress,
    ethereumProvider: ethereum,
  });
  return `ens/testnet/${api.ensDomain}`;
}
