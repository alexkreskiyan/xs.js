xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Reporter: 'log.Reporter'
        }
    ];

    Class.static.method.run = function () {
        document.addEventListener('visibilitychange', function (event) {
            imports.Reporter.report('document', 'visibilitychange', event);
        });
        window.addEventListener('resize', function (event) {
            imports.Reporter.report('window', 'resize', event);
        });
        window.addEventListener('load', function (event) {
            imports.Reporter.report('window', 'load', event);
        });
        window.addEventListener('beforeunload', function (event) {
            imports.Reporter.report('window', 'beforeunload', event);
        });
        window.addEventListener('unload', function (event) {
            imports.Reporter.report('window', 'unload', event);
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
document.addEventListener('DOMContentLoaded', function (event) {
    'use strict';
    setTimeout(function () {
        log.Reporter.report('document', 'DOMContentLoaded', event);
    }, 500);
});