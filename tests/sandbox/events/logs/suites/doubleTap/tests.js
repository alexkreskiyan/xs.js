xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = {
        Reporter: 'log.Reporter'
    };

    Class.static.method.run = function () {
        var el = document.body;
        el.addEventListener('click', function (event) {
            imports.Reporter.report('doubleTap', 'click', event);
        });
        el.addEventListener('mousedown', function (event) {
            imports.Reporter.report('doubleTap', 'mousedown', event);
        });
        el.addEventListener('mouseup', function (event) {
            imports.Reporter.report('doubleTap', 'mouseup', event);
        });
        el.addEventListener('dblclick', function (event) {
            imports.Reporter.report('doubleTap', 'dblclick', event);
        });
        el.addEventListener('touchstart', function (event) {
            imports.Reporter.report('doubleTap', 'touchstart', event);
        });
        el.addEventListener('touchend', function (event) {
            imports.Reporter.report('doubleTap', 'touchend', event);
        });
        el.addEventListener('touchcancel', function (event) {
            imports.Reporter.report('doubleTap', 'touchcancel', event);
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