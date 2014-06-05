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
 * @class xs.request.Request represents request object
 */
'use strict';
xs.define('xs.request.Request', function () {
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
     * Request methods, class, class works with
     * @type {string[]}
     */
    var methods = ['get', 'post', 'put', 'delete'];

    return {
        static: {
            methods: {
                fromQueryString: fromQueryString,
                toQueryString: toQueryString
            }
        },
        constructor: function (config) {
            var me = this;

            xs.isObject(config) || (config = {});

            me.method = config.method;
            me.url = config.url;
            me.params = config.params;
        },
        properties: {
            method: {
                set: function (method) {
                    var me = this;

                    if (xs.isString(method)) {
                        method = method.toLowerCase();
                        xs.Array.has(methods, method) || (method = 'get');
                    } else {
                        method = 'get';
                    }
                    me.__set('method', method);

                    if (!me.url) {
                        return;
                    }
                    me.url.params = method == 'get' ? me.params : {};
                }
            },
            url: {
                set: function (url) {
                    var me = this;

                    if (xs.isString(url)) {
                        me.__set('url', xs.create('xs.uri.Url', {url: url}));
                    } else if (xs.is(xs.uri.Url, url)) {
                        me.__set('url', url);
                    }

                    me.method == 'get' && me.url && (me.url.params = me.params);
                }
            },
            params: {
                set: function (params) {
                    var me = this;

                    xs.isObject(params) || (params = {});
                    me.__set('params', params);

                    if (!me.url) {
                        return;
                    }
                    me.url.params = me.method == 'get' ? params : {};
                }
            }
        }
    };
});