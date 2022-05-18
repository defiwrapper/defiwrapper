const argv = process.argv.slice(2);

if (argv.length !== 1) {
  throw Error(`Require 1 arguments, passed: ${argv.length}`);
}

const str = argv[0];
const pattern = /IpfsHash:[\t\n ]*'([A-Za-z0-9]*)'/;

const match = str.match(pattern);

if (!match) {
  throw new Error(`No IPFS CID found in deployment log:\n ${str}`);
}

console.log(match[1]);
