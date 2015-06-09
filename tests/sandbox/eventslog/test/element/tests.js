xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = {
        Reporter: 'log.Reporter'
    };

    Class.static.method.run = function () {
        var el = document.getElementById('input');
        el.addEventListener('focus', function (event) {
            imports.Reporter.report('element', 'focus', event);
        });
        el.addEventListener('blur', function (event) {
            imports.Reporter.report('element', 'blur', event);
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