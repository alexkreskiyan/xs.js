/**
 * Object notation for ws(s) protocol url
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.WebSocket
 *
 * @extends xs.uri.URI
 */
xs.define(xs.Class, 'ns.WebSocket', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    Class.imports = [
        {
            IQuery: 'ns.query.IQuery'
        }
    ];

    Class.extends = 'ns.URI';

    /**
     * URL object constructor
     *
     * @constructor
     *
     * @param {String} [URI] URI, object is created from, or undefined, if starting from the beginning
     * @param {xs.uri.query.IQuery} Query Query constructor, URI query is parsed with
     */
    Class.constructor = function (URI, Query) {
        var me = this;

        //assert, that at least Query is given
        self.assert.ok(arguments.length, 'constructor - no Query given');

        //call parent constructor
        if (arguments.length === 1) {
            self.parent.call(me);

            //reassign Query
            Query = URI;
        } else {
            self.parent.call(me, URI);
        }

        //assert, that Query is a class
        self.assert.class(Query, 'constructor - given Query class `$Query` is not a class', {
            $Query: Query
        });

        //assert, that Query is processed
        self.assert.processed(Query, 'constructor - given Query class `$Query` is not processed. Add it to imports, if needed', {
            $Query: Query
        });

        //assert, that Query implements imports.IQuery
        self.assert.ok(Query.implements(imports.IQuery), 'constructor - given Query class `$Query` does not implement base query interface `$IQuery`', {
            $Query: Query,
            $IQuery: imports.IQuery
        });

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
        me.query = raw.query ? new Query(raw.query) : new Query();
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

            self.assert.implements(query, imports.IQuery, 'query - given query `$query` is not implementing `$IQuery`', {
                $query: query,
                $IQuery: imports.IQuery
            });

            self.assert.processed(query.self, 'query - given query class `$Query` is not processed', {
                $Query: query.self
            });

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

        self.assert.array(raw, 'parseNamespace - given namespace part `$namespace` is not correct', {
            $namespace: namespace
        });

        return {
            host: raw[ 1 ],
            port: raw[ 2 ] ? Number(raw[ 2 ]) : undefined
        };
    };

});