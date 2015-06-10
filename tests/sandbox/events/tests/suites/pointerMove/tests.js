xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = {
        Reporter: 'log.Reporter'
    };

    Class.static.method.run = function () {
        var el = document.querySelector('#test>div');
        el.addEventListener('mousemove', function (event) {
            imports.Reporter.report('pointerMove', 'mousemove', event);
        });
        el.addEventListener('mouseenter', function (event) {
            imports.Reporter.report('pointerMove', 'mouseenter', event);
        });
        el.addEventListener('mouseleave', function (event) {
            imports.Reporter.report('pointerMove', 'mouseleave', event);
        });
        el.addEventListener('mouseover', function (event) {
            imports.Reporter.report('pointerMove', 'mouseover', event);
        });
        el.addEventListener('mouseout', function (event) {
            imports.Reporter.report('pointerMove', 'mouseout', event);
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