"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getWrapperPaths = exports.getConfig = void 0;
var ethereum_plugin_js_1 = require("@polywrap/ethereum-plugin-js");
var dotenv = __importStar(require("dotenv"));
var path_1 = __importDefault(require("path"));
dotenv.config();
var INFURA_KEY = process.env.INFURA_KEY || "b00b2c2cc09c487685e9fb061256d6a6";
function getConfig(wrapperUri, tokenUri) {
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
                            mainnet: new ethereum_plugin_js_1.Connection({ provider: "https://mainnet.infura.io/v3/".concat(INFURA_KEY) }),
                            rinkeby: new ethereum_plugin_js_1.Connection({
                                provider: "https://rinkeby.infura.io/v3/".concat(INFURA_KEY)
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
