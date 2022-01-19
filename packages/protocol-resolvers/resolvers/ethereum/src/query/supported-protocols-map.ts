import { ProtocolResolver_Protocol } from "./w3";

export const supportedProtocolsMap = new Map<string, ProtocolResolver_Protocol>()
  .set("curve_fi_gauge_v2", {
    id: "curve_fi_gauge_v2",
    organization: "Curve.fi",
    name: "Curve.fi gauge",
    version: "2",
    forkedFrom: null,
  })
  .set("curve_fi_pool_v2", {
    id: "curve_fi_pool_v2",
    organization: "Curve.fi",
    name: "Curve.fi pool",
    version: "2",
    forkedFrom: null,
  })
  .set("yearn_vault_v1", {
    id: "yearn_vault_v1",
    organization: "Yearn.finance",
    version: "1",
    name: "Yearn Vault",
    forkedFrom: null,
  })
  .set("yearn_vault_v2", {
    id: "yearn_vault_v2",
    organization: "Yearn.finance",
    version: "2",
    name: "Yearn Vault",
    forkedFrom: null,
  })
  .set("aave_lending_borrowing_v1", {
    id: "aave_lending_borrowing_v1",
    organization: "Aave",
    name: "Aave lending-borrowing",
    version: "1",
    forkedFrom: null,
  })
  .set("aave_lending_borrowing_v2", {
    id: "aave_lending_borrowing_v2",
    organization: "Aave",
    name: "Aave lending-borrowing",
    version: "2",
    forkedFrom: null,
  })
  .set("aave_amm_pool_v2", {
    id: "aave_amm_pool_v2",
    organization: "Aave",
    name: "Aave AMM pool",
    version: "2",
    forkedFrom: null,
  })
  .set("uniswap_v2", {
    id: "uniswap_v2",
    organization: "Uniswap",
    name: "Uniswap",
    version: "2",
    forkedFrom: null,
  })
  .set("sushiswap_v1", {
    id: "sushiswap_v1",
    organization: "Sushi",
    name: "Sushiswap",
    version: "1",
    forkedFrom: {
      id: "uniswap_v2",
      organization: "Uniswap",
      name: "Uniswap",
      version: "2",
      forkedFrom: null,
    },
  })
  .set("linkswap_v1", {
    id: "linkswap_v1",
    organization: "Linkswap",
    name: "Linkswap",
    version: "1",
    forkedFrom: {
      id: "uniswap_v2",
      organization: "Uniswap",
      name: "Uniswap",
      version: "2",
      forkedFrom: null,
    },
  })
  .set("compound_v1", {
    id: "compound_v1",
    organization: "Compound",
    name: "Compound",
    version: "1",
    forkedFrom: null,
  })
  .set("cream_v1", {
    id: "cream_v1",
    organization: "Cream",
    name: "Cream",
    version: "1",
    forkedFrom: {
      id: "compound_v1",
      organization: "Compound",
      name: "Compound",
      version: "1",
      forkedFrom: null,
    },
  })
  .set("sushibar_v1", {
    id: "sushibar_v1",
    organization: "Sushi",
    name: "Sushibar",
    version: "1",
    forkedFrom: null,
  });
