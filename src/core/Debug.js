/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    //define xs.core
    xs.core || (xs.core = {});

    /**
     * xs.core.Debug is private singleton, adding debug capabilities to framework.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.core.Debug
     *
     * @singleton
     */
    var debug = xs.core.Debug = new (function () {
        var me = this;

        /**
         * Debug state
         *
         * @type {Boolean}
         */
        me.active = true;

        /**
         * Logs message to console
         *
         * For example:
         *
         *     xs.log('my message');
         *
         * @method log
         *
         * @param {String...} message Messages, being logged
         */
        me.log = function (message) {
            if (!xs.core.Debug.active) {
                return;
            }
            console.log.apply(console, arguments);
        };
    });

    //assign debug flag
    xs.Attribute.define(xs, 'debug', {
        get: function () {
            return xs.core.Debug.active;
        },
        set: function (value) {
            xs.core.Debug.active = value;
        },
        configurable: false
    });

    xs.extend(xs, {
        log:debug.log
    });
})(window, 'xs');