module.exports = {
  siteName: 'AntD Admin',
  copyright: 'Ant Design Admin  ©2020 zuiidea',
  logoPath: '/logo.svg',
  apiPrefix: '',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'pt-br',
        title: 'Português',
        flag: '/portugal.svg',
      },
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'en',
  },
  url: {
    dev: {
      API_URL: 'https://test-overseas.91dbq.com/boss-gateway-sg',
    },
    prod: {
      API_URL: 'https://test-overseas.91dbq.com/boss-gateway-sg',
    }
  }
}
