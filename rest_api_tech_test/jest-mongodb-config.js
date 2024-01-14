const config = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },

  useSharedDBForAllJestWorkers: false,
};

export default config;