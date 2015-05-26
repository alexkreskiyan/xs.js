xs.define(xs.Class, 'tests.Demo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Request: 'xs.transport.xhr.Request'
        }
    ];

    Class.method.run = function () {
        var el = document.getElementById('interaction');
        console.log(el);
    };

}, function (App) {
    'use strict';

    (new App()).run();
});
xs.Loader.paths.add('xs', '/src');