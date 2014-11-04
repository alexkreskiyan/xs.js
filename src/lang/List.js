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
        var slice = Function.prototype.call.bind(Array.prototype.slice), concatenate = Function.prototype.apply.bind(Array.prototype.concat);
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
            if (xs.isArray(list)) {
                var keys = [], length = list.length;
                for (var i = 0; i < length; i++) {
                    keys.push(i);
                }
                return keys;
            } else {
                return Object.keys(list);
            }
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
         * @param {Array|Object} list list to search within
         * @param {*} value value to lookup for
         *
         * @returns {boolean} whether list has value
         */
        var _has = me.has = function (list, value) {
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
        var _keyOf = me.keyOf = function (list, value) {
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
        var _lastKeyOf = me.lastKeyOf = function (list, value) {
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
        var _size = me.size = function (list) {
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
            var result, copy = _clone(list);
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = _shift(copy);
            }
            _each(copy, function (value, key, object) {
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
            var result, copy = _clone(list);
            if (arguments.length > 2) {
                result = memo;
            } else {
                result = _pop(copy);
            }
            _eachReverse(copy, function (value, key, object) {
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
        var _find = me.find = function (list, finder, scope) {
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
        var _findLast = me.findLast = function (list, finder, scope) {
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
        var _findAll = me.findAll = function (list, finder, scope) {
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
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @returns {*} first object, that suites clause, or undefined, if nothing suites
         */
        me.filter = function (list, where) {
            return _find(list, function (item) {
                _every(where, function (param, name) {
                    return item[name] === param;
                });
            });
        };
        /**
         * returns last list item, that suites where clause
         *
         * @method filterLast
         *
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @returns {*} first object, that suites clause, or undefined, if nothing suites
         */
        me.filterLast = function (list, where) {
            return _findLast(list, function (item) {
                _every(where, function (param, name) {
                    return item[name] === param;
                });
            });
        };
        /**
         * returns all list items, that suite where clause
         *
         * @method filterAll
         *
         * @param {Array|Object} list filtered list
         * @param {Object} where clause object
         *
         * @returns {Array|Object} List elements, filtered from original
         */
        me.filterAll = function (list, where) {
            var keys = [];
            _each(list, function (item, name) {
                _every(where, function (param, name) {
                    return item[name] === param;
                }) && keys.push(name);
            }, this);
            return _pick(list, keys);
        };
        /**
         * returns whether all list items pass tester function
         *
         * @method every
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Object} scope optional scope
         * @returns {boolean} whether all elements pass tester function
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
         * returns whether count of list items pass tester function
         *
         * @method some
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Object} scope optional scope
         * @param {number} count count of items needed to resolve as true
         *
         * @returns {boolean}
         */
        me.some = function (list, tester, scope, count) {
            var idx, keys = _keys(list), len = keys.length, name, found = 0;
            count = count || 1;
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
         * returns whether none of list items pass tester function
         *
         * @method none
         *
         * @param {Array|Object} list tested list
         * @param {Function} tester tester function
         * @param {Object} scope optional scope
         * @returns {boolean} whether no one of elements pass tester function
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
         * returns first item of list
         *
         * @method first
         *
         * @param {Array|List} list
         *
         * @returns {*} first element, undefined if list is empty
         */
        me.first = function (list) {
            var key = _shift(_keys(list));
            return list[key];
        };
        /**
         * returns last item of list
         *
         * @method last
         *
         * @param {Array|List} list
         *
         * @returns {*} last element, undefined if list is empty
         */
        me.last = function (list) {
            var key = _pop(_keys(list));
            return list[key];
        };
        /**
         * shifts and returns first item from list
         *
         * @method shift
         *
         * @param {Array|List} list
         *
         * @returns {*} First element of list
         */
        var _shift = me.shift = function (list) {
            var key = _keys(list).shift();
            var value = list[key];
            xs.isArray(list) ? list.splice(0, 1) : delete list[key];
            return value;
        };
        /**
         * pops and returns last item from list
         *
         * @method pop
         *
         * @param {Array|List} list
         *
         * @returns {*} Last element of list
         */
        var _pop = me.pop = function (list) {
            var key = _keys(list).pop();
            var value = list[key];
            xs.isArray(list) ? list.splice(-1, 1) : delete list[key];
            return value;
        };
        //noinspection ReservedWordAsName
        /**
         * Deletes first item from list, that matches elem as key or as value
         *
         * @method delete
         *
         * @param {Array|Object} list list, element is deleted from
         * @param {*} element key or element
         *
         * @returns {boolean} whether something was removed
         */
        var _delete = me.delete = function (list, element) {
            if (_hasKey(list, element)) {
                xs.isArray(list) ? list.splice(element, 1) : delete list[element];
                return true;
            } else {
                var key = _keyOf(list, element);
                if (key !== undefined) {
                    xs.isArray(list) ? list.splice(key, 1) : delete list[key];
                    return true;
                }
            }
            return false;
        };
        /**
         * Deletes last item from list, that matches elem as key or as value
         *
         * @method deleteLast
         *
         * @param {Array|Object} list list, element is deleted from
         * @param {*} element key or element
         *
         * @returns {boolean} whether something was removed
         */
        me.deleteLast = function (list, element) {
            if (_hasKey(list, element)) {
                xs.isArray(list) ? list.splice(element, 1) : delete list[element];
                return true;
            } else {
                var key = _lastKeyOf(list, element);
                if (key !== undefined) {
                    xs.isArray(list) ? list.splice(key, 1) : delete list[key];
                    return true;
                }
            }
            return false;
        };
        /**
         * Deletes all elements from list, passed as array/plain arguments
         *
         * @method deleteAll
         *
         * @param {Array|Object} list list, elements are deleted from
         *
         * @returns {boolean} whether something was removed
         */
        var _deleteAll = me.deleteAll = function (list) {
            var elements = _union(slice(arguments, 1));
            var deleted = false;
            //if elements specified - delete them
            if (elements.length) {
                _each(elements, function (element) {
                    _delete(list, element) && (deleted = true);
                });
                return deleted;
            }
            var size = _size(list);
            deleted = size > 0;
            if (xs.isArray(list)) {
                list.splice(0, size);
                return deleted;
            }
            var idx, keys = _keys(list), len = keys.length, name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                delete list[name];
            }
            return deleted;
        };
        /**
         * Returns shallow copy of list
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
         * Copies all properties from objects/arrays, passed as arguments to given obj
         *
         * @method extend
         *
         * @param {Object} object extended object
         */
        var _extend = me.extend = function (object) {
            var adds = _union(slice(arguments, 1));
            _each(adds, function (value, name) {
                object[name] = value;
            });
        };
        /**
         * Returns copy of given list, filtered not to have false-like values
         *
         * @method compact
         *
         * @param {Array|Object} list compacted list
         *
         * @returns {Array|Object}
         */
        me.compact = function (list) {
            return _findAll(list, function (value) {
                return value;
            });
        };
        /**
         * Shuffles list elements
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
            if (!byObject) {
                return merge;
            }
            var union = {}, key;
            _each(merge, function (item) {
                _each(item, function (value, key) {
                    _hasKey(union, key) || (union[key] = value);
                });
            });
            return union;
        };
        /**
         * Returns intersection of given lists (although intersection elements are unique)
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
                intersect;
            if (byObject) {
                intersect = []; //define intersection
                //iterate over each element (they are unique)
                _each(all, function (item) {
                    //if each array has this value, it belongs to intersection
                    _every(merge, function (arr) {
                        return _has(arr, item);
                    }) && intersect.push(item);
                });
            } else {
                intersect = {};
                //iterate over each element (they are unique)
                _each(all, function (item) {
                    //if each array has this value, it belongs to intersection
                    _every(merge, function (arr) {
                        return _has(arr, item);
                    }) && (intersect[idx] = item);
                });
            }
            return intersect;
        };
        /**
         * Take the difference between one list and a number of other lists.
         * Only the elements present in just the first array will remain.
         *
         * @method difference
         *
         * @param {Array|Object} list differed list
         * @returns {Array|Object}
         */
        me.difference = function (list) {
            var others = slice(arguments, 1); //get objects list
            if (!others.length) {
                return _clone(list);
            }
            //iterate over each element in items (they are unique)
            return _findAll(list, function (item) {
                //check whether all other objects have this value
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
         * @returns {Array|Object} copy with unique values
         */
        var _unique = me.unique = function (list) {
            var unique = xs.isArray(list) ? [] : {};
            _each(list, function (value, name) {
                _has(unique, value) || (unique[name] = value);
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
        var _pick = me.pick = function (list) {
            var copy = xs.isArray(list) ? [] : {}, keys = _union(slice(arguments, 1));
            _each(keys, function (key) {
                key in list && (copy[key] = list[key]);
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
        var _omit = me.omit = function (list) {
            var copy = xs.isArray(list) ? [] : {}, keys = _union(slice(arguments, 1));
            _each(list, function (value, name) {
                _has(keys, name) || (copy[name] = value);
            });
            return copy;
        };
        /**
         * Updates list with defaulted values, passed in 2+ arguments
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
            _each(defaults, function (source) {
                xs.isObject(source) && _each(source, function (value, name) {
                    _hasKey(list, name) || (list[name] = source[name]);
                });
            });
        };
    });
    set.extend(xs, set);
})(window, 'xs');