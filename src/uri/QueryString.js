/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Query string implementation class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.uri.QueryString
 */
xs.define(xs.Class, 'ns.QueryString', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    /**
     * QueryString constructor
     *
     * @constructor
     *
     * @param {String|Object} [params] query string params, given either in object or string form
     */
    Class.constructor = function (params) {
        var me = this;

        xs.assert.ok(!arguments.length || xs.isObject(params) || xs.isString(params), 'Given params "$params" are nor object neither string', {
            $params: params
        }, QueryStringError);

        //handler object params
        if (xs.isObject(params)) {
            me.private.params = params;

            //handler string params
        } else if (xs.isString(params)) {
            //decode
            params = decodeURI(params);

            xs.assert.ok(queryStringRe.test(params), 'Given query string "$queryString" is not correct', {
                $queryString: params
            });

            me.private.params = _fromQueryString(decodeURI(params));

            //handle empty params
        } else {
            me.private.params = {};
        }
    };

    Class.property.params = {
        set: function (params) {
            var me = this;

            xs.assert.object(params, 'Given params "$params" are not an object', {
                $params: params
            }, QueryStringError);

            me.private.params = params;
        }
    };

    Class.method.toString = function (encode) {
        xs.assert.ok(!arguments.length || xs.isBoolean(encode), 'Given encode "$encode" is not boolean', {
            $encode: encode
        }, QueryStringError);

        return _toQueryString(this.private.params, Boolean(encode));
    };

    var queryStringRe = /^[^?#]+$/;

    /**
     * Process object from given query string
     *
     * @ignore
     *
     * @method fromQueryString
     *
     * @param {String} string
     *
     * @return {Object}
     */
    var _fromQueryString = function (string) {
        var params = {}, rawParams = new xs.core.Collection(string.split('&'));

        rawParams.each(function (param) {
            //split name and value
            var pair = param.split('=');

            //try to get name
            var name = pair[0].match(queryParamNameRe);
            if (!name) {

                return;
            }

            name = name[0];

            //get value
            var value = xs.isString(pair[1]) ? pair[1] : '';

            //try to get indexes (for nested values)
            var indexes = pair[0].match(queryParamIndexesRe);

            //remove brackets from indexes
            indexes = indexes ? indexes.map(function (index) {
                return index.slice(1, index.length - 1);
            }) : null;

            //process data
            _fromQueryObjects(params, name, value, indexes);
        });

        return params;
    };

    /**
     * Fetches all param indexes from param name
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var queryParamIndexesRe = /\[([^\[\]]*)\]/g;

    /**
     * Fetches name from pair item
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var queryParamNameRe = /^([^\[\]]+)/;

    /**
     * Processes object to query object according to given indexes
     * @param params
     * @param name
     * @param value
     * @param indexes
     * @return {undefined}
     */
    var _fromQueryObjects = function (params, name, value, indexes) {

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

        //splice indexes
        var index = indexes.shift();

        //the default optimistic setting of params[name] is array
        if (!params[name]) {
            params[name] = [];
        }

        //shortcut
        var param = params[name];

        if (index) {
            if (xs.isNumeric(index)) {
                index = Number(index);
            }
        } else {
            index = _getNextIndex(param);
        }

        //convert array to object if needed
        if (xs.isArray(param) && xs.isString(index)) {
            params[name] = (new xs.core.Collection(param)).toSource();
        }

        _fromQueryObjects(params[name], index, value, indexes);
    };

    /**
     * Gets next number index for array/object params
     *
     * @param {Array|Object} params
     *
     * @return {Number}
     */
    var _getNextIndex = function (params) {
        //return length if params are array
        if (xs.isArray(params)) {

            return params.length;
        }

        //return first free number index for object
        var index = 0, keys = Object.keys(params);
        while (keys.indexOf(index) >= 0) {
            index++;
        }

        return index;
    };

    /**
     * Process given object to query string
     *
     * @ignore
     *
     * @method toQueryString
     *
     * @param {Object} object
     *
     * @param {Boolean} encode
     *
     * @return {String} query string
     */
    var _toQueryString = function (object, encode) {
        var paramObjects = [], params = [];

        //use object as collection
        object = new xs.core.Collection(object);

        //encode name if encode specified
        if (encode) {
            object.each(function (value, name) {
                paramObjects = paramObjects.concat(_toQueryObjects(encodeURIComponent(name), value, encode));
            });

        } else {
            object.each(function (value, name) {
                paramObjects = paramObjects.concat(_toQueryObjects(name, value, encode));
            });
        }

        paramObjects.forEach(function (paramObject) {
            params.push(paramObject.name + '=' + String(paramObject.value));
        });

        return params.join('&');
    };

    /**
     * Processes object to query object
     *
     * @ignore
     *
     * @method toQueryObjects
     *
     * @param {String} name
     * @param {*} object
     * @param {Boolean} encode
     *
     * @return {Array}
     */
    var _toQueryObjects = function (name, object, encode) {
        var objects = [];

        if (xs.isIterable(object) && Object.keys(object).length) {

            //use object as collection
            object = new xs.core.Collection(object);

            if (encode) {
                object.each(function (value, param) {
                    objects = objects.concat(_toQueryObjects(name + '[' + encodeURIComponent(param) + ']', value, encode));
                });
            } else {
                object.each(function (value, param) {
                    objects = objects.concat(_toQueryObjects(name + '[' + param + ']', value, encode));
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
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class QueryStringError
     */
    function QueryStringError(message) {
        this.message = self.label + '::' + message;
    }

    QueryStringError.prototype = new Error();

});