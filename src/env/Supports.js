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
    xs.env.Supports = xs.supports = (function () {

    })();
})(window, 'xs');