export default {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  transform: {
    "^.+\\.js$": "babel-jest", // pour les imports ESM
  },
  moduleDirectories: ["node_modules", "<rootDir>/backend"], // pour résoudre les imports depuis backend/
  moduleFileExtensions: ["js", "json", "node"],
  rootDir: "./", // assure que <rootDir> est la racine du projet
};
