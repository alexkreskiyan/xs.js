/**
 * Boolean attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.Boolean
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Boolean', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute';

    Class.implements = [ 'ns.IAttribute' ];

    /**
     * Boolean attribute constructor
     *
     * @param {Object} config
     */
    Class.constructor = function (config) {
        var me = this;

        //return if no config
        if (!arguments.length) {

            return;
        }

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //set default value
        if (config.hasOwnProperty('default')) {

            //assert, that config.default is undefined or a boolean
            self.assert.ok(!xs.isDefined(config.default) || xs.isBoolean(config.default), 'constructor - given config.default `$default` is not undefined or a boolean', {
                $default: config.default
            });

            me.default = config.default;
        }
    };

    /**
     * Boolean `get` method
     *
     * @method get
     *
     * @param {String} value incoming value
     * @param {Boolean} format format index
     * @param {Object} [options] optional format options
     *
     * @return {String} transformed returned value
     */
    Class.method.get = function (value, format, options) {

        //assert, that value is undefined or a boolean
        self.assert.ok(!xs.isDefined(value) || xs.isBoolean(value), 'get - given value `$value` is not undefined or a boolean', {
            $value: value
        });

        return value;
    };

    /**
     * Boolean `set` method. Returns undefined value or boolean representation of any other value
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.method.set = function (value) {

        return xs.isDefined(value) ? Boolean(value) : this.default;
    };

});