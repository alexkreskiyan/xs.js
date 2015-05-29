xs.define(xs.Class, 'ns.Container', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = [ 'xs.resource.text.HTML' ];

    Class.extends = 'xs.view.View';

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new xs.resource.text.HTML({
            data: '<div><xs-view-position name="items"/></div>'
        });
    });

});