/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Object notation for http(s) protocol url
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.HTTP
 */
xs.define(xs.Class, 'ns.HTTP', function (self, ns, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    Class.imports = [
        {QueryString: 'ns.QueryString'}
    ];

    Class.extends = 'ns.URI';

    /**
     * Default HTTP port
     *
     * @static
     *
     * @readonly
     *
     * @property defaultPort
     *
     * @type {number}
     */
    Class.constant.defaultPort = 80;

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
            var namespace = _parseNamespace(raw.namespace);

            //user
            me.user = namespace.user;

            //host
            me.host = namespace.host;

            //port
            me.port = namespace.port;
        }

        //path
        me.path = raw.path;

        //parse query into params
        me.query = raw.query ? new imports.QueryString(raw.query) : new imports.QueryString();

        //hash
        me.hash = raw.hash;
    };

    /**
     * Allowed schemes array
     *
     * @ignore
     *
     * @type {String[]}
     */
    var schemes = [
        'http',
        'https'
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
            }, HTTPError);

            xs.assert.ok(!xs.isDefined(scheme) || schemes.indexOf(scheme) >= 0, 'Given scheme "$scheme" is not supported. Allowed are: $allowed', {
                $scheme: scheme,
                $allowed: schemes.join(', ')
            }, HTTPError);

            //assign scheme
            me.private.scheme = scheme;
        }
    };

    /**
     * Regular expression for matching correct user name
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var userRe = /^[^@]+$/;

    /**
     * URL username
     *
     * @property user
     *
     * @type {String}
     */
    Class.property.user = {
        set: function (user) {
            var me = this;

            xs.assert.ok(!xs.isDefined(user) || xs.isString(user), 'Given user "$user" is not a string', {
                $user: user
            }, HTTPError);

            //check user if string
            xs.assert.ok(!xs.isDefined(user) || userRe.test(user), 'Given host "$user" is incorrect', {
                $user: user
            }, HTTPError);

            //assign user
            me.private.user = user;
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
            }, HTTPError);

            //check host if string
            xs.assert.ok(!xs.isDefined(host) || hostRe.test(host), 'Given host "$host" is incorrect', {
                $host: host
            }, HTTPError);

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
            }, HTTPError);

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
            }, HTTPError);

            //check path
            xs.assert.ok(pathRe.test(path), 'Given path "$path" is incorrect', {
                $path: path
            }, HTTPError);

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
            }, HTTPError);

            //assign query
            me.private.query = query;
        }
    };

    /**
     * URL hash
     *
     * @property hash
     *
     * @type {String}
     */
    Class.property.hash = {
        set: function (hash) {
            var me = this;

            xs.assert.ok(!xs.isDefined(hash) || xs.isString(hash), 'Given hash "$hash" is not a string', {
                $hash: hash
            }, HTTPError);

            //assign hash
            me.private.hash = hash;
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

            //user
            if (me.private.user) {
                string += me.private.user + '@';
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

            //hash
            if (me.private.hash) {
                string += '#' + me.private.hash;
            }
        }

        return string;
    };

    var namespaceParseRe = /^(?:([^@:]+)@)?([^@:]+)(?::(\d+))?$/;

    var _parseNamespace = function (namespace) {
        var raw = namespaceParseRe.exec(namespace);

        xs.assert.array(raw, 'Given namespace part "$namespace" is not correct', {
            $namespace: namespace
        }, HTTPError);

        return {
            user: raw[1],
            host: raw[2],
            port: raw[3] ? Number(raw[3]) : undefined
        };
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class HTTPError
     */
    function HTTPError(message) {
        this.message = self.label + '::' + message;
    }

    HTTPError.prototype = new Error();

});