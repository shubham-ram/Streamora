module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm dev",
      url: ["http://localhost:3000"],
      settings: {
        preset: "desktop",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
