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
     * Protocols, class works with
     * @type {string[]}
     */
    var protocols = ['http', 'https', 'ftp'];
    var protocolRe = new RegExp('^(' + protocols.join('|') + '):\\\/\\\/');
    var hostRe = new RegExp('^(?:' + protocols.join('|') + '):\\\/\\\/([А-яЁё\\\w0-9\\\.-]+)');
    var portRe = new RegExp('^(?:' + protocols.join('|') + '):\\\/\\\/(?:[А-яЁё\\\w0-9\\\.-]+)(?::(\\\d+))');
    var pathReFull = new RegExp('^(?:(?:(?:' + protocols.join('|') + '):\\\/\\\/)(?:[А-яЁё\\\w\\\.-]+)(?::\\\d+)?)?\\\/([^?^#]+)');
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
        if (xs.isArray(protocol)) {
            data.protocol = protocol[1];
        } else {
            data.protocol = xs.location.protocol.substr(0, xs.location.protocol.length - 1);
        }

        //detect host
        var host = hostRe.exec(raw);
        if (xs.isArray(host)) {
            data.host = host[1];
        } else {
            data.host = xs.location.host;
        }

        //detect port
        var port = portRe.exec(raw);
        if (xs.isArray(port)) {
            data.port = port[1];
        } else {
            data.port = xs.location.port;
        }

        //detect path
        var path;
        if (xs.isArray(path = pathReFull.exec(raw))) {
            data.path = path[1];
        } else if (xs.isArray(path = pathReRelative.exec(raw))) {
            data.path = path[1];
        }

        //detect params
        var params = paramsRe.exec(raw);
        xs.isArray(params) && (data.params = xs.request.Request.fromQueryString(params[1]));

        //detect hash
        var hash = hashRe.exec(raw);
        xs.isArray(hash) && (data.hash = hash[1]);

        //

        return data;
    };
    return {
        constructor: function (config) {
            var me = this, data;
            xs.isObject(config) || (config = {});
            if (xs.isString(config.url)) {
                data = parse(config.url);
            } else {
                data = config;
            }
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
                    var me = this;
                    if (!host) {
                        me.__set('host', '');
                        return;
                    } else if (!xs.isString(host)) {
                        return;
                    }
                    me.__set('host', host);
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
                xs.Object.size(me.params) && (str += '?' + xs.request.Request.toQueryString(me.params));
                me.hash && (str += '#' + me.hash);
                return str;
            },
            toURI: function () {
                return encodeURI(this.toString());
            }
        }
    };
});