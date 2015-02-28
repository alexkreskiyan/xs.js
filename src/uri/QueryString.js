/**
 * Query string implementation class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.QueryString
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.QueryString', function (self) {

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

        self.assert.ok(!arguments.length || xs.isObject(params) || xs.isString(params), 'constructor - given params `$params` are nor object neither string', {
            $params: params
        });

        //handler object params
        if (xs.isObject(params)) {
            me.private.params = params;

            //handler string params
        } else if (xs.isString(params)) {
            //decode
            params = decodeURI(params);

            self.assert.ok(queryStringRe.test(params), 'constructor - given query string `$queryString` is not correct', {
                $queryString: params
            });

            me.private.params = fromQueryString(decodeURI(params));

            //handle empty params
        } else {
            me.private.params = {};
        }
    };

    /**
     * Query string params object
     *
     * @property params
     *
     * @type {Object}
     */
    Class.property.params = {
        set: function (params) {
            var me = this;

            self.assert.object(params, 'params - given params `$params` are not an object', {
                $params: params
            });

            me.private.params = params;
        }
    };

    /**
     * Returns string representation of QueryString
     *
     * @method toString
     *
     * @param {Boolean} encode whether to perform encodeURIComponent method over QueryString parts
     *
     * @returns {String}
     */
    Class.method.toString = function (encode) {
        self.assert.ok(!arguments.length || xs.isBoolean(encode), 'toString - given encode `$encode` is not boolean', {
            $encode: encode
        });

        return toQueryString(this.private.params, Boolean(encode));
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
    var fromQueryString = function (string) {
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
            fromQueryObjects(params, name, value, indexes);
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
     *
     * @ignore
     *
     * @method fromQueryObjects
     *
     * @param {Array|Object} params
     * @param {String|Number} name
     * @param {*} value
     * @param {Number[]} indexes
     */
    var fromQueryObjects = function (params, name, value, indexes) {

        //assign value if no indexes
        if (!indexes || !indexes.length) {
            value = decodeURIComponent(value);

            //JSON.parse is used to process from string to JS natives
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
            index = getNextIndex(param);
        }

        //convert array to object if needed
        if (xs.isArray(param) && xs.isString(index)) {
            params[name] = (new xs.core.Collection(param)).toSource();
        }

        fromQueryObjects(params[name], index, value, indexes);
    };

    /**
     * Gets next number index for array/object params
     *
     * @ignore
     *
     * @method getNextIndex
     *
     * @param {Array|Object} params
     *
     * @return {Number}
     */
    var getNextIndex = function (params) {
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
    var toQueryString = function (object, encode) {
        var paramObjects = [], params = [];

        //use object as collection
        object = new xs.core.Collection(object);

        //encode name if encode specified
        if (encode) {
            object.each(function (value, name) {
                paramObjects = paramObjects.concat(toQueryObjects(encodeURIComponent(name), value, encode));
            });

        } else {
            object.each(function (value, name) {
                paramObjects = paramObjects.concat(toQueryObjects(name, value, encode));
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
    var toQueryObjects = function (name, object, encode) {
        var objects = [];

        if (xs.isIterable(object) && Object.keys(object).length) {

            //use object as collection
            object = new xs.core.Collection(object);

            if (encode) {
                object.each(function (value, param) {
                    objects = objects.concat(toQueryObjects(name + encodeURIComponent('[' + param + ']'), value, encode));
                });
            } else {
                object.each(function (value, param) {
                    objects = objects.concat(toQueryObjects(name + '[' + param + ']', value, encode));
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

});