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
        el.addEventListener('keypress', function (event) {
            var name = 'keypress';
            if (event.ctrlKey) {
                name += '_ctrl';
            } else if (event.altKey) {
                name += '_alt';
            } else if (event.shiftKey) {
                name += '_shift';
            } else if (event.metaKey) {
                name += '_meta';
            }
            imports.Reporter.report('key', name, event);
        });
        el.addEventListener('keyup', function (event) {
            var name = 'keyup';
            if (event.ctrlKey) {
                name += '_ctrl';
            } else if (event.altKey) {
                name += '_alt';
            } else if (event.shiftKey) {
                name += '_shift';
            } else if (event.metaKey) {
                name += '_meta';
            }
            imports.Reporter.report('key', name, event);
        });
        el.addEventListener('keydown', function (event) {
            var name = 'keydown';
            if (event.ctrlKey) {
                name += '_ctrl';
            } else if (event.altKey) {
                name += '_alt';
            } else if (event.shiftKey) {
                name += '_shift';
            } else if (event.metaKey) {
                name += '_meta';
            }
            imports.Reporter.report('key', name, event);
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