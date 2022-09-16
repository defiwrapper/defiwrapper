"use strict";
exports.__esModule = true;
exports.getClientConfig = void 0;
var util_1 = require("./util");
function getClientConfig(_) {
    var _a = (0, util_1.getWrapperPaths)(), wrapperAbsPath = _a.wrapperAbsPath, tokenResolverAbsPath = _a.tokenResolverAbsPath;
    var wrapperUri = "fs/".concat(wrapperAbsPath, "/build");
    var tokenResolverUri = "fs/".concat(tokenResolverAbsPath, "/build");
    var mainnetProvider = "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6";
    return (0, util_1.getConfig)(wrapperUri, tokenResolverUri, mainnetProvider);
}
exports.getClientConfig = getClientConfig;
