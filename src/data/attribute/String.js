/**
 * String attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.String
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.String', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute';

    Class.implements = ['ns.IAttribute'];

    /**
     * String attribute constructor
     *
     * @param {Object} config
     */
    Class.constructor = function (config) {
        var me = this;

        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        if (config.hasOwnProperty('default')) {
            me.default = config.default;
        }
    };

    /**
     * String `get` method
     *
     * @method get
     *
     * @param {String} value incoming value
     * @param {Number} format format index
     *
     * @return {String} transformed returned value
     */
    Class.method.get = function (value, format) {
        return value;
    };

    /**
     * String `set` method. Converts any given value to string
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.method.set = function (value) {
        return xs.isDefined(value) ? String(value) : this.default;
    };

});