xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Reporter: 'log.Reporter'
        }
    ];

    Class.static.method.run = function () {
        var el = window;
        el.addEventListener('resize', function (event) {
            imports.Reporter.report('window', 'resize', event);
        });
        el.addEventListener('window', function (event) {
            imports.Reporter.report('window', 'visibilitychange', event);
        });
        el.addEventListener('load', function (event) {
            imports.Reporter.report('window', 'load', event);
        });
        el.addEventListener('beforeunload', function (event) {
            imports.Reporter.report('window', 'beforeunload', event);
        });
        el.addEventListener('unload', function (event) {
            imports.Reporter.report('window', 'unload', event);
        });
        setTimeout(handleResource, 100);
    };

    function handleResource() {
        var resource = document.createElement('link');
        resource.type = 'text/css';
        resource.rel = 'stylesheet';
        resource.href = 'style.css';
        resource.addEventListener('load', function (event) {
            imports.Reporter.report('resource', 'load', event);
        });
        resource.addEventListener('beforeunload', function (event) {
            imports.Reporter.report('resource', 'beforeunload', event);
        });
        resource.addEventListener('unload', function (event) {
            imports.Reporter.report('resource', 'unload', event);
        });
        resource.onload = function () {
            document.head.removeChild(resource);
        };
        document.head.appendChild(resource);
    }

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