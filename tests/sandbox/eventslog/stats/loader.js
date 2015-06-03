xs.Loader.paths.add({
    xs: '/src',
    stats: 'src'
});
xs.nextTick(function () {
    xs.require('stats.App', xs.noop, xs.noop);
});
xs.onReady([ 'stats.App' ], function () {
    var app = window.app = new stats.App();
    app.run();
});