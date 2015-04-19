/**
 * Raw attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.Raw
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Raw', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute';

    Class.implements = [ 'ns.IAttribute' ];

    /**
     * Raw attribute constructor
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
     * Raw `get` method
     *
     * @method get
     *
     * @param {String} value incoming value
     * @param {Raw} format format index
     * @param {Object} [options] optional format options
     *
     * @return {String} transformed returned value
     */
    Class.method.get = function (value, format, options) {
        return value;
    };

    /**
     * Raw `set` method. Try's to convert given value to number. If value is not numeric, error is thrown
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.method.set = function (value) {
        self.assert.ok(!xs.isDefined(value) || xs.isNumeric(value), 'set - given value `$value` is not numeric', {
            $value: value
        });

        return xs.isDefined(value) ? Number(value) : this.default;
    };

});