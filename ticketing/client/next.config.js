module.exports = {
  // webpackDevMiddleware: (config) => {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
