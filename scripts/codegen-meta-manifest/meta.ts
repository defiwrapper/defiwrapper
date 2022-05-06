/* eslint-disable @typescript-eslint/naming-convention */
import {
  BindModuleOptions,
  BindModuleOutput,
  BindOptions,
  BindOutput,
  GenerateBindingFn,
} from "@web3api/schema-bind";
import {
  addFirstLast,
  methodParentPointers,
  toPrefixedGraphQLType,
  transformTypeInfo,
  TypeInfo,
} from "@web3api/schema-parse";
import { readFileSync } from "fs";
import Mustache from "mustache";
import * as path from "path";

export const generateBinding: GenerateBindingFn = (options: BindOptions): BindOutput => {
  const result: BindOutput = {
    modules: [],
  };

  for (const module of options.modules) {
    result.modules.push(generateModuleBindings(module));
  }

  return result;
};

function applyTransforms(typeInfo: TypeInfo): TypeInfo {
  const transforms = [addFirstLast, toPrefixedGraphQLType, methodParentPointers()];

  let transformed: TypeInfo = typeInfo;
  for (const transform of transforms) {
    transformed = transformTypeInfo(transformed, transform);
  }
  return transformed;
}

function generateModuleBindings(module: BindModuleOptions): BindModuleOutput {
  const result: BindModuleOutput = {
    name: module.name,
    output: {
      entries: [],
    },
    outputDirAbs: module.outputDirAbs,
  };
  const output = result.output;
  const schema = module.schema;
  const typeInfo = applyTransforms(module.typeInfo);

  const renderTemplate = (subPath: string, context: unknown, fileName?: string): void => {
    const absPath = path.join(__dirname, subPath);
    const template = readFileSync(absPath, { encoding: "utf-8" });

    output.entries.push({
      type: "File",
      name: fileName,
      data: Mustache.render(template, context),
    });
  };

  // generate manifest
  const rootContext = {
    ...typeInfo,
    schema,
  };
  renderTemplate("./meta-manifest.mustache", rootContext, "./../../web3api.meta.yaml");

  // generate queries
  for (const moduleType of typeInfo.moduleTypes) {
    for (const method of moduleType.methods) {
      const methodContext = {
        ...method,
        schema,
      };
      renderTemplate("./meta-query.mustache", methodContext, `${method.name}.graphql`);
      renderTemplate("./meta-vars.mustache", methodContext, `${method.name}.json`);
    }
  }

  return result;
}
