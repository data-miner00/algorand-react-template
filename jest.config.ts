import type { Config } from "jest";

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "ts-jest",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileTransformer.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules"],
} as Config;
