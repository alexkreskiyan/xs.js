xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = {
        Reporter: 'log.Reporter'
    };

    Class.static.method.run = function () {
        var el = document.querySelector('#test>textarea');
        el.addEventListener('input', function (event) {
            imports.Reporter.report('content', 'input', event);
        });
        el.addEventListener('change', function (event) {
            imports.Reporter.report('content', 'change', event);
        });
        el.addEventListener('select', function (event) {
            imports.Reporter.report('content', 'select', event);
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