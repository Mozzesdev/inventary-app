import { type JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  setupFiles: ["./jest.setup.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "node",
  testMatch: ['**/**/*.test.ts'],
  forceExit: true,
  verbose: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        useESM: true,
      },
    ],
  },
};

export default jestConfig;
