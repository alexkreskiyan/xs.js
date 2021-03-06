'use strict';

//define xs.env
xs.getNamespace(xs, 'env');

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
    me.dataAttributes = Boolean(document.createElement('div').dataset);

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
    me.touchEvents = 'TouchEvent' in window;

    /**
     * Pointer events support flag
     *
     * @readonly
     *
     * @property pointerEvents
     *
     * @type {Boolean}
     */
    me.pointerEvents = 'PointerEvent' in window || 'MSPointerEvent' in window;

    /**
     * WebGL support flag
     *
     * @readonly
     *
     * @property WebGL
     *
     * @type {Boolean}
     */
    me.WebGL = Boolean(window.WebGLRenderingContext);

    return me;
})();