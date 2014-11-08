/*!
 This file is core of xs.js

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
 * @class xs.lang.List
 * @singleton
 * @private
 * xs.lang.List is private singleton, defining basic list operations, for both Array and Object
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var list = new (function () {
        var me = this;

        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice);
        var concatenate = Function.prototype.apply.bind(Array.prototype.concat);

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
         * @returns {Array} list keys
         */
        var _keys = me.keys = function (list) {
            if (xs.isArray(list)) {
                var keys = [], length = list.length;
                for (var i = 0; i < length; i++) {
                    keys.push(i);
                }
                return keys;
            }
            return Object.keys(list);
        };

        /**
         * Returns all list items
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
         * @param {Array|Object} list list, items are fetched from
         *
         * @returns {Array} list items
         */
        me.values = function (list) {
            if (xs.isArray(list)) {
                return slice(list);
            }
            var items = [], idx, keys = _keys(list), len = keys.length;
            for (idx = 0; idx < len; idx++) {
                items.push(list[keys[idx]]);
            }
            return items;
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
         * @param {string|number} key key to lookup for
         *
         * @returns {boolean} whether list has key
         */
        var _hasKey = me.hasKey = function (list, key) {
            if (xs.isArray(list)) {
                return xs.isNumber(key) && key >= 0 && key < list.length;
            }
            return xs.isString(key) && list.hasOwnProperty(key);
        };

        /**
         * Returns whether list has item
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
         *     console.log(xs.has(list, 0)); //false - no item
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
         *     console.log(xs.has(list, 0)); //false - no item
         *     console.log(xs.has(list, {})); //false - another object in array
         *     console.log(xs.has(list, 1)); //true - value exists
         *     console.log(xs.has(list, value)); //true - value exists
         *
         * @method has
         *
         * @param {Array|Object} list list to search within
         * @param {*} item item to lookup for
         *
         * @returns {boolean} whether list has item
         */
        var _has = me.has = function (list, item) {
            return _find(list, function (val) {
                return val === item;
            }) !== undefined;
        };

        /**
         * Returns key of first list item, equal to given
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
         *     console.log(xs.keyOf(list, 0)); //undefined - no item
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
         *     console.log(xs.keyOf(list, 0)); //undefined - no item
         *     console.log(xs.keyOf(list, {})); //undefined - another object in array
         *     console.log(xs.keyOf(list, 1)); //'a'
         *     console.log(xs.keyOf(list, value)); //'f'
         *
         * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
         *
         * @method keyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} item item to lookup for
         *
         * @returns {string|number|undefined} found key, or undefined if nothing found
         */
        var _keyOf = me.keyOf = function (list, item) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                if (list[name] === item) {
                    return name;
                }
            }
            return undefined;
        };

        /**
         * Returns key of last list item, equal to given
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
         *     console.log(xs.lastKeyOf(list, 0)); //undefined - no item
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
         *     console.log(xs.lastKeyOf(list, 0)); //undefined - no item
         *     console.log(xs.lastKeyOf(list, {})); //undefined - another object in array
         *     console.log(xs.lastKeyOf(list, 1)); //'c'
         *     console.log(xs.lastKeyOf(list, value)); //'e'
         *
         * ATTENTION: Try to avoid using integer indices in objects, because their order in V8 is not guaranteed!
         *
         * @method lastKeyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} item item to lookup for
         *
         * @returns {string|number|undefined} found key, or undefined if nothing found
         */
        var _lastKeyOf = me.lastKeyOf = function (list, item) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                if (list[name] === item) {
                    return name;
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
         * @returns {number} size of list
         */
        var _size = me.size = function (list) {
            if (xs.isArray(list)) {
                return list.length;
            }
            return _keys(list).length;
        };

        /**
         * Iterates over list items
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
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                iterator.call(scope, list[name], name, list);
            }
        };

        /**
         * Iterates over list items in reverse order
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
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                iterator.call(scope, list[name], name, list);
            }
        };

        /**
         * Produces a new list with items, returned by iterator function
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
         * @returns {Array|Object} Mapping result
         */
        me.map = function (list, iterator, scope) {
            var result = xs.isArray(list) ? [] : {};
            _each(list, function (item, key, array) {
                result[key] = iterator.call(this, item, key, array);
            }, scope);
            return result;
        };

        /**
         * Reduces a list of items, returned by iterator function from left
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
         * @param {*} memo initial value. Is optional. If omitted, first item's value is shifted from list and used as memo
         * @param {Object} scope optional scope
         *
         * @returns {*} Reducing result
         */
        me.reduce = function (list, iterator, memo, scope) {
            var result, copy = _clone(list);
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = _shift(copy);
            }
            _each(copy, function (item, key, object) {
                result = iterator.call(this, result, item, key, object);
            }, scope);
            return result;
        };

        /**
         * Reduces a list of items, returned by iterator function from right
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
         * @param {*} memo initial value. Is optional. If omitted, last item's value is popped from list and used as memo
         * @param {Object} scope optional scope
         *
         * @returns {*} Reducing result
         */
        me.reduceRight = function (list, iterator, memo, scope) {
            var result, copy = _clone(list);
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = _pop(copy);
            }
            _eachReverse(copy, function (item, key, object) {
                result = iterator.call(this, result, item, key, object);
            }, scope);
            return result;
        };

        /**
         * Returns first list item, that passes given test function
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
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {*} found item, undefined if nothing found
         */
        var _find = me.find = function (list, finder, scope) {
            var idx, keys = _keys(list), len = keys.length, name, item;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                item = list[name];
                if (finder.call(scope, item, name, list)) {
                    return item;
                }
            }
        };

        /**
         * Returns last list item, that passes given test function
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
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {*} found item, undefined if nothing found
         */
        var _findLast = me.findLast = function (list, finder, scope) {
            var idx, keys = _keys(list), len = keys.length, name, item;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                item = list[name];
                if (finder.call(scope, item, name, list)) {
                    return item;
                }
            }
        };

        /**
         * Returns all list items, that pass given test function
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
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {Array|Object} found items
         */
        var _findAll = me.findAll = function (list, finder, scope) {
            var isArray = xs.isArray(list);
            var copy = isArray ? [] : {};
            if (isArray) {
                _each(list, function (item, name, obj) {
                    finder.call(this, item, name, obj) && copy.push(item);
                }, scope);
            } else {
                _each(list, function (item, name, obj) {
                    finder.call(this, item, name, obj) && (copy[name] = item);
                }, scope);
            }
            return copy;
        };

        /**
         * Returns first list item, that suites where clause
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
         * @returns {Object} first object, that suites clause, or undefined, if nothing suites
         */
        me.filter = function (list, where) {
            return _find(list, function (item) {
                return _every(where, function (param, name) {
                    return item[name] === param;
                });
            });
        };

        /**
         * Returns last list item, that suites where clause
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
         * @returns {Object} first object, that suites clause, or undefined, if nothing suites
         */
        me.filterLast = function (list, where) {
            return _findLast(list, function (item) {
                return _every(where, function (param, name) {
                    return item[name] === param;
                });
            });
        };

        /**
         * Returns all list items, that suite where clause
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
         * @returns {Array|Object} List items, filtered from original
         */
        me.filterAll = function (list, where) {
            return _findAll(list, function (item) {
                return _every(where, function (param, name) {
                    return item[name] === param;
                });
            });
        };

        /**
         * Returns whether all list items pass tester function
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
         * @returns {boolean} whether all items pass tester function
         */
        var _every = me.every = function (list, tester, scope) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                if (!tester.call(scope, list[name], name, list)) {
                    return false;
                }
            }
            return true;
        };

        /**
         * Returns whether count of list items pass tester function
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
         * @param {number} count count of items needed to resolve as true
         * @param {Object} scope optional scope
         *
         * @returns {boolean}
         */
        me.some = function (list, tester, count, scope) {
            var idx, keys = _keys(list), len = keys.length, name, found = 0;
            xs.isNumber(count) || (count = 1);
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                tester.call(scope, list[name], name, list) && found++;
                if (found >= count) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns whether none of list items pass tester function
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
         * @returns {boolean} whether no one of items pass tester function
         */
        var _none = me.none = function (list, tester, scope) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                if (tester.call(scope, list[name], name, list)) {
                    return false;
                }
            }
            return true;
        };

        /**
         * Returns first item of list
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
         * @returns {*} first item, undefined if list is empty
         */
        me.first = function (list) {
            var key = _shift(_keys(list));
            return list[key];
        };

        /**
         * Returns last item of list
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
         * @returns {*} last item, undefined if list is empty
         */
        me.last = function (list) {
            var key = _pop(_keys(list));
            return list[key];
        };

        /**
         * Shifts and returns first item from list
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
         * @returns {*} First item of list
         */
        var _shift = me.shift = function (list) {
            var key = _keys(list).shift();
            var item = list[key];
            xs.isArray(list) ? list.splice(0, 1) : delete list[key];
            return item;
        };

        /**
         * Pops and returns last item from list
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
         * @returns {*} Last item of list
         */
        var _pop = me.pop = function (list) {
            var key = _keys(list).pop();
            var item = list[key];
            xs.isArray(list) ? list.splice(-1, 1) : delete list[key];
            return item;
        };

        /**
         * Deletes item with given key
         *
         * For example:
         *
         *     var item = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         item,
         *     ];
         *     console.log(xs.deleteAt(list, 0));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    2,
         *     //    item
         *     //]
         *     console.log(xs.deleteAt(list, -1));
         *     //outputs:
         *     //false, index missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: item,
         *     };
         *     console.log(xs.deleteAt(list, 'a'));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    c: 2,
         *     //    b: item
         *     //}
         *     console.log(xs.deleteAt(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method deleteAt
         *
         * @param {Array|Object} list list, item is deleted from
         * @param {number|string} key key of deleted item
         *
         * @returns {boolean} whether item was deleted
         */
        var _deleteAt = me.deleteAt = function (list, key) {
            if (_hasKey(list, key)) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];
                return true;
            }
            return false;
        };

        /**
         * Deletes first item from list, that matches given item
         *
         * For example:
         *
         *     var item = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         item,
         *         2,
         *         1,
         *         item
         *     ];
         *     console.log(xs.delete(list, item));
         *     //outputs:
         *     //true, item exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    2,
         *     //    1,
         *     //    item
         *     //]
         *     console.log(xs.delete(list, -1));
         *     //outputs:
         *     //false, item missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: item,
         *         f: 2,
         *         e: 1,
         *         d: item
         *     };
         *     console.log(xs.delete(list, item));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    f: 2,
         *     //    e: 1,
         *     //    d: item
         *     //}
         *     console.log(xs.delete(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method delete
         *
         * @param {Array|Object} list list, item is deleted from
         * @param {*} item deleted item
         *
         * @returns {boolean} whether something was deleted
         */
        me.delete = function (list, item) {
            var key = _keyOf(list, item);
            if (key !== undefined) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];
                return true;
            }
            return false;
        };

        /**
         * Deletes last item from list, that matches elem as key or as item
         *
         * For example:
         *
         *     var item = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         item,
         *         2,
         *         1,
         *         item
         *     ];
         *     console.log(xs.deleteLast(list, item));
         *     //outputs:
         *     //true, item exists
         *     console.log(list);
         *     //outputs:
         *     //[
         *     //    1,
         *     //    2,
         *     //    item,
         *     //    2,
         *     //    1
         *     //]
         *     console.log(xs.deleteLast(list, -1));
         *     //outputs:
         *     //false, item missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: item,
         *         f: 2,
         *         e: 1,
         *         d: item
         *     };
         *     console.log(xs.deleteLast(list, item));
         *     //outputs:
         *     //true, index exists
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    c: 2,
         *     //    b: item
         *     //    f: 2,
         *     //    e: 1
         *     //}
         *     console.log(xs.deleteLast(list, 0));
         *     //outputs:
         *     //false, index missing
         *
         * @method deleteLast
         *
         * @param {Array|Object} list list, item is deleted from
         * @param {*} item deleted item
         *
         * @returns {boolean} whether item was deleted
         */
        me.deleteLast = function (list, item) {
            var key = _lastKeyOf(list, item);
            if (key !== undefined) {
                xs.isArray(list) ? list.splice(key, 1) : delete list[key];
                return true;
            }
            return false;
        };

        /**
         * Deletes all items from list, passed as array/plain arguments
         *
         * For example:
         *
         *     var item = {
         *         x: 1
         *     };
         *
         *     var list = [
         *         1,
         *         2,
         *         item,
         *         2,
         *         1,
         *         item
         *     ];
         *     console.log(xs.deleteAll(list, item));
         *     //outputs:
         *     //true, item exists
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
         *     //false, item missing
         *
         *     var list = {
         *         a: 1,
         *         c: 2,
         *         b: item,
         *         f: 2,
         *         e: 1,
         *         d: item
         *     };
         *     console.log(xs.deleteAll(list, item));
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
         * @param {Array|Object} list list, items are deleted from
         *
         * @returns {number} count of deleted items
         */
        var _deleteAll = me.deleteAll = function (list, item) {
            var deleted = 0;
            //if item specified
            if (arguments.length > 1) {
                var key;
                //delete each entry
                while ((key = _keyOf(list, item)) !== undefined) {
                    _deleteAt(list, key);
                    deleted++;
                }
                return deleted;
            }
            var size = _size(list);
            if (xs.isArray(list)) {
                list.splice(0, size);
                return size;
            }
            _each(list, function (item, key) {
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
         * @returns {Array|Object} list shallow copy
         */
        var _clone = me.clone = function (list) {
            if (xs.isArray(list)) {
                return slice(list);
            }
            var copy = {};
            _extend(copy, list);
            return copy;
        };

        /**
         * Copies all properties from objects, passed as arguments to given obj
         *
         * For example:
         *
         *     var list = {
         *         x: 1
         *     };
         *     xs.extend(list, {
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
         *     //    x: 3,
         *     //    c: 2,
         *     //    a: 4
         *     //}
         *
         * @method extend
         *
         * @param {Object} object extended object
         */
        var _extend = me.extend = function (object) {
            var adds = slice(arguments, 1);
            _each(adds, function (source) {
                xs.isObject(source) && _each(source, function (item, name) {
                    object[name] = item;
                });
            });
        };

        /**
         * Returns copy of given list, filtered not to have false-like items
         *
         * @method compact
         *
         * @param {Array|Object} list compacted list
         *
         * @returns {Array|Object}
         */
        me.compact = function (list) {
            return _findAll(list, function (item) {
                return item;
            });
        };

        /**
         * Shuffles list items
         *
         * @method shuffle
         *
         * @param {Array|Object} list shuffled list
         */
        var _shuffle = me.shuffle = function (list) {
            if (xs.isArray(list)) {
                list.sort(function () {
                    return Math.random() - 0.5;
                });
                return;
            }
            var idx, keys = _keys(list), len = keys.length, name, clone = _clone(list);
            _shuffle(keys);
            _deleteAll(list);
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                list[name] = clone[name];
            }
        };

        /**
         * Returns union of lists, passed as arguments
         *
         * @method union
         *
         * @returns {Array|Object} lists union
         */
        var _union = me.union = function () {
            var merge = concatenate([], slice(arguments));
            var byObject = _every(merge, function (arg) {
                return xs.isObject(arg);
            });
            var union;
            if (byObject) {
                union = {};
                _each(merge, function (item) {
                    _each(item, function (item, key) {
                        _hasKey(union, key) || (union[key] = item);
                    });
                });
                return union;
            }
            union = [];
            _each(merge, function (item) {
                if (xs.isArray(item)) {
                    _each(item, function (item) {
                        union.push(item);
                    });
                } else {
                    union.push(item);
                }
            });
            return union;
        };

        /**
         * Returns intersection of given lists (although intersection items are unique)
         *
         * @method intersection
         *
         * @returns {Array|Object} lists intersection
         */
        me.intersection = function () {
            var others = slice(arguments), merge = concatenate([], others);
            var byObject = _every(merge, function (arg) {
                return xs.isObject(arg);
            });
            var all = _unique(_union(others)), //get all items list
                intersect; //define intersection
            if (byObject) {
                intersect = {};
                //iterate over each item (they are unique)
                _each(all, function (item, name) {
                    //if each array has this item, it belongs to intersection
                    _every(others, function (arr) {
                        return _has(arr, item);
                    }) && (intersect[name] = item);
                });
                return intersect;
            }
            intersect = [];
            //iterate over each item (they are unique)
            _each(all, function (item) {
                //if each array has this item, it belongs to intersection
                _every(others, function (arr) {
                    return _has(arr, item);
                }) && intersect.push(item);
            });
            return intersect;
        };

        /**
         * Takes the difference between one list and a number of other lists.
         * Items, that are presented just in the first list will remain.
         *
         * @method difference
         *
         * @param {Array|Object} list differed list
         *
         * @returns {Array|Object} difference list
         */
        me.difference = function (list) {
            var others = slice(arguments, 1); //get objects list
            if (!others.length) {
                return _clone(list);
            }
            //iterate over each item in items (they are unique)
            return _findAll(list, function (item) {
                //check whether all other objects have this item
                return _none(others, function (other) {
                    return _has(other, item);
                });
            });
        };

        /**
         * Returns list, filled by unique items of given list
         *
         * @method unique
         *
         * @param {Array|Object} list given list
         *
         * @returns {Array|Object} copy with unique items
         */
        var _unique = me.unique = function (list) {
            var unique;
            if (xs.isArray(list)) {
                unique = [];
                _each(list, function (item) {
                    _has(unique, item) || unique.push(item);
                });
                return unique;
            }
            unique = {};
            _each(list, function (item, name) {
                _has(unique, item) || (unique[name] = item);
            });
            return unique;
        };

        /**
         * Returns copy of list with only white-listed keys, passed in 2+ arguments
         *
         * @method pick
         *
         * @param {Array|Object} list source list
         *
         * @returns {Array|Object} picked list
         */
        me.pick = function (list) {
            var copy, keys = _union(slice(arguments, 1));
            if (xs.isArray(list)) {
                copy = [];
                _each(keys, function (key) {
                    _hasKey(list, key) && copy.push(list[key]);
                });
                return copy;
            }
            copy = {};
            _each(keys, function (key) {
                _hasKey(list, key) && (copy[key] = list[key]);
            });
            return copy;
        };

        /**
         * Returns copy of list without blacklisted keys, passed in 2+ arguments
         *
         * @method omit
         *
         * @param {Array|Object} list source list
         * @returns {Array|Object}
         */
        me.omit = function (list) {
            var copy, keys = _union(slice(arguments, 1));
            if (xs.isArray(list)) {
                copy = [];
                _each(list, function (item, name) {
                    _has(keys, name) || copy.push(item);
                });
                return copy;
            }
            copy = {};
            _each(list, function (item, name) {
                _has(keys, name) || (copy[name] = item);
            });
            return copy;
        };

        /**
         * Updates list with defaulted items, passed in 2+ arguments
         *
         * @method defaults
         *
         * @param {Array|Object} list operated list
         */
        me.defaults = function (list) {
            var defaults = _union(slice(arguments, 1));
            if (xs.isArray(list)) {
                var len = defaults.length, idx;
                for (idx = list.length; idx < len; idx++) {
                    list[idx] = defaults[idx];
                }
                return;
            }
            _each(defaults, function (item, name) {
                _hasKey(list, name) || (list[name] = item);
            });
        };
    });
    list.extend(xs, list);
})(window, 'xs');