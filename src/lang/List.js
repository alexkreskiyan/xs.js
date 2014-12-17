/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.lang.List is private singleton, defining basic list operations, for both Array and Object.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.List
     *
     * @singleton
     */
    var list = xs.List = new (function () {
        var me = this;

        // Create quick reference variables for speed access to core prototypes.
        var _slice = Function.prototype.call.bind(Array.prototype.slice);
        var _concatenate = Function.prototype.apply.bind(Array.prototype.concat);

        /**
         * Returns all list keys
         *
         * For example:
         *
         *     //for Array
         *     var keys = xs.keys([
         *         1,
         *         2,
         *         3
         *     ]);
         *     console.log(keys); //[0, 1, 2]
         *
         *     //for Object
         *     var keys = xs.keys({
         *         a: 1,
         *         b: 2,
         *         c: 3
         *     });
         *     console.log(keys); //['a', 'b', 'c']
         *
         * @method keys
         *
         * @param {Array|Object} list list, keys are fetched from
         *
         * @return {Array} list keys
         */
        var _keys = me.keys = function (list) {
            //handle array list
            if (xs.isArray(list)) {
                var keys = [], length = list.length;

                for (var i = 0; i < length; i++) {
                    keys.push(i);
                }

                return keys;
            }

            //handle object list
            return Object.keys(list);
        };

        /**
         * Returns all list values
         *
         * For example:
         *
         *     //for Array
         *     var values = xs.values([
         *         1,
         *         2,
         *         3
         *     ]);
         *     console.log(values); //[1, 2, 3] - returns copy of source array
         *
         *     //for Object
         *     var values = xs.values({
         *         a: 1,
         *         b: 2,
         *         c: 3
         *     });
         *     console.log(values); //[1, 2, 3]
         *
         * @method values
         *
         * @param {Array|Object} list list, values are fetched from
         *
         * @return {Array} list values
         */
        me.values = function (list) {
            //handle array list
            if (xs.isArray(list)) {

                return _slice(list);
            }

            //handle object list
            var values = [], index, keys = Object.keys(list), len = keys.length;

            for (index = 0; index < len; index++) {
                values.push(list[keys[index]]);
            }

            return values;
        };

        /**
         * Returns whether list has given key. Keys' comparison is strict, differing numbers and strings
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         3
         *     ];
         *     console.log(xs.hasKey(list, -1)); //false - out of bounds
         *     console.log(xs.hasKey(list, 3)); //false - out of bounds
         *     console.log(xs.hasKey(list, '1')); //false - string given
         *     console.log(xs.hasKey(list, 1)); //true - key exists
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         b: 2,
         *         c: 3,
         *         1: 4
         *     };
         *     console.log(xs.hasKey(list, 'd')); //false
         *     console.log(xs.hasKey(list, 'a')); //true
         *     console.log(xs.hasKey(list, 1)); //false - number given
         *     console.log(xs.hasKey(list, '1')); //true - string given
         *
         * @method hasKey
         *
         * @param {Array|Object} list list to search within
         * @param {String|Number} key key to lookup for
         *
         * @return {Boolean} whether list has key
         */
        var _hasKey = me.hasKey = function (list, key) {
            //handle array list
            if (xs.isArray(list)) {

                return xs.isNumber(key) && key >= 0 && key < list.length;
            }

            //handle object list
            return xs.isString(key) && list.hasOwnProperty(key);
        };

        /**
         * Returns whether list has value
         *
         * For example:
         *
         *     var value = {};
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         value
         *     ];
         *     console.log(xs.has(list, 0)); //false - no value
         *     console.log(xs.has(list, {})); //false - another object in array
         *     console.log(xs.has(list, 1)); //true - value exists
         *     console.log(xs.has(list, value)); //true - value exists
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: value
         *     };
         *     console.log(xs.has(list, 0)); //false - no value
         *     console.log(xs.has(list, {})); //false - another object in array
         *     console.log(xs.has(list, 1)); //true - value exists
         *     console.log(xs.has(list, value)); //true - value exists
         *
         * @method has
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @return {Boolean} whether list has value
         */
        var _has = me.has = function (list, value) {
            var index, keys = _keys(list), keysLength = keys.length, key;

            for (index = 0; index < keysLength; index++) {
                key = keys[index];

                if (list[key] === value) {

                    return true;
                }
            }

            return false;
        };

        /**
         * Returns key of first list value, equal to given
         *
         * For example:
         *
         *     var value = {};
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         1,
         *         value,
         *         2,
         *         value
         *     ];
         *     console.log(xs.keyOf(list, 0)); //undefined - no value
         *     console.log(xs.keyOf(list, {})); //undefined - another object in array
         *     console.log(xs.keyOf(list, 1)); //0
         *     console.log(xs.keyOf(list, value)); //3
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         b: 2,
         *         c: 1,
         *         f: value,
         *         d: 2,
         *         e: value
         *     };
         *     console.log(xs.keyOf(list, 0)); //undefined - no value
         *     console.log(xs.keyOf(list, {})); //undefined - another object in array
         *     console.log(xs.keyOf(list, 1)); //'a'
         *     console.log(xs.keyOf(list, value)); //'f'
         *
         * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
         *
         * @method keyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @return {String|Number|undefined} found key, or undefined if nothing found
         */
        var _keyOf = me.keyOf = function (list, value) {
            var key;

            //handle array list
            if (xs.isArray(list)) {
                key = list.indexOf(value);

                return key < 0 ? undefined : key;
            }

            //handle object list
            var index, keys = Object.keys(list), keysLength = keys.length, key;

            for (index = 0; index < keysLength; index++) {
                key = keys[index];

                if (list[key] === value) {

                    return key;
                }
            }

            return undefined;
        };

        /**
         * Returns key of last list value, equal to given
         *
         * For example:
         *
         *     var value = {};
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         1,
         *         value,
         *         2,
         *         value
         *     ];
         *     console.log(xs.lastKeyOf(list, 0)); //undefined - no value
         *     console.log(xs.lastKeyOf(list, {})); //undefined - another object in array
         *     console.log(xs.lastKeyOf(list, 1)); //2
         *     console.log(xs.lastKeyOf(list, value)); //5
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         b: 2,
         *         c: 1,
         *         f: value,
         *         d: 2,
         *         e: value
         *     };
         *     console.log(xs.lastKeyOf(list, 0)); //undefined - no value
         *     console.log(xs.lastKeyOf(list, {})); //undefined - another object in array
         *     console.log(xs.lastKeyOf(list, 1)); //'c'
         *     console.log(xs.lastKeyOf(list, value)); //'e'
         *
         * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
         *
         * @method lastKeyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @return {String|Number|undefined} found key, or undefined if nothing found
         */
        var _lastKeyOf = me.lastKeyOf = function (list, value) {
            var key;

            //handle array list
            if (xs.isArray(list)) {
                key = list.lastIndexOf(value);

                return key < 0 ? undefined : key;
            }

            //handle object list
            var index, keys = Object.keys(list), keysLength = keys.length, key;

            for (index = keysLength - 1; index >= 0; index--) {
                key = keys[index];

                if (list[key] === value) {

                    return key;
                }
            }

            return undefined;
        };

        /**
         * Returns size of list
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         {}
         *     ];
         *     console.log(xs.size(list)); //3
         *     console.log(xs.size([])); //0
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         b: 2,
         *         e: {}
         *     };
         *     console.log(xs.size(list)); //3
         *     console.log(xs.size({})); //0
         *
         * @method size
         *
         * @param {Array|Object} list list, to get size of
         *
         * @return {Number} size of list
         */
        var _size = me.size = function (list) {
            //handle array list
            if (xs.isArray(list)) {

                return list.length;
            }

            //handle object list
            return Object.keys(list).length;
        };

        /**
         * Iterates over list values
         *
         * For example:
         *
         *     var scope = {
         *         x: 1
         *     };
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         {}
         *     ];
         *     xs.each(list, function(value, key, list) {
         *         console.log(this, value, key, list);
         *     }, scope);
         *     //outputs:
         *     // {x:1}, 1, 0, list
         *     // {x:1}, 2, 1, list
         *     // {x:1}, {}, 2, list
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: {}
         *     };
         *     xs.each(list, function(value, key, list) {
         *         console.log(this, value, key, list);
         *     }, scope);
         *     //outputs:
         *     // {x:1}, 1, a, list
         *     // {x:1}, 2, c, list
         *     // {x:1}, {}, b, list
         *
         * @method each
         *
         * @param {Array|Object} list list to iterate over
         * @param {Function} iterator list iterator
         * @param {Object} scope optional scope
         */
        var _each = me.each = function (list, iterator, scope) {
            var index, keysLength;

            //handle array list
            if (xs.isArray(list)) {
                keysLength = list.length;
                for (index = 0; index < keysLength; index++) {

                    iterator.call(scope, list[index], index, list);
                }

                return;
            }

            //handle object list
            var keys = Object.keys(list), key;
            keysLength = keys.length;

            for (index = 0; index < keysLength; index++) {
                key = keys[index];

                iterator.call(scope, list[key], key, list);
            }
        };

        /**
         * Iterates over list values in reverse order
         *
         * For example:
         *
         *     var scope = {
         *         x: 1
         *     };
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         {}
         *     ];
         *     xs.eachReverse(list, function(value, key, list) {
         *         console.log(this, value, key, list);
         *     }, scope);
         *     //outputs:
         *     // {x:1}, {}, 2, list
         *     // {x:1}, 2, 1, list
         *     // {x:1}, 1, 0, list
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: {}
         *     };
         *     xs.eachReverse(list, function(value, key, list) {
         *         console.log(this, value, key, list);
         *     }, scope);
         *     //outputs:
         *     // {x:1}, {}, b, list
         *     // {x:1}, 2, c, list
         *     // {x:1}, 1, a, list
         *
         * @method eachReverse
         *
         * @param {Array|Object} list list to iterate over
         * @param {Function} iterator list iterator
         * @param {Object} scope optional scope
         */
        var _eachReverse = me.eachReverse = function (list, iterator, scope) {
            var index, keysLength;

            //handle array list
            if (xs.isArray(list)) {
                keysLength = list.length;
                for (index = keysLength - 1; index >= 0; index--) {

                    iterator.call(scope, list[index], index, list);
                }

                return;
            }

            //handle object list
            var keys = Object.keys(list), key;
            keysLength = keys.length;

            for (index = keysLength - 1; index >= 0; index--) {
                key = keys[index];

                iterator.call(scope, list[key], key, list);
            }
        };

        /**
         * Produces a new list with values, returned by iterator function
         * if source was array - array is created
         * if source was object - object is created
         *
         * For example:
         *
         *     var scope = {
         *         twice: function(x) {
         *             return x * 2;
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         4
         *     ];
         *     console.log(xs.map(list, function(value, key) {
         *         return key + this.twice(value);
         *     }, scope));
         *     //outputs:
         *     // [ 2, 5, 10 ]
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: 4
         *     };
         *     console.log(xs.map(list, function(value, key) {
         *         return key + this.twice(value);
         *     }, scope));
         *     //outputs:
         *     // { a: 'a2', c: 'c4', b: 'b8' ]
         *
         * @method map
         *
         * @param {Array|Object} list list to map
         * @param {Function} iterator mapping function
         * @param {Object} scope optional scope
         *
         * @return {Array|Object} Mapping result
         */
        me.map = function (list, iterator, scope) {
            var result = xs.isArray(list) ? [] : {};

            _each(list, function (value, key, array) {
                result[key] = iterator.call(this, value, key, array);
            }, scope);

            return result;
        };

        /**
         * Reduces a list of values, returned by iterator function from left
         *
         * For example:
         *
         *     var scope = {
         *         twice: function(x) {
         *             return x * 2;
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         4
         *     ];
         *     console.log(xs.reduce(list, function(memo, value, key) {
         *         return memo + key + this.twice(value);
         *     }, 5, scope));
         *     //outputs:
         *     // 22, evaluated as 5 + (0 + 1 * 2) + (1 + 2 * 2) + (2 + 2 * 4)
         *     console.log(xs.reduce(list, function(memo, value, key) {
         *         return memo + key + 2 * value;
         *     }));
         *     //outputs:
         *     // 14, evaluated as 1 + (0 + 2 * 2) + (1 + 4 * 2)
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: 4
         *     };
         *     console.log(xs.reduce(list, function(memo, value, key) {
         *         return memo + key + this.twice(value);
         *     }, 5, scope));
         *     //outputs:
         *     // '5a2c4b8', evaluated as 5 + ('a' + 1 * 2) + ('c' + 2 * 2) + ('b' + 2 * 4)
         *     console.log(xs.reduce(list, function(memo, value, key) {
         *         return memo + key + 2 * value;
         *     }));
         *     //outputs:
         *     // '1c4b8', evaluated as 1 + ('c' + 2 * 2) + ('b' + 4 * 2)
         *
         * @method reduce
         *
         * @param {Array|Object} list reduced list
         * @param {Function} iterator reducing function
         * @param {*} memo initial value. Is optional. If omitted, first value's value is shifted from list and used as memo
         * @param {Object} scope optional scope
         *
         * @return {*} Reducing result
         */
        me.reduce = function (list, iterator, memo, scope) {
            var result, indexStart;

            if (xs.isObject(list)) {
                var keys = Object.keys(list);
            }

            if (arguments.length > 2) {
                result = memo;
                indexStart = 0;
            } else {
                result = xs.isArray(list) ? list[0] : list[keys[0]];
                indexStart = 1;
            }

            var index, keysLength;

            //handle array list
            if (xs.isArray(list)) {
                keysLength = list.length;
                for (index = indexStart; index < keysLength; index++) {

                    result = iterator.call(this, result, list[index], index, list);
                }

                return result;
            }

            //handle object list
            var key;
            keysLength = keys.length;

            for (index = indexStart; index < keysLength; index++) {
                key = keys[index];

                result = iterator.call(this, result, list[key], key, list);
            }

            return result;
        };

        /**
         * Reduces a list of values, returned by iterator function from right
         *
         * For example:
         *
         *     var scope = {
         *         twice: function(x) {
         *             return x * 2;
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         1,
         *         2,
         *         4
         *     ];
         *     console.log(xs.reduceRight(list, function(memo, value, key) {
         *         return memo + key + this.twice(value);
         *     }, 5, scope));
         *     //outputs:
         *     // 22, evaluated as 5 + (2 + 4 * 2) + (1 + 2 * 2) + (0 + 1 * 2)
         *     console.log(xs.reduceRight(list, function(memo, value, key) {
         *         return memo + key + 2 * value;
         *     }));
         *     //outputs:
         *     // 11, evaluated as 4 + (1 + 2 * 2) + (0 + 1 * 2)
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: 4
         *     };
         *     console.log(xs.reduceRight(list, function(memo, value, key) {
         *         return memo + key + this.twice(value);
         *     }, 5, scope));
         *     //outputs:
         *     // '5b8c4a2', evaluated as 5 + ('b' + 2 * 4) + ('c' + 2 * 2) + ('a' + 1 * 2)
         *     console.log(xs.reduceRight(list, function(memo, value, key) {
         *         return memo + key + 2 * value;
         *     }));
         *     //outputs:
         *     // '4c4a2', evaluated as 4 + ('c' + 2 * 2) + ('a' + 1 * 2)
         *
         * @method reduceRight
         *
         * @param {Array|Object} list reduced list
         * @param {Function} iterator reducing function
         * @param {*} memo initial value. Is optional. If omitted, last value's value is popped from list and used as memo
         * @param {Object} scope optional scope
         *
         * @return {*} Reducing result
         */
        me.reduceRight = function (list, iterator, memo, scope) {
            var result, indexStart, keysLength;

            if (xs.isArray(list)) {
                keysLength = list.length;
            } else {
                var keys = Object.keys(list);
                keysLength = keys.length;
            }

            if (arguments.length > 2) {
                result = memo;
                indexStart = 0;
            } else {
                result = xs.isArray(list) ? list[keysLength - 1] : list[keys[keysLength - 1]];
                indexStart = -1;
            }

            var index;

            //handle array list
            if (xs.isArray(list)) {
                for (index = keysLength + indexStart - 1; index >= 0; index--) {

                    result = iterator.call(this, result, list[index], index, list);
                }

                return result;
            }

            //handle object list
            var key;

            for (index = keysLength + indexStart - 1; index >= 0; index--) {
                key = keys[index];

                result = iterator.call(this, result, list[key], key, list);
            }

            return result;
        };

        /**
         * Returns first list value, that passes given test function
         *
         * For example:
         *
         *     var scope = {
         *         sum: function(x, y) {
         *             return x + y;
         *         },
         *         first: function(x) {
         *             return x[0];
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         {x: 2},
         *         {x: 2},
         *         {x: 0}
         *     ];
         *     console.log(xs.find(list, function(value, key) {
         *         return this.sum(key, value.x) === 2;
         *     }, scope));
         *     //outputs:
         *     // {x: 2}, reference to list[0], first value, passed finder function
         *
         *     //for Object
         *     var list = {
         *         aa: {x: 1},
         *         c: {x: 2},
         *         ab: {x: 3}
         *     };
         *     console.log(xs.find(list, function(value, key) {
         *         return this.first(key) === 'a';
         *     }, scope));
         *     //outputs:
         *     // {x: 1}, reference to list[0], first value, passed finder function
         *
         * @method find
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if value matches given conditions
         * @param {Object} scope optional scope
         *
         * @return {*} found value, undefined if nothing found
         */
        var _find = me.find = function (list, finder, scope) {
            var index, value, keysLength;

            //handle array list
            if (xs.isArray(list)) {
                keysLength = list.length;
                for (index = 0; index < keysLength; index++) {
                    value = list[index];

                    if (finder.call(scope, value, index, list)) {

                        return value;
                    }
                }

                return;
            }

            //handle object list
            var keys = Object.keys(list), key;
            keysLength = keys.length;

            for (index = 0; index < keysLength; index++) {
                key = keys[index];

                value = list[key];

                if (finder.call(scope, value, key, list)) {

                    return value;
                }
            }
        };

        /**
         * Returns last list value, that passes given test function
         *
         * For example:
         *
         *     var scope = {
         *         sum: function(x, y) {
         *             return x + y;
         *         },
         *         first: function(x) {
         *             return x[0];
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         {x: 2},
         *         {x: 2},
         *         {x: 0}
         *     ];
         *     console.log(xs.findLast(list, function(value, key) {
         *         return this.sum(key, value.x) === 2;
         *     }, scope));
         *     //outputs:
         *     // {x: 0}, reference to list[0], last value, passed finder function
         *
         *     //for Object
         *     var list = {
         *         aa: {x: 1},
         *         c: {x: 2},
         *         ab: {x: 3}
         *     };
         *     console.log(xs.findLast(list, function(value, key) {
         *         return this.first(key) === 'a';
         *     }, scope));
         *     //outputs:
         *     // {x: 3}, reference to list[0], last value, passed finder function
         *
         * @method findLast
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if value matches given conditions
         * @param {Object} scope optional scope
         *
         * @return {*} found value, undefined if nothing found
         */
        var _findLast = me.findLast = function (list, finder, scope) {
            var index, value, keysLength;

            //handle array list
            if (xs.isArray(list)) {
                keysLength = list.length;
                for (index = keysLength - 1; index >= 0; index--) {
                    value = list[index];

                    if (finder.call(scope, value, index, list)) {

                        return value;
                    }
                }

                return;
            }

            //handle object list
            var keys = Object.keys(list), key;
            keysLength = keys.length;

            for (index = keysLength - 1; index >= 0; index--) {
                key = keys[index];

                value = list[key];

                if (finder.call(scope, value, key, list)) {

                    return value;
                }
            }
        };

        /**
         * Returns all list values, that pass given test function
         *
         * For example:
         *
         *     var scope = {
         *         sum: function(x, y) {
         *             return x + y;
         *         },
         *         first: function(x) {
         *             return x[0];
         *         }
         *     };
         *
         *     //for Array
         *     var list = [
         *         {x: 2},
         *         {x: 2},
         *         {x: 0}
         *     ];
         *     console.log(xs.findAll(list, function(value, key) {
         *         return this.sum(key, value.x) === 2;
         *     }, scope));
         *     //outputs:
         *     // [{x: 2}, {x: 0}], references to list[0] and list[2] respectively, all values, passed finder function
         *
         *     //for Object
         *     var list = {
         *         aa: {x: 1},
         *         c: {x: 2},
         *         ab: {x: 3}
         *     };
         *     console.log(xs.findAll(list, function(value, key) {
         *         return this.first(key) === 'a';
         *     }, scope));
         *     //outputs:
         *     // {aa: {x: 1}, ab: {x: 3}], references to list.aa and list.ab respectively, all values, passed finder function
         *
         * @method findAll
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if value matches given conditions
         * @param {Object} scope optional scope
         *
         * @return {Array|Object} found values
         */
        var _findAll = me.findAll = function (list, finder, scope) {
            var index, value, keysLength;
            var isArray = xs.isArray(list);
            var copy = isArray ? [] : {};

            //handle array list
            if (isArray) {
                keysLength = list.length;
                for (index = 0; index < keysLength; index++) {
                    value = list[index];

                    if (finder.call(scope, value, index, list)) {
                        copy.push(value);
                    }
                }

                return copy;
            }

            //handle object list
            var keys = Object.keys(list), key;
            keysLength = keys.length;

            for (index = 0; index < keysLength; index++) {
                key = keys[index];

                value = list[key];

                if (finder.call(scope, value, key, list)) {
                    copy[key] = value;
                }
            }

            return copy;
        };

        /**
         * Returns first list value, that suites where clause
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.filter(list, {x: 1}));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to list[0], first value, matching where
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.filter(list, {x: 1}));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to list.a, first value, matching where
         *
         * @method filter
         *
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @return {Object} first object, that suites clause, or undefined, if nothing suites
         */
        me.filter = function (list, where) {
            return _find(list, function (value) {

                return _every(where, function (param, key) {

                    return value[key] === param;
                });
            });
        };

        /**
         * Returns last list value, that suites where clause
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.filterLast(list, {x: 1}));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list[3], last value, matching where
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.filterLast(list, {x: 1}));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list.d, last value, matching where
         *
         * @method filterLast
         *
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @return {Object} first object, that suites clause, or undefined, if nothing suites
         */
        me.filterLast = function (list, where) {
            return _findLast(list, function (value) {

                return _every(where, function (param, key) {

                    return value[key] === param;
                });
            });
        };

        /**
         * Returns all list values, that suite where clause
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.filterAll(list, {x: 1}));
         *     //outputs:
         *     // [{x: 1, y: 2}, {x: 1, y: 1}], reference to list[0] and x[3] respectively, all values, matching where
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.filterAll(list, {x: 1}));
         *     //outputs:
         *     // {a: {x: 1, y: 2}, d: {x: 1, y: 1}}, reference to list.a and list.d respectively, all values, matching where
         *
         * @method filterAll
         *
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @return {Array|Object} List values, filtered from original
         */
        me.filterAll = function (list, where) {
            return _findAll(list, function (value) {

                return _every(where, function (param, key) {

                    return value[key] === param;
                });
            });
        };

        /**
         * Returns whether all list values pass tester function
         *
         * For example:
         *
         *     var scope = {
         *        one: function(value) {
         *            return value === 1;
         *        },
         *        oneOrTwo: function(value) {
         *            return value === 1 || value === 2;
         *        }
         *     }
         *     //for Array
         *     var list = [
         *         1,
         *         1,
         *         2,
         *         2,
         *     ];
         *     console.log(xs.every(list, function(value) {
         *         return this.one(value);
         *     }, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.every(list, function(value) {
         *         return this.oneOrTwo(value);
         *     }, scope));
         *     //outputs:
         *     // true
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 1,
         *         b: 2,
         *         d: 2
         *     };
         *     console.log(xs.every(list, function(value) {
         *         return this.one(value);
         *     }, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.every(list, function(value) {
         *         return this.oneOrTwo(value);
         *     }, scope));
         *     //outputs:
         *     // true
         *
         * @method every
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Object} scope optional scope
         *
         * @return {Boolean} whether all values pass tester function
         */
        var _every = me.every = function (list, tester, scope) {
            var index, keys = _keys(list), len = keys.length, key;

            for (index = 0; index < len; index++) {
                key = keys[index];

                if (!tester.call(scope, list[key], key, list)) {

                    return false;
                }
            }

            return true;
        };

        /**
         * Returns whether count of list values pass tester function
         *
         * For example:
         *
         *     var scope = {
         *        one: function(value) {
         *            return value === 1;
         *        },
         *     }
         *     //for Array
         *     var list = [
         *         1,
         *         1,
         *         2,
         *         2,
         *     ];
         *     console.log(xs.some(list, function(value) {
         *         return this.one(value);
         *     }, 3, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.some(list, function(value) {
         *         return this.one(value);
         *     }, 1, scope));
         *     //outputs:
         *     // true
         *     console.log(xs.some(list, function(value) {
         *         return value === 1;
         *     }));
         *     //outputs:
         *     // true
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 1,
         *         b: 2,
         *         d: 2
         *     };
         *     console.log(xs.some(list, function(value) {
         *         return this.one(value);
         *     }, 3, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.some(list, function(value) {
         *         return this.one(value);
         *     }, 1, scope));
         *     //outputs:
         *     // true
         *     console.log(xs.some(list, function(value) {
         *         return value === 1;
         *     }));
         *     //outputs:
         *     // true
         *
         * @method some
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Number} count count of values needed to resolve as true
         * @param {Object} scope optional scope
         *
         * @return {Boolean} whether some values pass tester function
         */
        me.some = function (list, tester, count, scope) {
            var index, keys = _keys(list), len = keys.length, key, found = 0;

            xs.isNumber(count) || (count = 1);

            for (index = 0; index < len; index++) {
                key = keys[index];

                tester.call(scope, list[key], key, list) && found++;

                if (found >= count) {

                    return true;
                }
            }

            return false;
        };

        /**
         * Returns whether none of list values pass tester function
         *
         * For example:
         *
         *     var scope = {
         *        one: function(value) {
         *            return value === 1;
         *        },
         *        three: function(value) {
         *            return value === 3;
         *        }
         *     }
         *     //for Array
         *     var list = [
         *         1,
         *         1,
         *         2,
         *         2,
         *     ];
         *     console.log(xs.none(list, function(value) {
         *         return this.one(value);
         *     }, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.none(list, function(value) {
         *         return this.three(value);
         *     }, scope));
         *     //outputs:
         *     // true
         *
         *     //for Object
         *     var list = {
         *         a: 1,
         *         c: 1,
         *         b: 2,
         *         d: 2
         *     };
         *     console.log(xs.none(list, function(value) {
         *         return this.one(value);
         *     }, scope));
         *     //outputs:
         *     // false
         *     console.log(xs.none(list, function(value) {
         *         return this.three(value);
         *     }, scope));
         *     //outputs:
         *     // true
         *
         * @method none
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Object} scope optional scope
         *
         * @return {Boolean} whether no one of values pass tester function
         */
        var _none = me.none = function (list, tester, scope) {
            var index, keys = _keys(list), len = keys.length, key;

            for (index = 0; index < len; index++) {
                key = keys[index];

                if (tester.call(scope, list[key], key, list)) {

                    return false;
                }
            }

            return true;
        };

        /**
         * Returns first value of list
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.first(list));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to list[0] respectively
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.first(list));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to list.a respectively
         *
         * @method first
         *
         * @param {Array|Object} list
         *
         * @return {*} first value, undefined if list is empty
         */
        me.first = function (list) {
            var key = _keys(list)[0];

            return list[key];
        };

        /**
         * Returns last value of list
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.last(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list[0] respectively
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.last(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list.a respectively
         *
         * @method last
         *
         * @param {Array|Object} list
         *
         * @return {*} last value, undefined if list is empty
         */
        me.last = function (list) {
            var keys = _keys(list);
            var key = keys[keys.length - 1];

            return list[key];
        };

        /**
         * Shifts and returns first value from list
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.shift(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list[0] respectively
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 1
         *     //    },
         *     //    {
         *     //        x: 1,
         *     //        y: 1
         *     //    }
         *     //];
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.shift(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list.a respectively
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    c: {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    b: {
         *     //        x: 2,
         *     //        y: 1
         *     //    },
         *     //    d: {
         *     //        x: 1,
         *     //        y: 1
         *     //    }
         *     //};
         *
         * @method shift
         *
         * @param {Array|Object} list
         *
         * @return {*} First value of list
         */
        var _shift = me.shift = function (list) {
            var key = _keys(list).shift();
            var value = list[key];

            xs.isArray(list) ? list.splice(0, 1) : delete list[key];

            return value;
        };

        /**
         * Pops and returns last value from list
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.pop(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list[3] respectively
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    {
         *     //        x: 1,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 1
         *     //    }
         *     //];
         *
         *     //for Object
         *     var list = {
         *         a: {
         *             x: 1,
         *             y: 2
         *         },
         *         c: {
         *             x: 2,
         *             y: 2
         *         },
         *         b: {
         *             x: 2,
         *             y: 1
         *         },
         *         d: {
         *             x: 1,
         *             y: 1
         *         }
         *     };
         *     console.log(xs.pop(list));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to list.d respectively
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: {
         *     //        x: 1,
         *     //        y: 2
         *     //    },
         *     //    c: {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    b: {
         *     //        x: 2,
         *     //        y: 1
         *     //    }
         *     //};
         *
         * @method pop
         *
         * @param {Array|Object} list
         *
         * @return {*} Last value of list
         */
        var _pop = me.pop = function (list) {
            var key = _keys(list).pop();
            var value = list[key];

            xs.isArray(list) ? list.splice(-1, 1) : delete list[key];

            return value;
        };

        /**
         * Deletes value with given key
         *
         * For example:
         *
         *     var value = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         value,
         *     ];
         *     console.log(xs.deleteAt(list, 0));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    2,
         *     //    value
         *     //]
         *     console.log(xs.deleteAt(list, -1));
         *     //outputs:
         *     //false, index missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: value,
         *     };
         *     console.log(xs.deleteAt(list, 'a'));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    c: 2,
         *     //    b: value
         *     //}
         *     console.log(xs.deleteAt(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method deleteAt
         *
         * @param {Array|Object} list list, value is deleted from
         * @param {Number|String} key key of deleted value
         *
         * @return {Boolean} whether value was deleted
         */
        var _deleteAt = me.deleteAt = function (list, key) {
            if (_hasKey(list, key)) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];

                return true;
            }

            return false;
        };

        /**
         * Deletes first value from list, that matches given value
         *
         * For example:
         *
         *     var value = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         value,
         *         2,
         *         1,
         *         value
         *     ];
         *     console.log(xs.delete(list, value));
         *     //outputs:
         *     //true, value exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    2,
         *     //    1,
         *     //    value
         *     //]
         *     console.log(xs.delete(list, -1));
         *     //outputs:
         *     //false, value missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: value,
         *         f: 2,
         *         e: 1,
         *         d: value
         *     };
         *     console.log(xs.delete(list, value));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    f: 2,
         *     //    e: 1,
         *     //    d: value
         *     //}
         *     console.log(xs.delete(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method delete
         *
         * @param {Array|Object} list list, value is deleted from
         * @param {*} value deleted value
         *
         * @return {Boolean} whether something was deleted
         */
        me.delete = function (list, value) {
            var key = _keyOf(list, value);

            if (key !== undefined) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];

                return true;
            }

            return false;
        };

        /**
         * Deletes last value from list, that matches elem as key or as value
         *
         * For example:
         *
         *     var value = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         value,
         *         2,
         *         1,
         *         value
         *     ];
         *     console.log(xs.deleteLast(list, value));
         *     //outputs:
         *     //true, value exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    value,
         *     //    2,
         *     //    1
         *     //]
         *     console.log(xs.deleteLast(list, -1));
         *     //outputs:
         *     //false, value missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: value,
         *         f: 2,
         *         e: 1,
         *         d: value
         *     };
         *     console.log(xs.deleteLast(list, value));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    b: value
         *     //    f: 2,
         *     //    e: 1
         *     //}
         *     console.log(xs.deleteLast(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method deleteLast
         *
         * @param {Array|Object} list list, value is deleted from
         * @param {*} value deleted value
         *
         * @return {Boolean} whether value was deleted
         */
        me.deleteLast = function (list, value) {
            var key = _lastKeyOf(list, value);

            if (key !== undefined) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];

                return true;
            }

            return false;
        };

        /**
         * Deletes all values from list, passed as array/plain arguments
         *
         * For example:
         *
         *     var value = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         value,
         *         2,
         *         1,
         *         value
         *     ];
         *     console.log(xs.deleteAll(list, value));
         *     //outputs:
         *     //true, value exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    2,
         *     //    1
         *     //]
         *     console.log(xs.deleteAll(list, -1));
         *     //outputs:
         *     //false, value missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: value,
         *         f: 2,
         *         e: 1,
         *         d: value
         *     };
         *     console.log(xs.deleteAll(list, value));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    f: 2,
         *     //    e: 1
         *     //}
         *     console.log(xs.deleteAll(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method deleteAll
         *
         * @param {Array|Object} list list, values are deleted from
         * @param {*} [value] optional deleted value. If specified all value entries will be removed from list. If not - list is truncated
         *
         * @return {Number} count of deleted values
         */
        me.deleteAll = function (list, value) {
            var deleted = 0;

            //if value specified
            if (arguments.length > 1) {
                var key;

                //delete each entry
                while ((key = _keyOf(list, value)) !== undefined) {
                    _deleteAt(list, key);
                    deleted++;
                }

                return deleted;
            }

            var size = _size(list);

            //handle array list
            if (xs.isArray(list)) {
                list.splice(0, size);

                return size;
            }

            //handle object list
            _each(list, function (value, key) {
                delete list[key];
            });

            return size;
        };

        /**
         * Returns shallow copy of list
         *
         * For example:
         *
         *     //for Array
         *     xs.clone([
         *         1,
         *         2,
         *         3
         *     ]);
         *
         *     //for Object
         *     xs.clone({
         *         a: 1,
         *         c: 2,
         *         b: 3
         *     });
         *
         * @method clone
         *
         * @param {Array|Object} list copied list
         *
         * @return {Array|Object} list shallow copy
         */
        var _clone = me.clone = function (list) {
            //handle array list
            if (xs.isArray(list)) {

                return _slice(list);
            }

            //handle object list
            var copy = {};

            _each(list, function (value, key) {
                copy[key] = value;
            });

            return copy;
        };

        /**
         * Updates list with defaulted values, passed in 2+ arguments
         *
         * For example:
         *
         *     //for Array
         *     var list = [
         *         5
         *     ];
         *     xs.defaults(list, [
         *         2,
         *         1
         *     ], [
         *         4,
         *         3,
         *         2
         *     ]);
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    5,
         *     //    1,
         *     //    4,
         *     //    3,
         *     //    2
         *     //]
         *
         *     //for Object
         *     var list = {
         *         x: 1
         *     };
         *     xs.defaults(list, {
         *         x: 2,
         *         c: 1
         *     }, {
         *         c: 2,
         *         x: 3,
         *         a: 4
         *     });
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    x: 1,
         *     //    c: 1,
         *     //    a: 4
         *     //}
         *
         * @method defaults
         *
         * @param {Array|Object} list operated list
         */
        me.defaults = function (list) {
            var defaults = _union(_slice(arguments, 1));

            //handle array list
            if (xs.isArray(list)) {
                var len = defaults.length, index;
                for (index = list.length; index < len; index++) {
                    list[index] = defaults[index];
                }

                return;
            }

            //handle object list
            _each(defaults, function (value, key) {
                _hasKey(list, key) || (list[key] = value);
            });
        };

        /**
         * Returns copy of given list, filtered not to have false-like values
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.compact([
         *         1,
         *         0,
         *         -1,
         *         false,
         *         null,
         *         [],
         *         undefined,
         *         {}
         *     ]));
         *     //outputs:
         *     //[
         *     //    1,
         *     //    -1,
         *     //    [],
         *     //    {}
         *     //]
         *
         *     //for Object
         *     console.log(xs.compact({
         *         a: 1,
         *         f: 0,
         *         g: -1,
         *         e: false,
         *         b: null,
         *         c: [],
         *         d: undefined,
         *         h: {}
         *     }));
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    g: -1,
         *     //    c: [],
         *     //    h: {}
         *     //}
         *
         * @method compact
         *
         * @param {Array|Object} list compacted list
         *
         * @return {Array|Object}
         */
        me.compact = function (list) {
            return _findAll(list, function (value) {

                return value;
            });
        };

        /**
         * Returns list, filled by unique values of given list
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.unique([
         *         1,
         *         0,
         *         1,
         *         2,
         *         {},
         *         {},
         *         3,
         *         3,
         *         1,
         *         4
         *     ]));
         *     //outputs:
         *     //[
         *     //    1,
         *     //    0,
         *     //    2,
         *     //    {},
         *     //    {},
         *     //    3,
         *     //    4
         *     //]
         *
         *     //for Object
         *     console.log(xs.unique({
         *         a: 1,
         *         g: 0,
         *         b: 1,
         *         f: 2,
         *         i: {},
         *         m: {},
         *         d: 3,
         *         e: 3,
         *         c: 1,
         *         h: 4
         *     }));
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    g: 0,
         *     //    f: 2,
         *     //    i: {},
         *     //    m: {},
         *     //    d: 3,
         *     //    h: 4
         *     //}
         *
         * @method unique
         *
         * @param {Array|Object} list given list
         *
         * @return {Array|Object} copy with unique values
         */
        var _unique = me.unique = function (list) {
            var unique;

            //handle array list
            if (xs.isArray(list)) {
                unique = [];

                _each(list, function (value) {
                    _has(unique, value) || unique.push(value);
                });

                return unique;
            }

            //handle object list
            unique = {};

            _each(list, function (value, key) {
                _has(unique, value) || (unique[key] = value);
            });

            return unique;
        };

        /**
         * Returns union of lists, passed as arguments
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.union([1, 2], 2, [3], 4));
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    2,
         *     //    3,
         *     //    4
         *     //]
         *
         *     //for Object
         *     console.log(xs.union({
         *         a: 1,
         *         g: 0,
         *     }, {
         *         b: 1,
         *     }, {
         *         b: 2,
         *         a: 2,
         *         i: {},
         *         h: 4
         *     }));
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    g: 0,
         *     //    b: 1,
         *     //    i: {},
         *     //    h: 4
         *     //}
         *
         * @method union
         *
         * @return {Array|Object} lists union
         */
        var _union = me.union = function () {
            var merge = _concatenate([], _slice(arguments));

            //get union scenario
            var byObject = xs.size(merge) && _every(merge, function (arg) {

                return xs.isObject(arg);
            });

            var union;

            //handle object union
            if (byObject) {
                union = {};

                _each(merge, function (value) {
                    _each(value, function (value, key) {
                        _hasKey(union, key) || (union[key] = value);
                    });
                });

                return union;
            }

            //handle array union
            union = [];

            _each(merge, function (value) {
                if (xs.isArray(value)) {
                    _each(value, function (value) {
                        union.push(value);
                    });
                } else {
                    union.push(value);
                }
            });

            return union;
        };

        /**
         * Returns intersection of given lists (although intersection values are unique)
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.intersection([1, 2], [2, 3]));
         *     //outputs:
         *     //[
         *     //    2
         *     //]
         *
         *     //for Object
         *     console.log(xs.intersection({
         *         a: 1,
         *         b: 2,
         *     }, {
         *         b: 1,
         *     }));
         *     //outputs:
         *     //{
         *     //    a: 1
         *     //}
         *
         * @method intersection
         *
         * @return {Array|Object} lists intersection
         */
        me.intersection = function () {
            var others = _slice(arguments), merge = _concatenate([], others);

            //whether to handle objects intersection
            var byObject = _every(merge, function (arg) {

                return xs.isObject(arg);
            });

            //get all values list
            var all = _unique(_union(others)), //define intersection
                intersect;

            //handle object list
            if (byObject) {
                intersect = {};

                //iterate over each value (they are unique)
                _each(all, function (value, key) {
                    //if each array has this value, it belongs to intersection
                    _every(others, function (arr) {

                        return _has(arr, value);
                    }) && (intersect[key] = value);
                });

                return intersect;
            }

            //handle array list
            intersect = [];

            //iterate over each value (they are unique)
            _each(all, function (value) {
                //if each array has this value, it belongs to intersection
                _every(others, function (arr) {

                    return _has(arr, value);
                }) && intersect.push(value);
            });

            return intersect;
        };

        /**
         * Takes the difference between one list and a number of other lists.
         * Values, that are presented just in the first list will remain.
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.difference([1, 2], [2, 3]));
         *     //outputs:
         *     //[
         *     //    1
         *     //]
         *
         *     //for Object
         *     console.log(xs.difference({
         *         a: 1,
         *         b: 2,
         *     }, {
         *         b: 1,
         *     }));
         *     //outputs:
         *     //{
         *     //    b: 2
         *     //}
         *
         * @method difference
         *
         * @param {Array|Object} list differed list
         *
         * @return {Array|Object} difference list
         */
        me.difference = function (list) {
            //get objects list
            var others = _slice(arguments, 1);

            //return clone if no subtracted elements given
            if (!others.length) {

                return _clone(list);
            }

            //iterate over each value in values (they are unique)
            return _findAll(list, function (value) {

                //check whether all other objects have this value
                return _none(others, function (other) {

                    return _has(other, value);
                });
            });
        };

        /**
         * Returns copy of list with only white-listed keys, passed in 2+ arguments
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.pick([
         *         1,
         *         2,
         *         3,
         *         4,
         *         5,
         *         6,
         *     ], 1, [3, 2], [5]));
         *     //outputs:
         *     //[
         *     //    2,
         *     //    4,
         *     //    3,
         *     //    6
         *     //]
         *
         *     //for Object
         *     console.log(xs.pick({
         *         a: 1,
         *         c: 2,
         *         d: 3,
         *         b: 4,
         *         f: 5,
         *         e: 6,
         *     }, 'a', ['c', 'e'], ['d']));
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    e: 6,
         *     //    d: 3
         *     //}
         *
         * @method pick
         *
         * @param {Array|Object} list source list
         *
         * @return {Array|Object} picked list
         */
        me.pick = function (list) {
            var copy, keys = _union(_slice(arguments, 1));

            //handle array list
            if (xs.isArray(list)) {
                copy = [];

                _each(keys, function (key) {
                    _hasKey(list, key) && copy.push(list[key]);
                });

                return copy;
            }

            //handle object list
            copy = {};

            _each(keys, function (key) {
                _hasKey(list, key) && (copy[key] = list[key]);
            });

            return copy;
        };

        /**
         * Returns copy of list without blacklisted keys, passed in 2+ arguments
         *
         * For example:
         *
         *     //for Array
         *     console.log(xs.omit([
         *         1,
         *         2,
         *         3,
         *         4,
         *         5,
         *         6,
         *     ], 1, [3, 2], [5]));
         *     //outputs:
         *     //[
         *     //    1,
         *     //    5
         *     //]
         *
         *     //for Object
         *     console.log(xs.omit({
         *         a: 1,
         *         c: 2,
         *         d: 3,
         *         b: 4,
         *         f: 5,
         *         e: 6,
         *     }, 'a', ['c', 'e'], ['d']));
         *     //outputs:
         *     //{
         *     //    b: 4,
         *     //    f: 5
         *     //}
         *
         * @method omit
         *
         * @param {Array|Object} list source list
         *
         * @return {Array|Object}
         */
        me.omit = function (list) {
            var copy, keys = _union(_slice(arguments, 1));

            //handle array list
            if (xs.isArray(list)) {
                copy = [];

                _each(list, function (value, key) {
                    _has(keys, key) || copy.push(value);
                });

                return copy;
            }

            //handle object list
            copy = {};

            _each(list, function (value, key) {
                _has(keys, key) || (copy[key] = value);
            });

            return copy;
        };
    });

    //extend xs with list
    Object.keys(list).forEach(function (key) {
        xs[key] = list[key];
    });
})(window, 'xs');