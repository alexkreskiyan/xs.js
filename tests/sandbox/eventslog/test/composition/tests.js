xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Reporter: 'log.Reporter'
        }
    ];

    Class.static.method.run = function () {
        var el = document.querySelector('#test>textarea');
        el.addEventListener('compositionstart', function (event) {
            imports.Reporter.report('content', 'compositionstart', event);
        });
        el.addEventListener('compositionupdate', function (event) {
            imports.Reporter.report('content', 'compositionupdate', event);
        });
        el.addEventListener('compositionend', function (event) {
            imports.Reporter.report('content', 'compositionend', event);
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