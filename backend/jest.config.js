export default {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  transform: {
    "^.+\\.js$": "babel-jest", // nécessaire pour les imports ESM
  },
};
