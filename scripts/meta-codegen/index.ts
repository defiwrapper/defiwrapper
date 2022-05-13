import fs from "fs";
import path from "path";

import { runCommand } from "./utils";

export async function run(): Promise<void> {
  const resolversPath = path.resolve(__dirname, "..", "..", "packages", "core-sdk", "resolvers");
  const dirs = fs.readdirSync(resolversPath);

  for (const dir of dirs) {
    if (fs.statSync(path.join(resolversPath, dir)).isDirectory() && dir.endsWith("-resolvers")) {
      const curResolversPath = path.join(resolversPath, dir, "resolvers");
      if (!fs.existsSync(curResolversPath)) continue;

      const curResolvers = fs.readdirSync(curResolversPath);
      for (const resolver of curResolvers) {
        if (fs.statSync(path.join(curResolversPath, resolver)).isDirectory()) {
          const curResolverManifest = path.join(curResolversPath, resolver, "web3api.yaml");
          if (!fs.existsSync(curResolverManifest)) continue;

          fs.mkdirSync(path.join(curResolversPath, resolver, "meta", "queries"), {
            recursive: true,
          });

          await runCommand(
            `npx w3 codegen -m ${curResolverManifest} -s ${path.resolve(
              __dirname,
              "codegen.ts",
            )} -c ${path.join(curResolversPath, resolver, "meta", "queries")}`,
            false,
            path.join(__dirname, "..", ".."),
          );

          await runCommand(
            `cp -R ${path.join(__dirname, "templates", "imgs")} ${path.join(
              curResolversPath,
              resolver,
              "meta",
              "imgs",
            )}`,
            false,
            path.join(__dirname, "..", ".."),
          );
        }
      }
    }
  }
}

run().then();
