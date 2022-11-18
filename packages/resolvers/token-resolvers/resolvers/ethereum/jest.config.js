// eslint-disable-next-line no-undef
module.exports = {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/e2e/**/?(*.)+(spec|test).[jt]s?(x)"],
  modulePathIgnorePatterns: ["./src/__tests__/e2e/types", "./src/__tests__/utils", ".polywrap/*"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      diagnostics: false,
    },
  },
};
