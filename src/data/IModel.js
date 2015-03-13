/**
 * Model base interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.IModel
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IModel', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data';

    Interface.constant = [
        'attributes',
        'proxy'
    ];

    Interface.static.property.primaryAttributes = {
        set: xs.noop
    };

    /**
     * Attribute constructor
     *
     * @constructor
     *
     * @param {Object} data attribute configuration object
     */
    Interface.constructor = function (data, proxy) {

    };

    /**
     * Model data accessor
     *
     * @readonly
     *
     * @property data
     *
     * @type {Object}
     */
    Interface.property.data = {
        set: xs.noop
    };

});