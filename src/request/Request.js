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
    var queryParamIndexesRe = /\[([^\[\]]*)\]/g;
    var queryParamNameRe = /^([^\[\]]+)/g;
    /**
     * Removes brackets in given index
     * @param index
     * @returns {Array}
     */
    var removeIndexBrackets = function (index) {
        return index.slice(1, index.length - 1)
    };
    /**
     * process object from query string
     * @param {String} str
     * @returns {Object}
     */
    var fromQueryString = function (str) {
        str || (str = '');
        var params = {},
            rawParams = str.split('&');

        xs.Array.each(rawParams, function (param) {
            //split name and value
            var pair = param.split('=');

            //try to get name
            var name = pair[0].match(queryParamNameRe);
            if (!name) {
                return;
            } else {
                name = name[0];
            }

            //get value
            var value = xs.isString(pair[1]) ? pair[1] : '';

            //try to get indexes (for nested values)
            var indexes = pair[0].match(queryParamIndexesRe);
            indexes = indexes ? indexes.map(removeIndexBrackets) : null;

            //process data
            fromQueryObjects(params, name, value, indexes);
        });
        return params;
    };
    /**
     * Gets next numeric index in params array/object
     * @param {Array|Object} params
     * @returns {Integer}
     */
    var getNextIndex = function (params) {
        if (xs.isArray(params)) {
            return params.length;
        }
        var index = 0;
        while (xs.Object.hasKey(params, index)) {
            index++;
        }
        return index;
    };
    /**
     * processes object to query object
     * @param params
     * @param name
     * @param value
     * @param indexes
     * @returns {Undefined}
     */
    var fromQueryObjects = function (params, name, value, indexes) {
        //assign value if no indexes
        if (!indexes || !indexes.length) {
            value = decodeURIComponent(value);
            try {
                params[name] = JSON.parse(value);
            } catch (e) {
                params[name] = value;
            }
            return;
        }
        //else - process down
        //splice indexes
        var index = indexes[0];

        //the default optimistic setting of params[name] is array
        params[name] || (params[name] = []);

        //shortcut
        var param = params[name];

        if (index) {
            xs.isNumeric(index) && (index = Number(index));
        } else {
            index = getNextIndex(param);
        }
        if (xs.isArray(param) && xs.isString(index)) {
            params[name] = xs.Array.toObject(param);
        }
        fromQueryObjects(params[name], index, value, indexes.slice(1));
    };
    /**
     * process object to query string
     * @param {*} object
     * @param {Boolean} encode
     * @returns {String}
     */
    var toQueryString = function (object, encode) {
        object || (object = {});
        var paramObjects = [],
            params = [];

        if (encode) {
            xs.each(object, function (value, name) {
                paramObjects = paramObjects.concat(toQueryObjects(encodeURIComponent(name), value, encode));
            }, this);
        } else {
            xs.each(object, function (value, name) {
                paramObjects = paramObjects.concat(toQueryObjects(name, value, encode));
            }, this);

        }
        xs.Array.each(paramObjects, function (paramObject) {
            params.push(paramObject.name + '=' + String(paramObject.value));
        });

        return params.join('&');
    };
    /**
     * processes object to query object
     * @param name
     * @param object
     * @param encode
     * @returns {Array}
     */
    var toQueryObjects = function (name, object, encode) {
        var self = toQueryObjects,
            objects = [];

        if (xs.isIterable(object) && xs.size(object)) {
            if (encode) {
                xs.each(object, function (value, param) {
                    objects = objects.concat(self(name + '[' + encodeURIComponent(param) + ']', value, encode));
                });
            } else {
                xs.each(object, function (value, param) {
                    objects = objects.concat(self(name + '[' + param + ']', value));
                });
            }
        } else {
            if (encode) {
                objects.push({
                    name: name,
                    value: encodeURIComponent(object)
                });
            } else {
                objects.push({
                    name: name,
                    value: object
                });
            }
        }

        return objects;
    };
    /**
     * Request methods, class, class works with
     * @type {string[]}
     */
    var methods = ['get', 'post', 'put', 'delete'];

    var setRequest = function (me) {
        //request object
        me.isCrossDomain = me.url.host !== xs.location.host;
        if (me.isCrossDomain && xs.isIE && xs.browser.major <= 9) {
            me.xhr = new XDomainRequest();
            me.isXhr = false;
        } else {
            me.xhr = new XMLHttpRequest();
            me.isXhr = true;
        }
    };

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

    var setEventHandlers = function (me) {
        var xhr = me.xhr;
        xhr.onprogress = function (event) {
            console.log('PROGRESS', 'request', me, 'event', event);
            if (me.isXhr && event.lengthComputable) {
                me.deferred.progress(event.loaded / event.total);
            }
        };
        xhr.onerror = function () {
            console.log('ERROR', 'request', me);
            me.abort();
        };
        xhr.onload = function () {
            console.log('LOAD', 'request', me);
            complete(me);
        };
        xhr.ontimeout = function () {
            console.log('TIMEOUT', 'request', me);
            me.abort(true);
        };
    };

    var complete = function (me) {
        console.log('Request completed');
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

            //deferred request handler
            me.deferred = xs.create('xs.promise.Deferred');

            //request timeout
            me.timeout = config.timeout;

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
                    me.url && setRequest(me);
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
                var me = this;

                if (!me.xhr) {
                    return false;
                }

                var xhr = me.xhr,
                    method = me.method.toUpperCase(),
                    url = me.url.toUri();

                if (me.isXhr) {
                    xhr.open(method, url, me.async, me.user, me.password);
                } else {
                    xhr.open(method, url);
                }
                return true;
            },
            send: function () {
                var me = this,
                    data = me.method == 'get' ? '' : toQueryString(me.params);

                if (!me.xhr) {
                    return false;
                }

                me.isCrossDomain && me.isXhr && (me.xhr.withCredentials = me.credentials);

                setHeaders(me);
                setEventHandlers(me);

                me.timeoutId = setTimeout(function () {
                    me.abort(true);
                }, me.timeout);

                me.xhr.send(data);

                return me.deferred.promise;
            },
            abort: function (timedOut) {
                var me = this;
                me.deferred.reject(timedOut);
            }
        }
    };
});