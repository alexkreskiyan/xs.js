/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * String attribute
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
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
     *
     * @param {Object} config
     */
    Class.constructor = function (config) {
        self.assert.object(config, 'constructor - given config `$config` is not an object', {
            $config: config
        });
    };

    /**
     * String `get` method
     *
     * @method get
     *
     * @param {String} value incoming value
     * @param {Object} options value achieving options
     *
     * @return {String} transformed returned value
     */
    Class.method.get = function (value, options) {
        return value;
    };

    /**
     * Attribute set method.
     * Returns given value according to internal transformation rule for scenario `external => internal`
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.method.set = function (value) {
        return value + '';
    };

});