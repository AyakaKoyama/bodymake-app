import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      useESM: true,
    },
  },
  // transformIgnorePatterns: ["/node_modules/(?!react-markdown|rehype-raw)"],
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  //setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
