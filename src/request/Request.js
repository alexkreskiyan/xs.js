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

    /**
     * synchronizes method, url params and request params, when method/url/params changed
     * @param {xs.request.Request} me
     * @param {String} from
     */
    var syncParams = function (me, from) {
        //switch change source
        switch (from) {
            case 'method':
                if (me.method == 'get') {
                    //fetch url.params from me.params
                    me.url.params = me.params;
                } else {
                    //empty url
                    me.url.params = {};
                }
                break;
            case 'url':
                if (me.method == 'get') {
                    if (xs.Object.size(me.url.params)) {
                        //if any params in url - assign them to request
                        me.params = me.url.params; //because of Object bylink passing - we achieve direct sync
                    } else {
                        //else - url.params are assigned from me.params
                        me.url.params = me.params; //because of Object bylink passing - we achieve direct sync
                    }
                } else {
                    if (xs.Object.size(me.url.params)) {
                        //if any params in url - assign them to request
                        me.params = me.url.params; //because of Object bylink passing - we achieve direct sync
                    }
                    //empty url.params
                    me.url.params = {};
                }
                break;
            case 'params':
                if (me.method == 'get') {
                    //url.params are assigned from me.params
                    me.url.params = me.params; //because of Object bylink passing - we achieve direct sync
                }
                break;
        }
    };

    var setRequest = function (me) {
        //request object
        me.__set('isCrossDomain', me.url.host !== xs.location.host);
        if (me.isCrossDomain && xs.isIE && xs.browser.major <= 9) {
            me.__set('xhr', new XDomainRequest());
            me.__set('isXhr', false);
        } else {
            me.__set('xhr', new XMLHttpRequest());
            me.__set('isXhr', true);
        }
    };

    var open = function (me) {
        var xhr = me.xhr,
            method = me.method.toUpperCase(),
            url = me.url.toUri();

        if (me.isXhr) {
            xhr.open(method, url, me.async, me.user, me.password);
        } else {
            xhr.open(method, url);
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
            me.abort(false);
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
            //set params if given
            if (xs.isObject(config.params)) {
                me.params = config.params;
                //or default to empty ones, if not defined yet via url
            } else if (!me.params) {
                me.params = {};
            }
            me.user = config.user;
            me.password = config.password;
            me.async = config.async;
            me.credentials = config.credentials;
            me.headers = xs.isObject(config.headers) ? config.headers : {};

            //deferred request handler
            me.__set('deferred', xs.create('xs.promise.Deferred'));

            //request timeout
            me.timeout = config.timeout;

            //Non-GET requests default content type
            me.postContentType = config.postContentType;
        },
        properties: {
            method: {
                set: function (method) {
                    var me = this;

                    if (!xs.isString(method)) {
                        return;
                    }

                    method = method.toLowerCase();
                    xs.Array.has(methods, method) && me.__set('method', method);

                    me.url && syncParams(me, 'method');
                },
                default: 'get'
            },
            url: {
                set: function (url) {
                    var me = this;

                    if (xs.isString(url)) {
                        url = xs.create('xs.uri.Url', {url: url});
                    } else if (xs.isObject(url)) {
                        url = xs.create('xs.uri.Url', url);
                    } else if (!xs.is(url, xs.uri.Url)) {
                        var loc = xs.location;
                        url = xs.create('xs.uri.Url', {
                            url: loc.protocol + '//' + loc.host + (loc.port ? ':' + loc.port : '') + loc.pathname + loc.search + loc.hash
                        });
                    }
                    me.__set('url', url);

                    syncParams(me, 'url');

                    setRequest(me);
                }
            },
            params: {
                set: function (params) {
                    var me = this;

                    if (!xs.isObject(params)) {
                        return;
                    }

                    me.__set('params', params);
                    syncParams(me, 'params');
                }
            },
            user: {
                set: function (user) {
                    var me = this;
                    if (xs.isString(user)) {
                        me.__set('user', user);
                    } else if (!user) {
                        me.__set('user', null);
                    }
                }
            },
            password: {
                set: function (password) {
                    var me = this;
                    if (xs.isString(password)) {
                        me.__set('password', password);
                    } else if (!password) {
                        me.__set('password', null);
                    }
                }
            },
            async: {
                set: function (async) {
                    xs.isDefined(async) && this.__set('async', Boolean(async));
                },
                default: true
            },
            credentials: {
                set: function (credentials) {
                    xs.isDefined(credentials) && this.__set('credentials', Boolean(credentials));
                },
                default: false
            },
            headers: {
                set: function (headers) {
                    xs.isObject(headers) && this.__set('headers', headers);
                }
            },
            timeout: {
                set: function (timeout) {
                    var me = this;
                    xs.isNumeric(timeout) && me.__set('timeout', Number(timeout));
                    me.xhr && (me.xhr.timeout = me.__get('timeout'));
                },
                default: 30000
            },
            timeoutId: 0,
            xhr: {
                set: xs.emptyFn
            },
            isCrossDomain: {
                set: xs.emptyFn
            },
            isXhr: {
                set: xs.emptyFn
            },
            deferred: {
                set: xs.emptyFn
            },
            postContentType: {
                set: function (postContentType) {
                    xs.isString(postContentType) && this.__set('postContentType', postContentType);
                },
                default: 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        },
        methods: {
            send: function () {
                var me = this,
                    data = me.method == 'get' ? '' : toQueryString(me.params, false);

                open(me);

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
                me.deferred.reject(Boolean(timedOut));
            }
        }
    };
});