Package.describe({ // eslint-disable-line
  name: 'ya-react-form',
  version: '0.0.1',
  summary: 'Yet another react form package',
  documentation: 'README.md',
});

Package.onUse(function (api) { // eslint-disable-line
  api.versionsFrom('1.2.1');
  api.use(['ecmascript']);
  api.mainModule('src/index.js', 'client');
});

Package.onTest(function(api) { // eslint-disable-line
});
