import type { Config } from "jest";

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules"],
} as Config;
