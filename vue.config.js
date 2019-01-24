module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://localhost:8887',
        changeOrigin: true
      },
      '^/ws': {
        target: 'wss://localhost:8888',
        changeOrigin: true,
        ws: true,
        pathRewrite: { '^/ws': '' }
      }
    }
  }
};
