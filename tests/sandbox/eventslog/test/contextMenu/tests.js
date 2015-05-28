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
        el.addEventListener('contextmenu', function (event) {
            imports.Reporter.report('contextMenu', 'contextmenu', event);
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