/**
 * Date attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.Date
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Date', function (self, imports) {

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
     * Date attribute constructor
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
     * Date `get` method
     *
     * @method get
     *
     * @param {String} value incoming value
     * @param {Date} format format index
     * @param {Object} [options] optional format options
     *
     * @return {String} transformed returned value
     */
    Class.method.get = function (value, format, options) {
        switch (format) {
            case imports.Format.Raw:

                return value;
            case imports.Format.Storage:

                return value.valueOf();
            case imports.Format.User:

                //if no options given or no format given - return value as is
                if (!options || !options.hasOwnProperty('format')) {

                    return value;
                }

                //assert, that format is a string
                self.assert.string(options.format, 'get - given format `$format` is not a string', {
                    $format: options.format
                });

                return formatDate(value, options.format);
        }

        return value;
    };

    /**
     * Date `set` method. Try's to convert given value to number. If value is not numeric, error is thrown
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

    var formatDate = function (date, format) {
        var value = format;

        //day, leading zero
        if (value.indexOf('d') >= 0) {
            value = value.split('d').join(leadZero(date.getDate(), 2));
        }

        //month, leading zero, 01-12
        if (value.indexOf('m') >= 0) {
            value = value.split('m').join(leadZero(date.getMonth() + 1, 2));
        }

        //year, 4 digits
        if (value.indexOf('Y') >= 0) {
            value = value.split('Y').join(date.getFullYear());
        }

        //day num, 1-Monday, 7-Sunday
        if (value.indexOf('N') >= 0) {
            value = value.split('N').join((date.getDay() + 6) % 7 + 1);
        }

        //day num, 0-Sunday, 6-Saturday
        if (value.indexOf('W') >= 0) {
            value = value.split('W').join(date.getDay());
        }

        //am/pm
        if (value.indexOf('a') >= 0) {
            value = value.split('a').join(date.getHours() < 12 ? 'am' : 'pm');
        }

        //AM/PM
        if (value.indexOf('A') >= 0) {
            value = value.split('A').join(date.getHours() < 12 ? 'AM' : 'PM');
        }

        //01-12 hour
        if (value.indexOf('G') >= 0) {
            value = value.split('G').join(leadZero(((date.getHours() + 11) % 12) + 1, 2));
        }

        //00-23 hour
        if (value.indexOf('H') >= 0) {
            value = value.split('H').join(leadZero(date.getHours(), 2));
        }

        //00-59 minute
        if (value.indexOf('i') >= 0) {
            value = value.split('i').join(leadZero(date.getMinutes(), 2));
        }

        //00-59 second
        if (value.indexOf('s') >= 0) {
            value = value.split('s').join(leadZero(date.getSeconds(), 2));
        }

        //000-999 millisecond
        if (value.indexOf('u') >= 0) {
            value = value.split('u').join(leadZero(date.getMilliseconds(), 3));
        }

        return value;
    };

    var leadZero = function (value, length) {
        //convert value to string
        value = value.toString();

        while (value.length < length) {
            value = '0' + value;
        }

        return value;
    };

});