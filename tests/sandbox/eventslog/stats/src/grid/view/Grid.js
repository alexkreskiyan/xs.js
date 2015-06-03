xs.define(xs.Class, 'ns.view.Grid', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.View';

    Class.imports = [
        {
            Template: 'xs.resource.text.HTML'
        },
        {
            'event.Select': 'ns.view.event.Select'
        }
    ];

    Class.positions = [
        'header',
        'rows'
    ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div><div xs-view-position="header"></div><div xs-view-position="rows"></div></div>'
        });
    });

});