const path = require('path');

module.exports = {
  port: 8006, //服务启动的端口号
  source: './docs/posts', //引入的md文件路径
  //htmlTemplate: path.resolve(__dirname, './template/template.html'),//页面模板
  exclude: /should-be-ignore/,
  theme: 'bisheng-theme-one',
  themeConfig: {
    home: '/',
    sitename: 'Fuck',
    tagline: 'The one theme for bisheng',
    // navigation: [{
    //   title: 'BiSheng',
    //   link: 'https://github.com/benjycui/bisheng',
    // }],
    // footer: 'Copyright and so on...',
    // hideBisheng: true,
    github: 'https://github.com/benjycui/bisheng',
  }
};