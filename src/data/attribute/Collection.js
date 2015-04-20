/**
 * Collection attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.data.attribute.Collection
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Collection', function (self, imports) {

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
     * Collection attribute constructor
     *
     * @param {Object} config
     */
    Class.constructor = function (config) {

        //assert, that config is an object
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });
    };

    /**
     * Collection `get` method
     *
     * @method get
     *
     * @param {xs.core.Collection} value incoming value
     * @param {Collection} format format index
     * @param {Object} [options] optional format options
     *
     * @return {Array|Object} transformed returned value
     */
    Class.method.get = function (value, format, options) {
        switch (format) {
            case imports.Format.Raw:
            case imports.Format.User:

                return value;
            case imports.Format.Storage:

                //if no options given or no format given - return value as is
                if (!options || !options.hasOwnProperty('array')) {

                    return value.toSource();
                }

                //assert, that array config is boolean
                self.assert.boolean(options.array, 'get - given array flag `$array` is not a boolean value', {
                    $array: options.array
                });

                return options.array ? value.values() : value.toSource();
        }
    };

    /**
     * Collection `set` method. Returns undefined value, converts iterable(array or object) to xs.core.Collection or fails with exception
     *
     * @method set
     *
     * @param {Array|Object} value incoming value
     *
     * @return {xs.core.Collection} transformed returned value
     */
    Class.method.set = function (value) {
        self.assert.ok(!xs.isDefined(value) || xs.isIterable(value), 'set - given value `$value` is not numeric', {
            $value: value
        });

        if (xs.isDefined(value)) {

            return new xs.core.Collection(value);
        }

        return this.default instanceof xs.core.Generator ? this.default.create() : this.default;
    };

});