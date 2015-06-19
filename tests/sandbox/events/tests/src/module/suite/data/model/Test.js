xs.define(xs.Class, 'ns.data.model.Test', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.requires = [
        'xs.data.attribute.String',
        'xs.data.attribute.Collection'
    ];

    Class.extends = 'xs.data.Model';

    Class.attributes = {
        name: {
            class: 'xs.data.attribute.String',
            primary: true
        },
        stages: 'xs.data.attribute.Collection'
    };

});