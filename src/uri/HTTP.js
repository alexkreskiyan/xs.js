/**
 * Object notation for http(s) protocol url
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.HTTP
 *
 * @extends xs.uri.URI
 */
xs.define(xs.Class, 'ns.HTTP', function (self, imports) {

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

            self.assert.ok(!xs.isDefined(scheme) || xs.isString(scheme), 'scheme - given scheme `$scheme` is not a string', {
                $scheme: scheme
            });

            self.assert.ok(!xs.isDefined(scheme) || schemes.indexOf(scheme) >= 0, 'scheme - given scheme `$scheme` is not supported. Allowed are: $allowed', {
                $scheme: scheme,
                $allowed: schemes.join(', ')
            });

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

            self.assert.ok(!xs.isDefined(user) || xs.isString(user), 'user - given user `$user` is not a string', {
                $user: user
            });

            //check user if string
            self.assert.ok(!xs.isDefined(user) || userRe.test(user), 'user - given user `$user` is incorrect', {
                $user: user
            });

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

            self.assert.ok(!xs.isDefined(host) || xs.isString(host), 'host - given host `$host` is neither string nor undefined', {
                $host: host
            });

            //check host if string
            self.assert.ok(!xs.isDefined(host) || hostRe.test(host), 'host - given host `$host` is incorrect', {
                $host: host
            });

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

            self.assert.ok(!xs.isDefined(port) || xs.isNumber(port), 'port - given port `$port` is not a number', {
                $port: port
            });

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

            self.assert.string(path, 'path - given path `$path` is not a string', {
                $path: path
            });

            //check path
            self.assert.ok(pathRe.test(path), 'path - given path `$path` is incorrect', {
                $path: path
            });

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

            self.assert.instance(query, imports.QueryString, 'query - given query `$query` is not instance of `$QueryString`', {
                $query: query,
                $QueryString: imports.QueryString
            });

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

            self.assert.ok(!xs.isDefined(hash) || xs.isString(hash), 'hash - given hash `$hash` is not a string', {
                $hash: hash
            });

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

    var parseNamespace = function (namespace) {
        var raw = namespaceParseRe.exec(namespace);

        self.assert.array(raw, 'parseNamespace - given namespace part `$namespace` is not correct', {
            $namespace: namespace
        });

        return {
            user: raw[1],
            host: raw[2],
            port: raw[3] ? Number(raw[3]) : undefined
        };
    };

});