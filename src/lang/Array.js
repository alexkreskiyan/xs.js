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
 * array class pre-definition
 * @type {}
 * @private
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var array = xs.Array = new (function () {
        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice),
            concat = Function.prototype.apply.bind(Array.prototype.concat);
        /**
         * returns array keys
         * @param arr to fetch keys from
         * @returns {Array}
         */
        this.keys = function (arr) {
            return Object.keys(arr);
        };
        /**
         * returns array values
         * @param arr to fetch values from
         * @returns {array}
         */
        this.values = function (arr) {
            return slice(arr);
        };
        /**
         * returns whether array has key
         * @param arr
         * @param key
         * @returns {boolean}
         */
        this.hasKey = function (arr, key) {
            return key < arr.length;
        };
        /**
         * returns whether array has given value
         * @param arr
         * @param value
         * @returns {boolean}
         */
        this.has = function (arr, value) {
            return arr.indexOf(value) >= 0;
        };
        /**
         * returns index of first array item, that is equal to given value
         * @param arr
         * @param value
         * @returns {string|Number|undefined}
         */
        this.keyOf = function (arr, value) {
            var index = arr.indexOf(value);
            return index > -1 ? index : undefined;
        };
        /**
         * returns index of last array item, that is equal to given value
         * @param arr
         * @param value
         * @returns {string|Number|undefined}
         */
        this.lastKeyOf = function (arr, value) {
            var index = arr.lastIndexOf(value);
            return index > -1 ? index : undefined;
        };
        /**
         * iterates over array in direct order
         * @param arr
         * @param iterator
         * @param scope
         */
        this.each = function (arr, iterator, scope) {
            var idx,
                len = arr.length;
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
        this.eachReverse = function (arr, iterator, scope) {
            var idx,
                len = arr.length;
            for (idx = len - 1; idx >= 0; idx--) {
                iterator.call(scope, arr[idx], idx, arr);
            }
        };
        /**
         * returns first element in array, that matches given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {*}
         */
        this.find = function (arr, finder, scope) {
            var idx,
                len = arr.length,
                item;
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
        this.findLast = function (arr, finder, scope) {
            var idx,
                len = arr.length,
                item;
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
        this.findAll = function (arr, finder, scope) {
            return arr.filter(finder, scope);
        };
        /**
         * returns first array item, that matches given where clause
         * @param arr
         * @param where
         * @returns {*}
         */
        this.filter = function (arr, where) {
            var idx,
                len = arr.length,
                item,
                ok;
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
        this.filterLast = function (arr, where) {
            var idx,
                len = arr.length,
                item,
                ok;
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
        this.filterAll = function (arr, where) {
            var idx,
                len = arr.length,
                item,
                ok,
                keys = [];
            for (idx = 0; idx < len; idx++) {
                item = arr[idx];
                ok = xs.Object.every(where, function (param, name) {
                    return item[name] === param;
                });
                ok && keys.push(idx);
            }
            return this.pick(arr, keys);
        };
        /**
         * returns whether all elements of given array pass given tester function
         * @param arr
         * @param tester
         * @param scope
         * @returns {*|boolean}
         */
        this.every = function (arr, tester, scope) {
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
        this.some = function (arr, tester, count, scope) {
            var idx,
                len = arr.length,
                item,
                found = 0;
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
        this.first = function (arr) {
            return arr[0];
        };
        /**
         * returns last element of given array
         * @param arr
         * @returns {*}
         */
        this.last = function (arr) {
            return arr[arr.length - 1];
        };
        /**
         * removes first element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        this.remove = function (arr, element) {
            if (typeof element == 'number' && this.hasKey(arr, element)) {
                arr.splice(element, 1);
            } else {
                var key = this.keyOf(arr, element);
                key !== undefined && arr.splice(key, 1);
            }
        };
        /**
         * removes last element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        this.removeLast = function (arr, element) {
            if (typeof element == 'number' && this.hasKey(arr, element)) {
                arr.splice(element, 1);
            } else {
                var key = this.lastKeyOf(arr, element);
                key !== undefined && arr.splice(key, 1);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param arr
         * @param element
         */
        this.removeAll = function (arr, element) {
            var elements = this.union(slice(arguments, 1));
            this.each(elements, function (element) {
                this.remove(arr, element);
            }, this);
        };
        /**
         * returns shallow-copied clone of array
         * @param arr
         * @returns {*}
         */
        this.clone = function (arr) {
            return slice(arr);
        };
        /**
         * returns copy of given array, filtered not to have falsy values
         * @param arr
         * @returns {*}
         */
        this.compact = function (arr) {
            return arr.filter(function (value) {
                return value;
            })
        };
        /**
         * shuffles array elements
         * @param arr
         */
        this.shuffle = function (arr) {
            arr.sort(function () {
                return Math.random() - 0.5;
            })
        };
        /**
         * returns union of arrays, passed as arguments, or array of arrays as single argument
         * @returns {*}
         */
        this.union = function () {
            var arrays = arguments.length == 1 ? slice(arguments).pop() : slice(arguments);
            return concat([], arrays);
        };
        /**
         * returns intersection of given arrays (although intersection elements are unique)
         * @returns {Array}
         */
        this.intersection = function () {
            var arrays = arguments.length == 1 ? slice(arguments).pop() : slice(arguments), //get arrays list
                all = this.unique(this.union(arrays)), //get all items list
                intersect = [], //define intersection
                idx,
                len = all.length,
                item;
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
        this.difference = function (arr) {
            var arrays = this.union(slice(arguments, 1));
            return arr.filter(function (value) {
                return arrays.indexOf(value) < 0;
            }, this);
        };
        /**
         * returns array, filled by unique items of given array
         * @param arr
         * @returns {Array}
         */
        this.unique = function (arr) {
            var unique = [],
                idx,
                len = arr.length,
                item;
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
        this.pick = function (arr) {
            var copy = [],
                keys = this.union(slice(arguments, 1)),
                keysLen = keys.length,
                len = arr.length,
                idx,
                item;
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
        this.omit = function (arr) {
            var copy = [],
                keys = this.union(slice(arguments, 1)),
                len = arr.length,
                idx,
                item;
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
        this.defaults = function (arr) {
            var defaults = this.union(slice(arguments, 1)),
                len = defaults.length,
                idx;
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
        this.range = function (start, stop, step) {
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
    });
    xs.Object.extend(xs, {
        shuffle: array.shuffle,
        range: array.range
    });
})(window, 'xs');