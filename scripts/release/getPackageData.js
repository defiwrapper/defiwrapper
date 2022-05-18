const argv = process.argv.slice(2);

if (argv.length !== 2) {
  throw Error(`Require 2 arguments, passed: ${argv.length}`);
}

const str = argv[0];
const idx = argv[1];

const arr = str.split(",");

console.log(arr[parseInt(idx)]);
