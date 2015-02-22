/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * xs.data.Operation represents operation, performed by proxy with data
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.Operation
 *
 * @extends xs.class.Base
 *
 * @mixins xs.ux.Promise
 */
xs.define(xs.Class, 'ns.Operation', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {Types: 'ns.operation.Types'}
    ];

    Class.mixins.promise = 'xs.ux.Promise';

    Class.constructor = function (type, data) {
        var me = this;

        //verify type
        self.assert.ok(imports.Types.has(type), 'constructor - given operation type `$type` is not supported', {
            $type: type
        });

        //verify data, if given
        self.assert.ok(arguments.length === 1 || xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });


        //set privates

        //type
        me.private.type = type;

        //data
        me.private.data = data;

        //call observable constructor
        self.mixins.promise.call(me);
    };

    Class.property.type = {
        set: xs.emptyFn
    };

    Class.property.data = {
        set: xs.emptyFn
    };

});