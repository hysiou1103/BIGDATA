module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.ris.gov.tw/rs-opendata/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        ws: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/BIGDATA/'
    : '/'
}
