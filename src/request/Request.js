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

    var setHeaders = function (me) {
        //no headers setup is available for XDomainRequest
        if (!me.isXhr) {
            return;
        }

        var headers = me.headers,
            xhr = me.xhr;

        //if no content type specified, method is not GET and some data is going to be sent - specify
        if (!headers['Content-Type'] && me.method !== 'get' && xs.Object.size(me.params)) {
            headers['Content-Type'] = me.postContentType;
        }

        //if default XHR header not specified - specify it
        if (!headers['X-Requested-With']) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        xs.each(headers, function (header, name) {
            xhr.setRequestHeader(name, header);
        });
    };

    var handleProgress = function (request, event) {
        console.log('PROGRESS', 'request', request, 'event', event);
        if (request.isXhr && event.lengthComputable) {
            request.deferred.progress(event.loaded / event.total);
        }
    };

    var handleError = function (request, event) {
        console.log('ERROR', 'request', request, 'event', event);
    };

    var handleLoad = function (request, event) {
        console.log('LOAD', 'request', request, 'event', event);
    };

    var handleTimeout = function (request, event) {
        console.log('TIMEOUT', 'request', request, 'event', event);
    };
    var setEventHandlers = function (me) {
        var xhr = me.xhr;
        xhr.onprogress = function (event) {
            handleProgress(me, event);
        };
        xhr.onerror = function (event) {
            handleError(me, event);
        };
        xhr.onload = function (event) {
            handleLoad(me, event);
        };
        xhr.ontimeout = function (event) {
            handleTimeout(me, event);
        };
    };

    var complete = function () {

    };

    var createResponse = function () {

    };

    return {
        requires: [
            'xs.promise.Deferred',
            'xs.promise.Promise'
        ],
        extends: {
            observable: 'xs.util.Observable'
        },
        static: {
            methods: {
                fromQueryString: fromQueryString,
                toQueryString: toQueryString
            }
        },
        constructor: function (config) {
            var me = this;

            xs.isObject(config) || (config = {});

            //basics
            me.method = config.method;
            me.url = config.url;
            me.params = config.params;
            me.user = config.user;
            me.password = config.password;
            me.async = config.async;
            me.credentials = config.credentials;
            me.headers = config.headers;

            //request object
            me.isCrossDomain = me.url.host !== xs.location.host;
            if (me.isCrossDomain && xs.isIE && xs.browser.major <= 9) {
                me.xhr = new XDomainRequest();
                me.isXhr = false;
            } else {
                me.xhr = new XMLHttpRequest();
                me.isXhr = true;
            }

            //deferred request handler
            me.deferred = xs.create('xs.promise.Deferred');

            //request timeout
            me.timeout = config.timeout;
            me.timeoutId = setTimeout(function () {
                me.abort();
            }, me.timeout);

            //Non-GET requests default content type
            me.postContentType = config.postContentType;
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
                    } else if (xs.is(url, xs.uri.Url)) {
                        me.__set('url', url);
                    } else if (xs.isObject(url)) {
                        me.__set('url', xs.create('xs.uri.Url', url));
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
            },
            user: {
                set: function (user) {
                    xs.isString(user) || (this.__set('user', user));
                }
            },
            password: {
                set: function (password) {
                    xs.isString(password) || (this.__set('password', password));
                }
            },
            async: {
                set: function (async) {
                    this.__set('async', Boolean(async));
                },
                default: true
            },
            credentials: {
                set: function (credentials) {
                    this.__set('credentials', Boolean(credentials));
                },
                default: false
            },
            headers: {
                set: function (headers) {
                    xs.isObject(headers) || (headers = {});
                    this.__set('headers', headers);
                }
            },
            timeout: {
                set: function (timeout) {
                    var me = this;
                    if (xs.isNumeric(timeout)) {
                        timeout = Number(timeout);
                        me.__set('timeout', timeout);
                        me.xhr && (me.xhr.timeout = timeout);
                    }
                },
                default: 30000
            },
            timeoutId: 0,
            isCrossDomain: {
                set: function (isCrossDomain) {
                    this.__set('isCrossDomain', Boolean(isCrossDomain));
                },
                default: false
            },
            isXHr: {
                set: function (isXHr) {
                    this.__set('isXHr', Boolean(isXHr));
                },
                default: true
            },
            deferred: {
                set: function (deferred) {
                    xs.is(deferred, xs.promise.Deferred) && this.__set('deferred', deferred);
                },
                default: true
            },
            postContentType: {
                set: function (postContentType) {
                    xs.isString(postContentType) && this.__set('postContentType', postContentType);
                },
                default: 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        },
        methods: {
            open: function () {
                var me = this,
                    xhr = me.xhr,
                    method = me.method.toUpperCase(),
                    url = me.url.toURI();

                if (me.isXhr) {
                    xhr.open(method, url, me.async, me.user, me.password);
                } else {
                    xhr.open(method, url);
                }
            },
            send: function () {
                var me = this,
                    data = me.method == 'get' ? '' : toQueryString(me.params);

                setHeaders(me);
                setEventHandlers(me);

                me.xhr.send(data);

                return me.deferred.promise;
            },
            abort: function () {

            }
        }
    };
});