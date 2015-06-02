xs.define(xs.Class, 'ns.model.Entry', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls.data';

    Class.imports = [
        'xs.data.attribute.String',
        'xs.data.attribute.Number',
        'xs.data.attribute.Raw'
    ];

    Class.extends = 'xs.data.Model';

    Class.attributes = {
        user: 'xs.data.attribute.String',
        device: 'xs.data.attribute.String',
        time: 'xs.data.attribute.String',
        category: 'xs.data.attribute.String',
        name: 'xs.data.attribute.String',
        userAgent: 'xs.data.attribute.String',
        browserName: 'xs.data.attribute.String',
        browserVersion: 'xs.data.attribute.String',
        browserMajor: 'xs.data.attribute.Number',
        browserMinor: 'xs.data.attribute.Number',
        cpu: 'xs.data.attribute.Number',
        engineName: 'xs.data.attribute.String',
        engineVersion: 'xs.data.attribute.String',
        engineMajor: 'xs.data.attribute.Number',
        engineMinor: 'xs.data.attribute.Number',
        osName: 'xs.data.attribute.String',
        osVersion: 'xs.data.attribute.String',
        event: 'xs.data.attribute.Raw'
    };

});