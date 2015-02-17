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

    //define xs.env
    if (!xs.env) {
        xs.env = {};
    }

    /**
     * xs.env.Supports is singleton, providing info about context support of different capabilities
     *
     * @class xs.env.Supports
     *
     * @alternateClassName xs.supports
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     */
    xs.env.Supports = xs.supports = {};

    /**
     * xs.env.Supports.html is singleton, providing info about context support of different HTML capabilities
     *
     * @class xs.env.Supports.html
     *
     * @alternateClassName xs.supports.html
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     */
    xs.supports.html = (function () {
        var me = {};

        /**
         * Data attributes support flag
         *
         * @readonly
         *
         * @property dataAttributes
         *
         * @type {Boolean}
         */
        me.dataAttributes = Boolean(document.querySelector('body').dataset);

        return me;
    })();

    /**
     * xs.env.Supports.html is singleton, providing info about context support of different JavaScript capabilities
     *
     * @class xs.env.Supports.js
     *
     * @alternateClassName xs.supports.js
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     */
    xs.supports.js = (function () {
        var me = {};

        /**
         * Touch events support flag
         *
         * @readonly
         *
         * @property touchEvents
         *
         * @type {Boolean}
         */
        me.touchEvents = navigator.hasOwnProperty('maxTouchPoints') && navigator.maxTouchPoints > 0;

        /**
         * Pointer events support flag
         *
         * @readonly
         *
         * @property pointerEvents
         *
         * @type {Boolean}
         */
        me.pointerEvents = navigator.hasOwnProperty('msMaxTouchPoints') && navigator.msMaxTouchPoints > 0;

        /**
         * WebGL support flag
         *
         * @readonly
         *
         * @property WebGL
         *
         * @type {Boolean}
         */
        me.WebGL = Boolean(root.WebGLRenderingContext);

        return me;
    })();

})(window, 'xs');