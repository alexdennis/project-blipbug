import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "packages/api-schema/schema.graphql",
  documents: "packages/ui/src/graphql",
  generates: {
    "packages/ui/src/types/": {
      preset: "client",
      plugins: [],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
