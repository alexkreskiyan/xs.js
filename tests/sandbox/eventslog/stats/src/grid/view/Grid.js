xs.define(xs.Class, 'ns.view.Grid', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.View';

    Class.imports = [
        {
            Template: 'xs.resource.text.HTML'
        }
    ];

    Class.positions = [
        'controls',
        'header',
        'rows'
    ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div><div xs-view-position="controls" class="controls"></div><div xs-view-position="header" class="header"></div><div xs-view-position="rows" class="rows"></div></div>'
        });
    });

});