/*!
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
 * @class xs.Set
 * @singleton
 * @private
 * xs.Set is private singleton, defining basic set operations, for both Array and Object
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var set = new (function () {
        var me = this;
        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice), concat = Function.prototype.apply.bind(Array.prototype.concat);
        /**
         * returns all list keys
         *
         * @method keys
         *
         * @param {Array|Object} list list, keys are fetched from
         *
         * @returns {Array} list keys
         */
        var _keys = me.keys = function (list) {
            return Object.keys(list);
        };
        /**
         * returns all list values
         *
         * @method values
         *
         * @param {Array|Object} list list, values are fetched from
         *
         * @returns {Array} list values
         */
        me.values = function (list) {
            if (xs.isArray(list)) {
                return slice(list);
            }
            var values = [], idx, keys = _keys(list), len = keys.length;
            for (idx = 0; idx < len; idx++) {
                values.push(list[keys[idx]]);
            }
            return values;
        };
        /**
         * returns whether list has given key
         *
         * @method hasKey
         *
         * @param {Array|Object} list list to search within
         * @param {string|number} key key to lookup for
         *
         * @returns {boolean} whether list has key
         */
        me.hasKey = function (list, key) {
            if (xs.isArray(list)) {
                return key < list.length;
            } else {
                return list.hasOwnProperty(key);
            }
        };
        /**
         * returns whether list has element
         *
         * @method has
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @returns {boolean} whether list has value
         */
        me.has = function (list, value) {
            return _find(list, function (val) {
                return val === value;
            }) !== undefined;
        };
        /**
         * returns key of first list element, equal to given
         *
         * @method keyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @returns {string|number|undefined} found key, or undefined if nothing found
         */
        me.keyOf = function (list, value) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                if (list[name] === value) {
                    return name;
                }
            }
            return undefined;
        };
        /**
         * returns key of last list element, equal to given
         *
         * @method lastKeyOf
         *
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @returns {string|number|undefined} found key, or undefined if nothing found
         */
        me.lastKeyOf = function (list, value) {
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                if (list[name] === value) {
                    return name;
                }
            }
            return undefined;
        };
        /**
         * returns size of list
         *
         * @method size
         *
         * @param {Array|Object} list list, to get size of
         *
         * @returns {number} size of list
         */
        me.size = function (list) {
            if (xs.isArray(list)) {
                return list.length;
            } else {
                return Object.keys(list).length;
            }
        };
        /**
         * iterates over list items
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
         * iterates over list items in reverse order
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
         * produces a new list with elements, returned by iterator function
         * if source was array - array is created
         * if source was object - object is created
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
            _each(list, function (value, key, array) {
                result[key] = iterator.call(this, value, key, array);
            }, scope);
            return result;
        };
        /**
         * reduces a list of elements, returned by iterator function from left
         *
         * @method reduce
         *
         * @param {Array|Object} list reduced list
         * @param {Function} iterator reducing function
         * @param {*} memo initial value
         * @param {Object} scope optional scope
         *
         * @return {*} Reducing result
         */
        me.reduce = function (list, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                var key = _keys(list).shift();
                result = list[key];
                list = _omit(list, key);
            }
            _each(list, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces a list of elements, returned by iterator function from right
         *
         * @method reduceRight
         *
         * @param {Array|Object} list reduced list
         * @param {Function} iterator reducing function
         * @param {*} memo initial value
         * @param {Object} scope optional scope
         *
         * @return {*} Reducing result
         */
        me.reduceRight = function (list, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                var key = _keys(list).pop();
                result = list[key];
                list = _omit(list, key);
            }
            _eachReverse(obj, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * returns first list element, that passes given test function
         *
         * @method find
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {*} found value, undefined if nothing found
         */
        var _find = this.find = function (list, finder, scope) {
            var idx, keys = _keys(list), len = keys.length, name, value;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                value = list[name];
                if (finder.call(scope, value, name, list)) {
                    return value;
                }
            }
        };
        /**
         * returns last list element, that passes given test function
         *
         * @method findLast
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {*} found value, undefined if nothing found
         */
        this.findLast = function (list, finder, scope) {
            var idx, keys = _keys(list), len = keys.length, name, value;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                value = list[name];
                if (finder.call(scope, value, name, list)) {
                    return value;
                }
            }
        };
        /**
         * returns all list elements, that pass given test function
         *
         * @method findAll
         *
         * @param {Array|Object} list list, search is made over
         * @param {Function} finder function, returning true if item matches given conditions
         * @param {Object} scope optional scope
         *
         * @returns {Array|Object} found values
         */
        this.findAll = function (list, finder, scope) {
            var keys = [];
            _each(list, function (value, name, obj) {
                finder.call(this, value, name, obj) && keys.push(name);
            }, scope);
            return _pick(list, keys);
        };
        /**
         * returns first list item, that suites where clause
         *
         * @method filter
         *
         * @param {Array|Object} list filtered object
         * @param {Object} where clause object
         *
         * @returns {*} first object, that suites clause, or undefined, if nothing suites
         */
        this.filter = function (list, where) {
            var idx, keys = _keys(list), len = keys.length, name, value, ok;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                value = list[name];
                ok = _every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
                }
            }
        };
        /**
         * returns last list item, that suites where clause
         *
         * @method filterLast
         *
         * @param {Array|Object} list filtered object
         * @param {Object} where clause object
         *
         * @returns {*} first object, that suites clause, or undefined, if nothing suites
         */
        this.filterLast = function (list, where) {
            var idx, keys = _keys(list), len = keys.length, name, value, ok;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                value = list[name];
                ok = _every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
                }
            }
        };
        /**
         * returns all list items, that suite where clause
         *
         * @method filterAll
         *
         * @param {Array|Object} list filtered object
         * @param {Object} where clause object
         *
         * @returns {Array|Object} List elements, filtered from original
         */
        this.filterAll = function (list, where) {
            var keys = [];
            _each(list, function (value, name) {
                _every(where, function (param, name) {
                    return value[name] === param;
                }) && keys.push(name);
            }, this);
            return _pick(list, keys);
        };
        /**
         * returns whether all list items pass tester function
         * @param list
         * @param tester
         * @param scope
         * @returns {Boolean}
         */
        this.every = function (list, tester, scope) {
            if (xs.isArray(list)) {
                return xs.Array.every(list, tester, scope);
            } else {
                return xs.Object.every(list, tester, scope);
            }
        };
        /**
         * returns whether count of list items pass tester function
         * @param list
         * @param tester
         * @param scope
         * @param count
         * @returns {Boolean}
         */
        this.some = function (list, tester, scope, count) {
            if (xs.isArray(list)) {
                return xs.Array.some(list, tester, scope, count);
            } else {
                return xs.Object.some(list, tester, scope, count);
            }
        };
        /**
         * returns first item of list
         * @param list
         * @returns {*}
         */
        this.first = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.first(list);
            } else {
                return xs.Object.first(list);
            }
        };
        /**
         * returns last item of list
         * @param list
         * @returns {*}
         */
        this.last = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.last(list);
            } else {
                return xs.Object.last(list);
            }
        };
        /**
         * shifts and returns first item from list
         * @param list
         * @returns {*}
         */
        this.shift = function (list) {
            if (xs.isArray(list)) {
                return list.shift();
            } else {
                return xs.Object.shift(list);
            }
        };
        /**
         * pops and returns last item from list
         * @param list
         * @param value
         * @returns {*}
         */
        this.pop = function (list, value) {
            if (xs.isArray(list)) {
                return list.pop();
            } else {
                return xs.Object.pop(list, value);
            }
        };
        /**
         * removes first item from list, that matches elem as key or as value
         * @param list
         * @param elem
         */
        this.remove = function (list, elem) {
            if (xs.isArray(list)) {
                return xs.Array.remove(list, elem);
            } else {
                return xs.Object.remove(list, elem);
            }
        };
        /**
         * removes last item from list, that matches elem as key or as value
         * @param list
         * @param elem
         */
        this.removeLast = function (list, elem) {
            if (xs.isArray(list)) {
                return xs.Array.removeLast(list, elem);
            } else {
                return xs.Object.removeLast(list, elem);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param list
         */
        this.removeAll = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.removeAll.apply(xs.Array, arguments);
            } else {
                return xs.Object.removeAll.apply(xs.Object, arguments);
            }
        };
        /**
         * returns clone of list (shallow copied)
         * @param list
         * @returns {Array|Object}
         */
        this.clone = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.clone(list);
            } else {
                return xs.Object.clone(list);
            }
        };
        /**
         * copies all properties from objects/arrays, passed as arguments to given obj
         * @param obj
         * @returns {*}
         */
        var _extend = this.extend = function (obj) {
            var adds = xs.Array.union(slice(arguments, 1));
            xs.each(adds, function (source) {
                source !== null && typeof source == 'object' && _each(source, function (value, name) {
                    obj[name] = value;
                });
            }, this);
            return obj;
        };
        /**
         * returns clone of list (shallow copied)
         * @param list
         * @returns {Array|Object}
         */
        this.compact = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.compact(list);
            } else {
                return xs.Object.compact(list);
            }
        };
        this.shuffle = function (list) {

        };
        /**
         * returns union of lists, passed as arguments, or array of lists as single argument
         * @returns {Array|Object}
         */
        this.union = function () {
            if (!arguments.length) {
                return {};
            }
            var merge = xs.Array.union(arguments.length == 1 ? slice(arguments).pop() : slice(arguments));
            var byObject = merge.every(function (arg) {
                return xs.isIterable(arg);
            });
            if (byObject) {
                return xs.Object.union.apply(xs.Object, arguments);
            } else {
                return xs.Array.union.apply(xs.Array, arguments);
            }
        };
        /**
         * returns intersection of given lists (although intersection elements are unique)
         * @returns {Array|Object}
         */
        this.intersection = function (list) {
            if (!arguments.length) {
                return {};
            }
            if (xs.isArray(arguments[0])) {
                return xs.Array.intersection.apply(xs.Array, arguments);
            } else {
                return xs.Object.intersection.apply(xs.Object, arguments);
            }
        };
        /**
         * Take the difference between one list and a number of other lists.
         * Only the elements present in just the first array will remain.
         * @param list
         * @returns {Array|Object}
         */
        this.difference = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.difference.apply(xs.Array, arguments);
            } else {
                return xs.Object.difference.apply(xs.Object, arguments);
            }
        };
        /**
         * returns list, filled by unique items of given list
         * @param list
         * @returns {Array|Object}
         */
        this.unique = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.unique(list);
            } else {
                return xs.Object.unique(list);
            }
        };
        /**
         * returns copy of list with only white-listed keys, passed in 2+ arguments
         * @param list
         * @returns {Array|Object}
         */
        this.pick = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.pick.apply(xs.Array, arguments);
            } else {
                return xs.Object.pick.apply(xs.Object, arguments);
            }
        };
        /**
         * returns copy of list without blacklisted keys, passed in 2+ arguments
         * @param list
         * @returns {Array|Object}
         */
        this.omit = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.omit.apply(xs.Array, arguments);
            } else {
                return xs.Object.omit.apply(xs.Object, arguments);
            }
        };
        /**
         * updates list with defaulted values, passed in 2+ arguments
         * @param list
         * @returns {Array|Object}
         */
        this.defaults = function (list) {
            if (xs.isArray(list)) {
                return xs.Array.defaults.apply(xs.Array, arguments);
            } else {
                return xs.Object.defaults.apply(xs.Object, arguments);
            }
        };
    });
    xs.Object.extend(xs, set);
})(window, 'xs');