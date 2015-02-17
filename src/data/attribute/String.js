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
xs.define(xs.Class, 'ns.String', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute';

    Class.implements = ['ns.IAttribute'];

    /**
     * String `get` method
     *
     * @static
     *
     * @method get
     *
     * @param {String} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.static.method.get = function (value) {
        return value;
    };

    /**
     * Attribute set method.
     * Returns given value according to internal transformation rule for scenario `external => internal`
     *
     * @static
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {String} transformed returned value
     */
    Class.static.method.set = function (value) {
        return value + '';
    };

});