export default {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        },
        modules: "auto" // permet à Jest de transformer les imports ESM
      }
    ]
  ]
};
