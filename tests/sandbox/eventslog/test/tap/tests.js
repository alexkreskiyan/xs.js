xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Reporter: 'log.Reporter'
        }
    ];

    Class.static.method.run = function () {
        var el = document.body;
        el.addEventListener('click', function (event) {
            imports.Reporter.report('tap', 'click', event);
        });
        el.addEventListener('mousedown', function (event) {
            imports.Reporter.report('tap', 'mousedown', event);
        });
        el.addEventListener('mouseup', function (event) {
            imports.Reporter.report('tap', 'mouseup', event);
        });
        el.addEventListener('touchstart', function (event) {
            imports.Reporter.report('tap', 'touchstart', event);
        });
        el.addEventListener('touchend', function (event) {
            imports.Reporter.report('tap', 'touchend', event);
        });
        el.addEventListener('touchcancel', function (event) {
            imports.Reporter.report('tap', 'touchcancel', event);
        });
    };

}, function (App) {
    'use strict';

    App.run();
});
xs.Loader.paths.add({
    xs: '/src',
    log: '../..'
});