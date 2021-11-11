import fs from "fs";

import { runCommand } from "./helpers/runCommand";

const argv = process.argv.slice(2);
const recipe = argv[0];

async function main(): Promise<void> {
  if (recipe) {
    await runCommand(`npx w3 query ./${recipe}/e2e.json`, false, `${__dirname}/adapters`);
  } else {
    // eslint-disable-next-line no-shadow
    for (const recipe of fs.readdirSync(`${__dirname}/adapters`)) {
      if (recipe.startsWith(".")) continue;
      await runCommand(`npx w3 query ./${recipe}/e2e.json`, false, `${__dirname}/adapters`);
    }
  }
}

main()
  .then()
  .catch((err) => {
    console.error(err);
  });
