/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * @class xs.uri.Url represents url string
 */
'use strict';
xs.define('xs.uri.Url', function () {
    /**
     * Fetches all param indexes from param name
     * @type {RegExp}
     */
    var queryParamRe = /([^\[\]]+)/g;
    /**
     * process object from query string
     * @param {String} str
     * @returns {Object}
     */
    var fromQueryString = function (str) {
        var params = {},
            rawParams = str.split('&');

        xs.each(rawParams, function (param) {
            var pair = param.split('=');
            var names = pair[0].match(queryParamRe);
            if (names) {
                fromQueryObjects(params, names[0], pair[1], names.slice(1));
            }
        }, this);

        return params;
    };
    /**
     * processes object to query object
     * @param params
     * @param name
     * @param value
     * @param indexes
     * @returns {Array}
     */
    var fromQueryObjects = function (params, name, value, indexes) {
        if (indexes.length) {
            //if not this level value - go down
            params[name] || (params[name] = {});
            fromQueryObjects(params[name], indexes[0], value, indexes.slice(1));
        } else {
            //else - assign value
            params[name] = decodeURIComponent(value);
        }
    };
    /**
     * process object to query string
     * @param object
     * @returns {string}
     */
    var toQueryString = function (object) {
        var paramObjects = [],
            params = [];

        xs.each(object, function (value, name) {
            paramObjects = paramObjects.concat(toQueryObjects(name, value));
        }, this);

        xs.each(paramObjects, function (paramObject) {
            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(paramObject.value)));
        });

        return params.join('&');
    };
    /**
     * processes object to query object
     * @param name
     * @param object
     * @returns {Array}
     */
    var toQueryObjects = function (name, object) {
        var self = toQueryObjects,
            objects = [];

        if (xs.isArray(object) || xs.isObject(object)) {
            xs.each(object, function (value, param) {
                objects = objects.concat(self(name + '[' + param + ']', value, true));
            });
        } else {
            objects.push({
                name: name,
                value: object
            });
        }

        return objects;
    };
    /**
     * Protocols, class works with
     * @type {string[]}
     */
    var protocols = ['http', 'https', 'ftp'];
    var protocolRe = new RegExp('^(' + protocols.join('|') + '):\\\/\\\/');
    var hostRe = new RegExp('^(?:(?:' + protocols.join('|') + '):\\\/\\\/)?([А-яЁё\\\w0-9\\\.-]+)');
    var portRe = new RegExp('^(?:(?:' + protocols.join('|') + '):\\\/\\\/)?(?:[А-яЁё\\\w0-9\\\.-]+)(?::(\\\d+))');
    var pathReFull = new RegExp('^(?:(?:(?:' + protocols.join('|') + '):\\\/\\\/)?(?:[А-яЁё\\\w\\\.-]+)(?::\\\d+)?)?\\\/([^?^#]+)');
    var pathReRelative = new RegExp('^([^?^#]+)');
    var paramsRe = /\?([^#\?]+)/;
    var hashRe = /#(.+)/;

    var parse = function (raw) {
        //define basic data value to return
        var data = {
            protocol: null,
            host: '',
            port: null,
            path: '',
            params: {},
            hash: ''
        };

        //return data if raw is not string
        if (!xs.isString(raw)) {
            return data;
        }
        //decode raw string
        raw = decodeURI(raw);

        //detect protocol
        var protocol = protocolRe.exec(raw);
        xs.isArray(protocol) && (data.protocol = protocol[1]);

        //detect host
        var host = hostRe.exec(raw);
        xs.isArray(host) && (data.host = host[1]);

        //detect port
        var port = portRe.exec(raw);
        xs.isArray(port) && (data.port = port[1]);

        //detect path
        var path;
        if (xs.isArray(path = pathReFull.exec(raw))) {
            data.path = path[1];
        } else if (xs.isArray(path = pathReRelative.exec(raw))) {
            data.path = path[1];
        }

        //detect params
        var params = paramsRe.exec(raw);
        xs.isArray(params) && (data.params = fromQueryString(params[1]));

        //detect hash
        var hash = hashRe.exec(raw);
        xs.isArray(hash) && (data.hash = hash[1]);

        return data;
    };
    return {
        constructor: function (config) {
            var me = this,
                data = parse(config.url);
            me.protocol = data.protocol;
            me.host = data.host;
            me.port = data.port;
            me.path = data.path;
            me.params = data.params;
            me.hash = data.hash;
        },
        properties: {
            protocol: {
                set: function (protocol) {
                    if (!protocol) {
                        this.__set('protocol', null);
                    } else if (xs.isString(protocol) && xs.Array.has(protocols, protocol)) {
                        this.__set('protocol', protocol);
                    }
                }
            },
            host: {
                set: function (host) {
                    if (!host) {
                        this.__set('host', '');
                        return;
                    } else if (!xs.isString(host)) {
                        return;
                    }
                    var data = hostRe.exec(host);
                    if (data) {
                        this.__set('host', data[1]);
                    }
                }
            },
            port: {
                set: function (port) {
                    if (!port) {
                        this.__set('port', null);
                    } else if (xs.isNumeric(port)) {
                        this.__set('port', Number(port));
                    }
                }
            },
            path: {
                set: function (path) {
                    if (!path) {
                        this.__set('path', '');
                    } else if (xs.isString(path)) {
                        this.__set('path', path);
                    }
                }
            },
            params: {
                set: function (params) {
                    xs.isObject(params) || (params = {});
                    this.__set('params', params);
                }
            },
            hash: {
                set: function (hash) {
                    if (!hash) {
                        this.__set('hash', '');
                    } else if (xs.isString(hash)) {
                        this.__set('hash', hash);
                    }
                }
            }
        },
        methods: {
            fromString: function (raw) {
                var me = this,
                    data = parse(raw);
                me.protocol = data.protocol;
                me.host = data.host;
                me.port = data.port;
                me.path = data.path;
                me.params = data.params;
                me.hash = data.hash;
            },
            toString: function () {
                var me = this,
                    str = '';
                if (me.host) {
                    me.protocol && (str += me.protocol + '://');
                    str += me.host;
                    me.port && (str += ':' + me.port);
                    str += '/';
                }
                me.path && (str += me.path);
                me.params && (str += '?' + toQueryString(me.params));
                me.hash && (str += '#' + me.hash);
                return str;
            },
            toURI: function () {
                return encodeURI(this.toString());
            }
        }
    };
});