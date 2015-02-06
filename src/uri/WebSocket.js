/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Object notation for ws(s) protocol url
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.WebSocket
 */
xs.define(xs.Class, 'ns.WebSocket', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    Class.imports = [
        {QueryString: 'ns.QueryString'}
    ];

    Class.extends = 'ns.URI';

    /**
     * URL object constructor
     *
     * @constructor
     *
     * @param {String} [URI] URI, object is created from, or undefined, if starting from the beginning
     */
    Class.constructor = function (URI) {
        var me = this;

        //call parent constructor
        self.parent.apply(me, arguments);


        //set defaults from raw URI data
        //get raw reference
        var raw = me.private.raw;

        //scheme
        if (raw.scheme) {
            me.scheme = raw.scheme;
        }

        //parse given namespace into user, host and port
        if (raw.namespace) {
            var namespace = parseNamespace(raw.namespace);

            //host
            me.host = namespace.host;

            //port
            me.port = namespace.port;
        }

        //path
        me.path = raw.path;

        //parse query into params
        me.query = raw.query ? new imports.QueryString(raw.query) : new imports.QueryString();
    };

    /**
     * Allowed schemes array
     *
     * @ignore
     *
     * @type {String[]}
     */
    var schemes = [
        'ws',
        'wss'
    ];

    /**
     * URL scheme
     *
     * @property scheme
     *
     * @type {String}
     */
    Class.property.scheme = {
        set: function (scheme) {
            var me = this;

            xs.assert.ok(!xs.isDefined(scheme) || xs.isString(scheme), 'Given scheme "$scheme" is not a string', {
                $scheme: scheme
            }, WebSocketError);

            xs.assert.ok(!xs.isDefined(scheme) || schemes.indexOf(scheme) >= 0, 'Given scheme "$scheme" is not supported. Allowed are: $allowed', {
                $scheme: scheme,
                $allowed: schemes.join(', ')
            }, WebSocketError);

            //assign scheme
            me.private.scheme = scheme;
        }
    };

    /**
     * Regular expression for matching correct host name
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var hostRe = /^[^:\/@?.]+(?:\.[^:\/@?.]+)*$/;

    /**
     * URL host
     *
     * @property host
     *
     * @type {String}
     */
    Class.property.host = {
        set: function (host) {
            var me = this;

            xs.assert.ok(!xs.isDefined(host) || xs.isString(host), 'Given host "$host" is neither string nor undefined', {
                $host: host
            }, WebSocketError);

            //check host if string
            xs.assert.ok(!xs.isDefined(host) || hostRe.test(host), 'Given host "$host" is incorrect', {
                $host: host
            }, WebSocketError);

            //assign host
            me.private.host = host;
        }
    };

    /**
     * URL port
     *
     * @property port
     *
     * @type {Number}
     */
    Class.property.port = {
        set: function (port) {
            var me = this;

            xs.assert.ok(!xs.isDefined(port) || xs.isNumber(port), 'Given port "$port" is not a number', {
                $port: port
            }, WebSocketError);

            //assign port
            me.private.port = port;
        }
    };

    /**
     * Regular expression for matching correct url path
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var pathRe = /^[^?#]*$/;

    /**
     * URL path
     *
     * @property path
     *
     * @type {String}
     */
    Class.property.path = {
        set: function (path) {
            var me = this;

            xs.assert.string(path, 'Given path "$path" is not a string', {
                $path: path
            }, WebSocketError);

            //check path
            xs.assert.ok(pathRe.test(path), 'Given path "$path" is incorrect', {
                $path: path
            }, WebSocketError);

            //assign path
            me.private.path = path;
        }
    };

    /**
     * URL query
     *
     * @property query
     *
     * @type {String}
     */
    Class.property.query = {
        set: function (query) {
            var me = this;

            xs.assert.instance(query, imports.QueryString, 'Given query "$query" is not instance of "$QueryString"', {
                $query: query,
                $QueryString: imports.QueryString
            }, WebSocketError);

            //assign query
            me.private.query = query;
        }
    };

    Class.method.toString = function (encode) {
        var me = this;
        var string = '';

        //host
        if (me.private.host) {

            //scheme
            if (me.private.scheme) {
                string += me.private.scheme + '://';
            }

            string += me.private.host;

            //port
            if (me.private.port) {
                string += ':' + me.private.port;
            }
        }

        //path
        if (me.private.path) {
            string += me.private.path;

            //query
            if (Object.keys(me.private.query.params).length) {
                var queryString = arguments.length ? me.private.query.toString(encode) : me.private.query.toString();
                string += '?' + queryString;
            }
        }

        return string;
    };

    var namespaceParseRe = /^([^@:]+)(?::(\d+))?$/;

    var parseNamespace = function (namespace) {
        var raw = namespaceParseRe.exec(namespace);

        xs.assert.array(raw, 'Given namespace part "$namespace" is not correct', {
            $namespace: namespace
        }, WebSocketError);

        return {
            host: raw[1],
            port: raw[2] ? Number(raw[2]) : undefined
        };
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class WebSocketError
     */
    function WebSocketError(message) {
        this.message = self.label + '::' + message;
    }

    WebSocketError.prototype = new Error();

});