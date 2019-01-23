module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://localhost:8887',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
// module.exports = {};
