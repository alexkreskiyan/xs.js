'use strict';
xs.Loader.paths.add({
    xs: '/src',
    stats: 'src'
});
xs.nextTick(function () {
    xs.require('stats.App', xs.noop, xs.noop);
});
xs.onReady([ 'stats.App' ], function () {
    var App = xs.ContractsManager.get('stats.App');
    var app = window.app = new App();
    app.run();
});