const isGithubPage = process.env.BUILD_MODE === 'github-page';

const configs = {
  outputDir: isGithubPage ? 'demo' : 'dist',
  publicPath: isGithubPage ? 'https://yuskawu.github.io/map-apps/demo/' : '/',
  // productionSourceMap: isGithubPage ? false : true,
  css: {
    loaderOptions: {
      // import style for every component
      // https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
      stylus: {
        // import vairables.styl for every component
        // https://gist.github.com/milkmidi/e1693eb1434f16ae7253f364e4282386#file-webpack-config-js-L37
        import: ['~@/style/variables.styl']
      }
    }
  },
  pwa: {
    themeColor: '#75CFF0'
  }
};

module.exports = configs;
