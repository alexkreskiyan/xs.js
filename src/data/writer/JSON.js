/**
 * xs.data.reader.JSON is reader, that processes JSON string into JS natives
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.writer.JSON
 */
xs.define(xs.Class, 'ns.JSON', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.writer';

    Class.implements = [ 'ns.IWriter' ];

    Class.constructor = function (config) {
        var me = this;

        //config must be an object (if given)
        self.assert.ok(!arguments.length || xs.isObject(config), 'constructor - given `$config` is not an object', {
            $config: config
        });

        if (config && config.hasOwnProperty('select')) {

            //assert, that select is a function
            self.assert.fn(config.select, 'constructor - given `$select` is not a function', {
                $select: config.select
            });

            me.private.select = config.select;

        } else {

            me.private.select = selectAll;
        }
    };

    Class.method.write = function (data) {

        return JSON.stringify(this.private.select(data));
    };

    function selectAll(data) {

        return data;
    }

});