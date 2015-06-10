'use strict';
xs.Loader.paths.add({
    xs: '/src',
    tests: 'src'
});
xs.nextTick(function () {
    xs.require('tests.App', xs.noop, xs.noop);
});
xs.onReady([ 'tests.App' ], function () {
    var App = xs.ContractsManager.get('tests.App');
    var app = window.app = new App();
    app.run();
});