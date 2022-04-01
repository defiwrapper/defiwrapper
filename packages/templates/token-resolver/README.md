# Token Resolver Template

This template is intended to facilitate make token resolver development by providing structure and boilerplate code so
you can focus on the pieces that are unique to the protocol of interest. Be sure to complete all the items on the
following checklist.

- [ ] Replace "foo" placeholder with your wrapper name in various fields within the `package.json` and `web3api.build.yaml`files.

- [ ] Adjust either the import-redirects fields in the `web3api.yaml` manifest file, or adjust the import statements in `src/query/schema.graphql`
to ensure they point to valid packages.

- [ ] Add the protocol metadata to a protocol resolver to ensure it can be found by users.

- [ ] Implement the isValidProtocolToken and getTokenComponents functions found in `src/query/functions`. 
Within `src/query/functions/isValidProtocolToken.ts` and `src/query/functions/getTokenComponents.ts`, you will find
boilerplate code that provides a structure for your resolver. Some constant values and utility functions are referenced
in the code. Any specific formulas and queries included in the boilerplate code are examples only and will need to be 
modified to work with each of the protocols in the resolver.

- [ ] Update `src/query/__tests__/e2e/integration.spec.ts` to test the `isValidProtocolToken` and `getTokenComponents` functions
with each protocol in the resolver.
