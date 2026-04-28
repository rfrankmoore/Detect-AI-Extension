/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // Remap .js extension imports to let Jest resolve the .ts source files
    "^(.*)\\.js$": "$1",
  },
};
