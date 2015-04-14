/**
 * xs.data.reader.JSON is reader, that processes JSON string into JS natives
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.reader.JSON
 *
 * @extends xs.data.reader.Reader
 */
xs.define(xs.Class, 'ns.JSON', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.reader';

    Class.implements = [ 'ns.IReader' ];

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

            me.select = config.select;

        } else {

            me.select = selectAll;
        }
    };

    Class.method.read = function (raw) {
        self.assert.string(raw, 'read - given raw data `$raw` is not a string', {
            $raw: raw
        });

        return JSON.parse(raw);
    };

    function selectAll(data) {
        return data;
    }

});