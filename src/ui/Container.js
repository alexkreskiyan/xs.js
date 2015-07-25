xs.define(xs.Class, 'ns.Container', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ui';

    Class.imports = {
        Template: 'xs.resource.text.HTML'
    };

    Class.extends = 'xs.view.View';

    Class.mixins.available = 'ns.behavior.Available';

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div xs-view-position="items"></div>'
        });
    });

});