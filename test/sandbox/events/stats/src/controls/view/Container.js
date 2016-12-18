xs.define(xs.Class, 'ns.view.Container', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = {
        Template: 'xs.resource.text.HTML'
    };

    Class.extends = 'xs.view.View';

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div xs-view-position="items"></div>'
        });
    });

});