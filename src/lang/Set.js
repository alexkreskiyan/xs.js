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
         * @param {Array|Object} list
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
         * @param {Array|Object} list
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
         * @param {Array|Object} list to search within
         * @param {String|Number} key to lookup for
         *
         * @returns {Boolean} whether list has key
         */
        var _hasKey = me.hasKey = function (list, key) {
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
         * @param {Array|Object} list to search within
         * @param {*} value to lookup for
         *
         * @returns {Boolean} whether list has value
         */
        me.has = function (list, value) {
            if (xs.isArray(list)) {
                return list.indexOf(value) >= 0;
            } else {
                return _find(list, function (val) {
                    return val === value;
                }) !== undefined;
            }
        };
        /**
         * returns key of first list element, equal to given
         * @param list to search within
         * @param value to lookup for
         * @returns {String|Number|undefined}
         */
        this.keyOf = function (list, value) {
            if (xs.isArray(list)) {
                return xs.Array.keyOf(list, value);
            } else {
                return xs.Object.keyOf(list, value);
            }
        };
        /**
         * returns key of last list element, equal to given
         * @param list to search within
         * @param value to lookup for
         * @returns {String|Number|undefined}
         */
        this.lastKeyOf = function (list, value) {
            if (xs.isArray(list)) {
                return xs.Array.lastKeyOf(list, value);
            } else {
                return xs.Object.lastKeyOf(list, value);
            }
        };
        /**
         * returns size of list
         * @param list
         * @returns {Number}
         */
        this.size = function (list) {
            if (xs.isArray(list)) {
                return list.length;
            } else {
                return xs.Object.size(list);
            }
        };
        /**
         * iterates over list items
         * @param list to iterate for
         * @param iterator
         * @param scope
         */
        this.each = function (list, iterator, scope) {
            if (xs.isArray(list)) {
                xs.Array.each(list, iterator, scope);
            } else {
                xs.Object.each(list, iterator, scope);
            }
        };
        /**
         * iterates over list items in reverse order
         * @param list to iterate for
         * @param iterator
         * @param scope
         */
        this.eachReverse = function (list, iterator, scope) {
            if (xs.isArray(list)) {
                xs.Array.eachReverse(list, iterator, scope);
            } else {
                xs.Object.eachReverse(list, iterator, scope);
            }
        };
        /**
         * produces a new list with elements, returned by iterator function
         * if source was array - array is created
         * if source was object - object is created
         * @param list
         * @param iterator
         * @param scope
         * @returns {Array|Object}
         */
        this.map = function (list, iterator, scope) {
            if (xs.isArray(list)) {
                return xs.Array.map(list, iterator, scope);
            } else {
                return xs.Object.map(list, iterator, scope);
            }
        };
        /**
         * reduces a list of elements, returned by iterator function from left
         * @param list
         * @param iterator reducing function
         * @param memo initial value
         * @param scope
         * @return {*}
         */
        this.reduce = function (list, iterator, memo, scope) {
            if (xs.isArray(list)) {
                return xs.Array.reduce.apply(xs.Object, arguments);
            } else {
                return xs.Object.reduce.apply(xs.Object, arguments);
            }
        };
        /**
         * reduces a list of elements, returned by iterator function from right
         * @param list
         * @param iterator reducing function
         * @param memo initial value
         * @param scope
         * @return {*}
         */
        this.reduceRight = function (list, iterator, memo, scope) {
            if (xs.isArray(list)) {
                return xs.Array.reduceRight.apply(xs.Object, arguments);
            } else {
                return xs.Object.reduceRight.apply(xs.Object, arguments);
            }
        };
        /**
         * returns first list element, that passes given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @param scope
         * @returns {*}
         */
        var _find = this.find = function (list, finder, scope) {
            if (xs.isArray(list)) {
                return xs.Array.find(list, finder, scope);
            } else {
                return xs.Object.find(list, finder, scope);
            }
        };
        /**
         * returns last list element, that passes given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @param scope
         * @returns {*}
         */
        this.findLast = function (list, finder, scope) {
            if (xs.isArray(list)) {
                return xs.Array.findLast(list, finder, scope);
            } else {
                return xs.Object.findLast(list, finder, scope);
            }
        };
        /**
         * returns all list elements, that pass given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @param scope
         * @returns {Array}
         */
        this.findAll = function (list, finder, scope) {
            if (xs.isArray(list)) {
                return xs.Array.findAll(list, finder, scope);
            } else {
                return xs.Object.findAll(list, finder, scope);
            }
        };
        /**
         * returns first list item, that suites where clause
         * @param list
         * @param where
         * @returns {*}
         */
        this.filter = function (list, where) {
            if (xs.isArray(list)) {
                return xs.Array.filter(list, where);
            } else {
                return xs.Object.filter(list, where);
            }
        };
        /**
         * returns last list item, that suites where clause
         * @param list
         * @param where
         * @returns {*}
         */
        this.filterLast = function (list, where) {
            if (xs.isArray(list)) {
                return xs.Array.filterLast(list, where);
            } else {
                return xs.Object.filterLast(list, where);
            }
        };
        /**
         * returns all list items, that suite where clause
         * @param list
         * @param where
         * @returns {Array}
         */
        this.filterAll = function (list, where) {
            if (xs.isArray(list)) {
                return xs.Array.filterAll(list, where);
            } else {
                return xs.Object.filterAll(list, where);
            }
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