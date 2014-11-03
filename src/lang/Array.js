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

    var array = xs.Array = new (function () {
        var me = this;
        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice), concat = Function.prototype.apply.bind(Array.prototype.concat);
        /**
         * returns index of first array item, that is equal to given value
         * @param arr
         * @param value
         * @returns {string|Number|undefined}
         */
        var _keyOf = me.keyOf = function (arr, value) {
            var index = arr.indexOf(value);
            return index > -1 ? index : undefined;
        };
        /**
         * returns index of last array item, that is equal to given value
         * @param arr
         * @param value
         * @returns {string|Number|undefined}
         */
        var _lastKeyOf = me.lastKeyOf = function (arr, value) {
            var index = arr.lastIndexOf(value);
            return index > -1 ? index : undefined;
        };
        /**
         * iterates over array in direct order
         * @param arr
         * @param iterator
         * @param scope
         */
        var _each = me.each = function (arr, iterator, scope) {
            var idx, len = arr.length;
            for (idx = 0; idx < len; idx++) {
                iterator.call(scope, arr[idx], idx, arr);
            }
        };
        /**
         * iterates over array in reverse order
         * @param arr
         * @param iterator
         * @param scope
         */
        var _eachReverse = me.eachReverse = function (arr, iterator, scope) {
            var idx, len = arr.length;
            for (idx = len - 1; idx >= 0; idx--) {
                iterator.call(scope, arr[idx], idx, arr);
            }
        };
        /**
         * produces a new array with elements, updated by iterator function
         * @param {Array} arr
         * @param {Function} iterator
         * @param {Object|undefined} scope
         * @returns {Array}
         */
        this.map = function (arr, iterator, scope) {
            var result = _clone(arr);
            _each(arr, function (value, key, array) {
                result[key] = iterator.call(this, value, key, array);
            }, scope);
            return result;
        };
        /**
         * reduces an array of elements, returned by iterator function from left
         * @param {Array} arr reduced array
         * @param {Function} iterator
         * @param {Object|undefined} scope
         * @param {*} memo initial reduce value
         * @returns {*}
         */
        this.reduce = function (arr, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = arr.shift();
            }
            _each(arr, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces an array of elements, returned by iterator function from right
         * @param {Array} arr reduced array
         * @param {Function} iterator
         * @param {Object|undefined} scope
         * @param {*} memo initial reduce value
         * @returns {*}
         */
        this.reduceRight = function (arr, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = arr.pop();
            }
            _eachReverse(obj, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * returns first element in array, that matches given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {*}
         */
        me.find = function (arr, finder, scope) {
            var idx, len = arr.length, item;
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                if (finder.call(scope, item, idx, arr)) {
                    return item;
                }
            }
        };
        /**
         * returns last element in array, that matches given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {*}
         */
        me.findLast = function (arr, finder, scope) {
            var idx, len = arr.length, item;
            for (idx = len - 1; idx >= 0; idx--) {
                item = arr[idx];
                if (finder.call(scope, item, idx, arr)) {
                    return item;
                }
            }
        };
        /**
         * returns array of all elements in given array, that match given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {Array|*}
         */
        me.findAll = function (arr, finder, scope) {
            return arr.filter(finder, scope);
        };
        /**
         * returns first array item, that matches given where clause
         * @param arr
         * @param where
         * @returns {*}
         */
        me.filter = function (arr, where) {
            var idx, len = arr.length, item, ok;
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                ok = xs.Object.every(where, function (param, name) {
                    return item[name] === param;
                });
                if (ok) {
                    return item;
                }
            }
        };
        /**
         * returns last array item, that matches given where clause
         * @param arr
         * @param where
         * @returns {*}
         */
        me.filterLast = function (arr, where) {
            var idx, len = arr.length, item, ok;
            for (idx = len - 1; idx >= 0; idx--) {
                item = arr[idx];
                ok = xs.Object.every(where, function (param, name) {
                    return item[name] === param;
                });
                if (ok) {
                    return item;
                }
            }
        };
        /**
         * returns array with all items of given array, that suite given where clause
         * @param arr
         * @param where
         * @returns {*|{}}
         */
        me.filterAll = function (arr, where) {
            var idx, len = arr.length, item, ok, keys = [];
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                ok = xs.Object.every(where, function (param, name) {
                    return item[name] === param;
                });
                ok && keys.push(idx);
            }
            return _pick(arr, keys);
        };
        /**
         * returns whether all elements of given array pass given tester function
         * @param arr
         * @param tester
         * @param scope
         * @returns {*|boolean}
         */
        me.every = function (arr, tester, scope) {
            return arr.every(tester, scope);
        };
        /**
         * returns whether count elements of given array pass given tester function
         * @param arr
         * @param tester
         * @param count
         * @param scope
         * @returns {boolean}
         */
        me.some = function (arr, tester, count, scope) {
            var idx, len = arr.length, item, found = 0;
            count = count || 1;
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                tester.call(scope, item, idx, arr) && found++;
                if (found >= count) {
                    return true;
                }
            }
            return false;
        };
        /**
         * returns first element of given array
         * @param arr
         * @returns {*}
         */
        me.first = function (arr) {
            return arr[0];
        };
        /**
         * returns last element of given array
         * @param arr
         * @returns {*}
         */
        me.last = function (arr) {
            return arr[arr.length - 1];
        };
        /**
         * removes first element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        var _remove = me.remove = function (arr, element) {
            if (typeof element == 'number' && _hasKey(arr, element)) {
                arr.splice(element, 1);
            } else {
                var key = _keyOf(arr, element);
                key !== undefined && arr.splice(key, 1);
            }
        };
        /**
         * removes last element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        me.removeLast = function (arr, element) {
            if (typeof element == 'number' && _hasKey(arr, element)) {
                arr.splice(element, 1);
            } else {
                var key = _lastKeyOf(arr, element);
                key !== undefined && arr.splice(key, 1);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param arr
         */
        me.removeAll = function (arr) {
            var elements = _union(slice(arguments, 1));
            _each(elements, function (element) {
                _remove(arr, element);
            });
        };
        /**
         * returns shallow-copied clone of array
         * @param arr
         * @returns {*}
         */
        var _clone = me.clone = function (arr) {
            return slice(arr);
        };
        /**
         * returns copy of given array, filtered not to have falsy values
         * @param arr
         * @returns {*}
         */
        me.compact = function (arr) {
            return arr.filter(function (value) {
                return value;
            })
        };
        /**
         * shuffles array elements
         * @param arr
         */
        me.shuffle = function (arr) {
            arr.sort(function () {
                return Math.random() - 0.5;
            })
        };
        /**
         * returns union of arrays, passed as arguments, or array of arrays as single argument
         * @returns {*}
         */
        var _union = me.union = function () {
            var arrays = arguments.length == 1 ? slice(arguments).pop() : slice(arguments);
            return concat([], arrays);
        };
        /**
         * returns intersection of given arrays (although intersection elements are unique)
         * @returns {Array}
         */
        me.intersection = function () {
            var arrays = arguments.length == 1 ? slice(arguments).pop() : slice(arguments), //get arrays list
                all = _unique(_union(arrays)), //get all items list
                intersect = [], //define intersection
                idx, len = all.length, item;
            //iterate over each element (they are unique)
            for (idx = 0; idx < len; idx++) {
                item = all[idx];
                //check whether all array have this value
                var ok = arrays.every(function (arr) {
                    return arr.indexOf(item) > -1;
                });
                ok && intersect.push(item);
            }
            return intersect;
        };
        /**
         * Take the difference between one array and a number of other arrays.
         * Only the elements present in just the first array will remain.
         * @param arr
         * @returns {Array}
         */
        me.difference = function (arr) {
            var arrays = _union(slice(arguments, 1));
            return arr.filter(function (value) {
                return arrays.indexOf(value) < 0;
            });
        };
        /**
         * returns array, filled by unique items of given array
         * @param arr
         * @returns {Array}
         */
        var _unique = me.unique = function (arr) {
            var unique = [], idx, len = arr.length, item;
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                unique.indexOf(item) < 0 && unique.push(item);
            }
            return unique;
        };
        /**
         * returns copy of array with only white-listed keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        var _pick = me.pick = function (arr) {
            var copy = [], keys = _union(slice(arguments, 1)), keysLen = keys.length, len = arr.length, idx, item;
            for (idx = 0; idx < keysLen; idx++) {
                item = keys[idx];
                item < len && (copy[item] = arr[item]);
            }
            return copy;
        };
        /**
         * returns copy of array without black-listed keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        me.omit = function (arr) {
            var copy = [], keys = _union(slice(arguments, 1)), len = arr.length, idx, item;
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                keys.indexOf(idx) < 0 && (copy[idx] = item);
            }
            return copy;
        };
        /**
         * fills elements in given arr with elements of defaults, passed in 2+ arguments
         * from the end of arr
         * @param arr
         * @returns {*}
         */
        me.defaults = function (arr) {
            var defaults = _union(slice(arguments, 1)), len = defaults.length, idx;
            for (idx = arr.length; idx < len; idx++) {
                arr[idx] = defaults[idx];
            }
            return arr;
        };
        /**
         * returns simple range array, produced according to given start, stop and step params
         * @param start
         * @param stop
         * @param step
         * @returns {Array}
         */
        me.range = function (start, stop, step) {
            //prepare arguments
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;
            //set params
            var length = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(length);
            //fill range
            while (idx <= length) {
                range[idx++] = start;
                start += step;
            }
            return range;
        };
        me.toObject = function (arr) {
            var object = {};
            _each(arr, function (index, value) {
                object[index] = value;
            });
            return object;
        }
    });
    xs.Object.extend(xs, {
        shuffle: array.shuffle,
        range:   array.range
    });
})(window, 'xs');