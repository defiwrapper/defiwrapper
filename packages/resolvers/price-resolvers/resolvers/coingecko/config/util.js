"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getWrapperPaths = exports.getConfig = void 0;
var ethereum_plugin_js_1 = require("@polywrap/ethereum-plugin-js");
var path_1 = __importDefault(require("path"));
function getConfig(wrapperUri, tokenUri, mainnetProvider) {
    return {
        redirects: [
            {
                from: "ens/ethereum.token.resolvers.defiwrapper.eth",
                to: tokenUri
            },
            {
                from: "ens/coingecko.price.resolvers.defiwrapper.eth",
                to: wrapperUri
            },
        ],
        plugins: [
            {
                uri: "wrap://ens/ethereum.polywrap.eth",
                plugin: (0, ethereum_plugin_js_1.ethereumPlugin)({
                    connections: new ethereum_plugin_js_1.Connections({
                        networks: {
                            mainnet: new ethereum_plugin_js_1.Connection({ provider: mainnetProvider }),
                            rinkeby: new ethereum_plugin_js_1.Connection({
                                provider: "https://rinkeby.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6"
                            })
                        },
                        defaultNetwork: "mainnet"
                    })
                })
            },
        ],
        interfaces: [
            {
                interface: "ens/interface.token.resolvers.defiwrapper.eth",
                implementations: ["ens/ethereum.token.resolvers.defiwrapper.eth"]
            },
        ]
    };
}
exports.getConfig = getConfig;
function getWrapperPaths() {
    var wrapperRelPath = path_1["default"].join(__dirname, "..");
    var wrapperAbsPath = path_1["default"].resolve(wrapperRelPath);
    var tokenRelPath = path_1["default"].join(wrapperAbsPath, "../../..", "token-resolvers", "resolvers", "ethereum");
    var tokenResolverAbsPath = path_1["default"].resolve(tokenRelPath);
    return { wrapperAbsPath: wrapperAbsPath, tokenResolverAbsPath: tokenResolverAbsPath };
}
exports.getWrapperPaths = getWrapperPaths;
