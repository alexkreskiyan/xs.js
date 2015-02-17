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
 * @abstract
 *
 * @class xs.uri.URI
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.URI', function (self) {

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
     * @param {String} [URI] URI, object is created from, or undefined, if starting from the beginning
     */
    Class.constructor = function (URI) {
        var me = this;

        //assert, that uri is either undefined or string
        self.assert.ok(!arguments.length || xs.isString(URI), 'Given URI `$URI` is not a string', {
            $URI: URI
        });

        //convert undefined to empty string
        if (!URI) {
            URI = '';
        }

        //save raw parsing info
        var data = parseRe.exec(decodeURI(URI));

        self.assert.array(data, 'Given string `$URI` is correct URI', {
            $URI: URI
        });

        me.private.raw = {
            scheme: data[1],
            namespace: data[2],
            path: data[3],
            query: data[4],
            hash: data[5]
        };
    };

});