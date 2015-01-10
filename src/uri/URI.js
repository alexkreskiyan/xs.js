/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * URI Object notation abstract class. Provides basics for all URI scheme-specific implementations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.URI
 */
xs.define(xs.Class, 'ns.URI', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    Class.abstract = true;

    /**
     * Regular expression for basic URI parsing
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var parseRe = /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

    /**
     * URI object constructor
     *
     * @constructor
     *
     * @param {String} [uri] uri, object is created from, or undefined, if starting from the beginning
     */
    Class.constructor = function (uri) {
        var me = this;

        //assert, that uri is either undefined or string
        xs.assert.ok(!arguments.length || xs.isString(uri));
    };

});