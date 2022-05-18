const argv = process.argv.slice(2);

if (argv.length !== 1) {
  throw Error(`Require 1 arguments, passed: ${argv.length}`);
}

const str = argv[0];
const pattern = /Resolver:[\t\n ]*0x([A-Za-z0-9]*)/;

const match = str.match(pattern);

if (!match || match.length < 2 || !match[1]) {
  console.log("false");
} else {
  console.log("true");
}
