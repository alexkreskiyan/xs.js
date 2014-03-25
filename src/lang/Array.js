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
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    xs.Array = new (function () {
        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice),
            concat = Function.prototype.apply.bind(Array.prototype.concat);
        /**
         * returns array keys
         * @param arr to fetch keys from
         * @returns {Array}
         */
        this.keys = function (arr) {
            return this.range(arr.length - 1);
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
         * returns first element in array, that matches given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {*}
         */
        this.find = function (arr, finder, scope) {
            var keys = this.keys(arr);
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = arr[name];
                if (finder.call(scope, value, name, arr)) {
                    return value;
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
            var keys = this.keys(arr).reverse();
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = arr[name];
                if (finder.call(scope, value, name, arr)) {
                    return value;
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
         * returns first array item, that suites given where clause
         * @param arr
         * @param where
         * @returns {*}
         */
        this.filter = function (arr, where) {
            var keys = this.keys(arr);
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = arr[name];
                var ok = xs.Object.every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
                }
            }
        };
        /**
         * returns last array item, that suites given where clause
         * @param arr
         * @param where
         * @returns {*}
         */
        this.filterLast = function (arr, where) {
            var keys = this.keys(arr).reverse();
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = arr[name];
                var ok = xs.Object.every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
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
            var props = [];
            var keys = this.keys(obj);
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = obj[name];
                var ok = xs.Object.every(where, function (param, name) {
                    return value[name] === param;
                });
                ok && props.push(name);
            }
            return this.pick(arr, props);
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
         * @param scope
         * @param count
         * @returns {boolean}
         */
        this.some = function (arr, tester, scope, count) {
            count = count || 1;
            var found = 0;
            var keys = this.keys(arr);
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) {
                    continue;
                }
                var name = keys[index], value = arr[name];
                tester.call(scope, value, name, arr) && found++;
                if (found == count) {
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
            var key = this.keys(arr).shift();
            return arr[key];
        };
        /**
         * returns last element of given array
         * @param arr
         * @returns {*}
         */
        this.last = function (arr) {
            var key = this.keys(arr).pop();
            return arr[key];
        };
        /**
         * removes first element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        this.remove = function (arr, element) {
            if (typeof element == 'number' && element < arr.length) {
                arr.splice(element, 1);
            } else if (arr.indexOf(element) >= 0) {
                arr.splice(arr.indexOf(element), 1);
            }
        };
        /**
         * removes last element of given array, that suites element as key or value
         * @param arr
         * @param element
         */
        this.removeLast = function (arr, element) {
            if (typeof element == 'number' && element < arr.length) {
                arr.splice(element, 1);
            } else if (arr.indexOf(element) >= 0) {
                arr.splice(arr.lastIndexOf(element), 1);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param arr
         * @param element
         */
        this.removeAll = function (arr, element) {
            var elements = this.union(slice(arguments, 1));
            elements.forEach(function (element) {
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
            //get arrays list
            var arrays = arguments.length == 1 ? slice(arguments).pop() : slice(arguments);
            //get all items list
            var all = this.uniques(this.union(arrays));
            //define intersection
            var intersect = [];
            //iterate over each element (they are unique)
            all.forEach(function (value) {
                //check whether all array have this value
                var ok = arrays.every(function (arr) {
                    return arr.indexOf(value) > -1;
                });
                ok && intersect.push(value);
            });
            return intersect;
        };
        /**
         * Take the difference between one array and a number of other arrays.
         * Only the elements present in just the first array will remain.
         * @type {Function}
         */
        this.difference = function (arr) {
            var rest = this.union(slice(arguments, 1));
            return arr.filter(function (value) {
                return rest.indexOf(value) < 0;
            }, this);
        };
        /**
         * returns array, filled by unique items of given array
         * @param arr
         * @returns {Array}
         */
        this.unique = function (arr) {
            var unique = [];
            arr.forEach(function (value) {
                unique.indexOf(value) < 0 && unique.push(value);
            });
            return unique;
        };
        /**
         * returns copy of array with only white-listed keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        this.pick = function (arr) {
            var copy = [];
            var keys = this.union(slice(arguments, 1));
            keys.forEach(function (key) {
                key in arr && (copy[key] = arr[key]);
            });
            return copy;
        };
        /**
         * returns copy of array without black-listed keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        this.omit = function (arr) {
            var copy = [];
            var keys = this.union(slice(arguments, 1));
            arr.forEach(function (value, name) {
                keys.indexOf(name) < 0 && (copy[name] = value);
            }, this);
            return copy;
        };
        /**
         * fills elements in given arr with elements of defaults, passed in 2+ arguments
         * from the end of arr
         * @param arr
         * @returns {*}
         */
        this.defaults = function (arr) {
            var defaults = this.union(slice(arguments, 1));
            for (var i = arr.length; i < defaults.length; i++) {
                arr[i] = defaults[i];
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
})(window, 'xs');