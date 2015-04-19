/**
 * Number attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.Number
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Number', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute';

    Class.imports = [
        {
            Format: 'ns.Format'
        }
    ];

    Class.implements = [ 'ns.IAttribute' ];

    /**
     * Number attribute constructor
     *
     * @param {Object} config
     */
    Class.constructor = function (config) {
        var me = this;

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });

        //set default value
        if (config.hasOwnProperty('default')) {
            me.default = config.default;
        }
    };

    /**
     * Number `get` method
     *
     * @method get
     *
     * @param {Number} value incoming value
     * @param {Number} format format index
     * @param {Object} [options] optional format options
     *
     * @return {Number} transformed returned value
     */
    Class.method.get = function (value, format, options) {
        switch (format) {
            case imports.Format.Raw:
            case imports.Format.Storage:

                return value;
            case imports.Format.User:
                //if no options given or no precision given - return value as is
                if (!options || !options.hasOwnProperty('precision')) {

                    return value;
                }

                //assert, that precision is number
                self.assert.number(options.precision, 'get - given precision `$precision` is not a number', {
                    $precision: options.precision
                });

                return Number(value.toFixed(options.precision));
        }
    };

    /**
     * Number `set` method. Tries to convert given value to number. If value is not numeric, error is thrown
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.method.set = function (value) {

        //assert, that value is either undefined or is numeric
        self.assert.ok(!xs.isDefined(value) || xs.isNumeric(value), 'set - given value `$value` is not numeric', {
            $value: value
        });

        return xs.isDefined(value) ? Number(value) : this.default;
    };

});