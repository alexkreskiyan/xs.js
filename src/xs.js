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
(function (ns) {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayPrototype = Array.prototype, ObjectPrototype = Object.prototype, FunctionPrototype = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
        slice = FunctionPrototype.call.bind(ArrayPrototype.slice),
        concat = FunctionPrototype.apply.bind(ArrayPrototype.concat);
    /**
     * set class pre-definition
     * @type {{}}
     */
    var set = new (function () {
        /**
         * returns all list keys
         * @param list
         * @returns {array}
         */
        this.keys = function (list) {
            if (type.isArray(list)) {
                return array.keys(list);
            } else {
                return object.keys(list);
            }
        };
        /**
         * returns all list values
         * @param list
         * @returns {array}
         */
        this.values = function (list) {
            if (type.isArray(list)) {
                return array.values(list);
            } else {
                return object.values(list);
            }
        };
        /**
         * returns whether list has given key
         * @param list to search within
         * @param key to lookup for
         * @returns {boolean}
         */
        this.hasKey = function (list, key) {
            if (type.isArray(list)) {
                return array.hasKey(list, key);
            } else {
                return object.hasKey(list, key);
            }
        };
        /**
         * returns whether list has element
         * @param list to search within
         * @param value to lookup for
         * @returns {boolean}
         */
        this.has = function (list, value) {
            if (type.isArray(list)) {
                return array.has(list, value);
            } else {
                return object.has(list, value);
            }
        };
        /**
         * returns key of first list element, equal to given
         * @param list to search within
         * @param value to lookup for
         * @returns {string|Number|undefined}
         */
        this.keyOf = function (list, value) {
            if (type.isArray(list)) {
                return array.keyOf(list, value);
            } else {
                return object.keyOf(list, value);
            }
        };
        /**
         * returns key of last list element, equal to given
         * @param list to search within
         * @param value to lookup for
         * @returns {string|Number|undefined}
         */
        this.lastKeyOf = function (list, value) {
            if (type.isArray(list)) {
                return array.lastKeyOf(list, value);
            } else {
                return object.lastKeyOf(list, value);
            }
        };
        /**
         * returns size of list
         * @param list
         * @returns {Number}
         */
        this.size = function (list) {
            if (type.isArray(list)) {
                return list.length;
            } else {
                return object.size(list);
            }
        };
        /**
         * iterates over list items
         * @param list to iterate for
         * @param iterator
         * @param scope
         */
        this.each = function (list, iterator, scope) {
            if (type.isArray(list)) {
                list.forEach(iterator, scope);
            } else {
                object.each(list, iterator, scope);
            }
        };
        /**
         * iterates over list items in reverse order
         * @param list to iterate for
         * @param iterator
         * @param scope
         */
        this.eachReverse = function (list, iterator, scope) {
            if (type.isArray(list)) {
                list.reverse().forEach(iterator, scope);
            } else {
                object.eachReverse(list, iterator, scope);
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
            if (type.isArray(list)) {
                return list.map(iterator, scope);
            } else {
                return object.map(list, iterator, scope);
            }
        };
        /**
         * reduces a list of elements, returned by iterator function from left
         * @param list
         * @param iterator reducing function
         * @param memo initial value
         * @param scope
         */
        this.reduce = function (list, iterator, scope, memo) {
            if (type.isArray(list)) {
                var iterator = scope ? iterator.bind(scope) : iterator;
                if (arguments.length > 3) {
                    return list.reduce(iterator, memo);
                } else {
                    return list.reduce(iterator);
                }
            } else {
                return object.reduce.apply(object, arguments);
            }
        };
        /**
         * reduces a list of elements, returned by iterator function from right
         * @param list
         * @param iterator reducing function
         * @param memo initial value
         * @param scope
         */
        this.reduceRight = function (list, iterator, scope, memo) {
            if (type.isArray(list)) {
                var iterator = scope ? iterator.bind(scope) : iterator;
                if (arguments.length > 3) {
                    return list.reduceRight(iterator, memo);
                } else {
                    return list.reduceRight(iterator);
                }
            } else {
                return object.reduceRight.apply(object, arguments);
            }
        };
        /**
         * returns first list element, that passes given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @returns {*}
         */
        this.find = function (list, finder, scope) {
            if (type.isArray(list)) {
                return array.find(list, finder, scope);
            } else {
                return object.find(list, finder, scope);
            }
        };
        /**
         * returns last list element, that passes given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @returns {*}
         */
        this.findLast = function (list, finder, scope) {
            if (type.isArray(list)) {
                return array.findLast(list, finder, scope);
            } else {
                return object.findLast(list, finder, scope);
            }
        };
        /**
         * returns all list elements, that pass given test function
         * @param list
         * @param finder function, returning true if item matches given conditions
         * @returns {*}
         */
        this.findAll = function (list, finder, scope) {
            if (type.isArray(list)) {
                return array.findAll(list, finder, scope);
            } else {
                return object.findAll(list, finder, scope);
            }
        };
        /**
         * returns first list item, that suites where clause
         * @param list
         * @param where
         * @returns {*}
         */
        this.filter = function (list, where) {
            if (type.isArray(list)) {
                return array.filter(list, where);
            } else {
                return object.filter(list, where);
            }
        };
        /**
         * returns last list item, that suites where clause
         * @param list
         * @param where
         * @returns {*}
         */
        this.filterLast = function (list, where) {
            if (type.isArray(list)) {
                return array.filterLast(list, where);
            } else {
                return object.filterLast(list, where);
            }
        };
        /**
         * returns all list items, that suite where clause
         * @param list
         * @param where
         * @returns {*}
         */
        this.filterAll = function (list, where) {
            if (type.isArray(list)) {
                return array.filterAll(list, where);
            } else {
                return object.filterAll(list, where);
            }
        };
        /**
         * returns whether all list items pass tester function
         * @param list
         * @param tester
         * @param scope
         * @returns {*}
         */
        this.every = function (list, tester, scope) {
            if (type.isArray(list)) {
                return array.every(list, tester, scope);
            } else {
                return object.every(list, tester, scope);
            }
        };
        /**
         * returns whether count of list items pass tester function
         * @param list
         * @param tester
         * @param scope
         * @param count
         * @returns {*}
         */
        this.some = function (list, tester, scope, count) {
            if (type.isArray(list)) {
                return array.some(list, tester, scope, count);
            } else {
                return object.some(list, tester, scope, count);
            }
        };
        /**
         * returns first item of list
         * @param list
         * @returns {*}
         */
        this.first = function (list) {
            if (type.isArray(list)) {
                return array.first(list);
            } else {
                return object.first(list);
            }
        };
        /**
         * returns last item of list
         * @param list
         * @returns {*}
         */
        this.last = function (list) {
            if (type.isArray(list)) {
                return array.last(list);
            } else {
                return object.last(list);
            }
        };
        /**
         * shifts and returns first item from list
         * @param list
         * @returns {*}
         */
        this.shift = function (list) {
            if (type.isArray(list)) {
                return list.shift();
            } else {
                return object.shift(list);
            }
        };
        /**
         * pops and returns last item from list
         * @param list
         * @param value
         * @returns {*}
         */
        this.pop = function (list, value) {
            if (type.isArray(list)) {
                return list.pop();
            } else {
                return object.pop(list, value);
            }
        };
        /**
         * removes first item from list, that matches elem as key or as value
         * @param list
         * @param elem
         * @returns {*}
         */
        this.remove = function (list, elem) {
            if (type.isArray(list)) {
                return array.remove(list, elem);
            } else {
                return object.remove(list, elem);
            }
        };
        /**
         * removes last item from list, that matches elem as key or as value
         * @param list
         * @param elem
         * @returns {*}
         */
        this.removeLast = function (list, elem) {
            if (type.isArray(list)) {
                return array.removeLast(list, elem);
            } else {
                return object.removeLast(list, elem);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param list
         * @returns {*}
         */
        this.removeAll = function (list) {
            if (type.isArray(list)) {
                return array.removeAll.apply(array, arguments);
            } else {
                return object.removeAll.apply(object, arguments);
            }
        };
        /**
         * returns clone of list (shallow copied)
         * @param list
         * @param value
         * @returns {*}
         */
        this.clone = function (list) {
            if (type.isArray(list)) {
                return array.clone(list);
            } else {
                return object.clone(list);
            }
        };
        /**
         * returns copy of list with only whitelisted keys, passed in 2+ arguments
         * @param list
         * @returns {*}
         */
        this.pick = function (list) {
            if (type.isArray(list)) {
                return array.pick.apply(array, arguments);
            } else {
                return object.pick.apply(object, arguments);
            }
        };
        /**
         * returns copy of list without blacklisted keys, passed in 2+ arguments
         * @param list
         * @returns {*}
         */
        this.omit = function (list) {
            if (type.isArray(list)) {
                return array.omit.apply(array, arguments);
            } else {
                return object.omit.apply(object, arguments);
            }
        };
        /**
         * updates list with defaulted values, passed in 2+ arguments
         * @param list
         * @returns {*}
         */
        this.defaults = function (list) {
            if (type.isArray(list)) {
                return array.defaults.apply(array, arguments);
            } else {
                return object.defaults.apply(object, arguments);
            }
        };
    });
    /**
     * object class pre-definition
     * @type {{}}
     * @private
     */
    var object = new (function () {
        /**
         * returns object keys
         * @param obj
         * @returns {array|*}
         */
        this.keys = function (obj) {
            return Object.keys(obj);
        };
        /**
         * returns object values
         * @param obj
         * @returns {Array}
         */
        this.values = function (obj) {
            var values = [];
            this.each(obj, function (value) {
                values.push(value);
            });
            return values;
        };
        /**
         * returns whether object has key
         * @param obj
         * @param key
         * @returns {boolean}
         */
        this.hasKey = function (obj, key) {
            return obj.hasOwnProperty(key);
        };
        /**
         * returns whether object contains given values as one of properties values
         * @param obj
         * @param name
         * @returns {boolean}
         */
        this.has = function (obj, value) {
            return !type.isUndefined(this.find(obj, function (val) {
                return val === value;
            }));
        };
        /**
         * returns name of first property with value equal to given
         * @param obj
         * @param value
         * @returns {string|Number|undefined}
         */
        this.keyOf = function (obj, value) {
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index];
                if (obj[name] === value) {
                    return name;
                }
            }
        };
        /**
         * returns name of last property with value equal to given
         * @param obj
         * @param value
         * @returns {string|Number|undefined}
         */
        this.lastKeyOf = function (obj, value) {
            var keys = this.keys(obj).reverse();
            for (var index in keys) {
                var name = keys[index];
                if (obj[name] === value) {
                    return name;
                }
            }
        };
        /**
         * returns number of object own properties
         * @param obj
         * @returns {Number}
         */
        this.size = function (obj) {
            return this.keys(obj).length;
        }
        /**
         * iterates over object own properties
         * @param obj
         * @param iterator
         * @param scope
         */
        this.each = function (obj, iterator, scope) {
            this.keys(obj).forEach(function (key) {
                iterator.call(this, obj[key], key, obj);
            }, scope);
        };
        /**
         * iterates over object own properties in reverse order
         * @param obj
         * @param iterator
         * @param scope
         */
        this.eachReverse = function (obj, iterator, scope) {
            this.keys(obj).reverse().forEach(function (key) {
                iterator.call(this, obj[key], key, obj);
            }, scope);
        };
        /**
         * produces a new object with properties, updated by iterator function
         * @param obj
         * @param iterator
         * @param scope
         * @returns {Object}
         */
        this.map = function (obj, iterator, scope) {
            var result = this.clone(obj);
            this.each(obj, function (value, key, object) {
                result[key] = iterator.call(this, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces a hash of elements, returned by iterator function from left
         * @param obj
         * @param iterator
         * @param memo
         * @param scope
         * @returns {*}
         */
        this.reduce = function (obj, iterator, scope, memo) {
            var result;
            if (arguments.length > 3) {
                result = memo;
            } else {
                var key = object.keys(obj).shift();
                result = obj[key];
                obj = this.omit(obj, key);
            }
            this.each(obj, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces a hash of elements, returned by iterator function from right
         * @param obj
         * @param iterator
         * @param memo
         * @param scope
         * @returns {*}
         */
        this.reduceRight = function (obj, iterator, scope, memo) {
            var result;
            if (memo) {
                result = memo;
            } else {
                var key = object.keys(obj).pop();
                result = obj[key];
                obj = this.omit(obj, key);
            }
            this.eachReverse(obj, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * returns value of first property, matching given finder function
         * @param obj
         * @param finder
         * @param scope
         * @returns {*}
         */
        this.find = function (obj, finder, scope) {
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                if (finder.call(scope, value, name, obj)) {
                    return value;
                }
            }
        };
        /**
         * returns value of last property, matching given finder function
         * @param obj
         * @param finder
         * @param scope
         * @returns {*}
         */
        this.findLast = function (obj, finder, scope) {
            var keys = this.keys(obj).reverse();
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                if (finder.call(scope, value, name, obj)) {
                    return value;
                }
            }
        };
        /**
         * returns pick of object, where all properties match given finder function
         * @param arr
         * @param finder
         * @param scope
         * @returns {Array|*}
         */
        this.findAll = function (obj, finder, scope) {
            var keys = [];
            this.each(obj, function (value, name, obj) {
                finder.call(this, value, name, obj) && keys.push(name);
            }, scope);
            return this.pick(obj, keys);
        };
        /**
         * returns value of first property, matching given where clause
         * @param obj
         * @param where
         * @returns {*}
         */
        this.filter = function (obj, where) {
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                var ok = this.every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
                }
            }
        };
        /**
         * returns value of last property, matching given where clause
         * @param obj
         * @param where
         * @returns {*}
         */
        this.filterLast = function (obj, where) {
            var keys = this.keys(obj).reverse();
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                var ok = this.every(where, function (param, name) {
                    return value[name] === param;
                });
                if (ok) {
                    return value;
                }
            }
        };
        /**
         * returns pick of object, where all properties match given where clause
         * @param obj
         * @param where
         * @returns {*}
         */
        this.filterAll = function (obj, where) {
            var props = [];
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                var ok = this.every(where, function (param, name) {
                    return value[name] === param;
                });
                ok && props.push(name);
            }
            return this.pick(obj, props);
        };
        /**
         * returns whether all object properties pass given tester function
         * @param obj
         * @param tester
         * @param scope
         * @returns {boolean}
         */
        this.every = function (obj, tester, scope) {
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                if (!tester.call(scope, value, name, obj)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * returns whether count of object properties pass given tester function
         * @param obj
         * @param tester
         * @param scope
         * @param count
         * @returns {boolean}
         */
        this.some = function (obj, tester, scope, count) {
            type.isNumber(count) || (count = 1);
            var found = 0;
            var keys = this.keys(obj);
            for (var index in keys) {
                var name = keys[index], value = obj[name];
                tester.call(scope, value, name, obj) && found++;
                if (found == count) {
                    return true;
                }
            }
            return false;
        };
        /**
         * returns first object property
         * @param obj
         * @returns {*}
         */
        this.first = function (obj) {
            var key = object.keys(obj).shift();
            return obj[key];
        };
        /**
         * returns last object property
         * @param obj
         * @returns {*}
         */
        this.last = function (obj) {
            var key = object.keys(obj).pop();
            return obj[key];
        };
        /**
         * shifts and returns first object property
         * @param obj
         * @returns {*}
         */
        this.shift = function (obj) {
            var key = object.keys(obj).shift();
            var value = obj[key];
            delete obj[key];
            return value;
        };
        /**
         * pops and returns last object property
         * @param obj
         * @returns {*}
         */
        this.pop = function (obj) {
            var key = object.keys(obj).pop();
            var value = obj[key];
            delete obj[key];
            return value;
        };
        /**
         * removes first property from object, that matches given elem by name or value
         * @param obj
         * @param elem
         */
        this.remove = function (obj, elem) {
            if ((type.isString(elem) || type.isNumber(elem)) && this.hasKey(obj, elem)) {
                delete obj[elem];
            } else if (this.has(obj, elem)) {
                delete obj[this.keyOf(obj, elem)];
            }
        };
        /**
         * removes last property from object, that matches given elem by name or value
         * @param obj
         * @param elem
         */
        this.removeLast = function (obj, elem) {
            if ((type.isString(elem) || type.isNumber(elem)) && this.hasKey(obj, elem)) {
                delete obj[elem];
            } else if (this.has(obj, elem)) {
                delete obj[this.lastKeyOf(obj, elem)];
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param obj
         * @param elem
         */
        this.removeAll = function (obj, elem) {
            var elems = array.union(slice(arguments, 1));
            elems.forEach(function (elem) {
                this.remove(obj, elem);
            }, this);
        };
        /**
         * return shallow-cloned object copy
         * @param obj
         * @returns {*}
         */
        this.clone = function (obj) {
            return this.extend({}, obj);
        };
        /**
         * copies all properties from objects/arrays, passed as arguments to given obj
         * @param obj
         * @returns {*}
         */
        this.extend = function (obj) {
            this.each(slice(arguments, 1), function (source) {
                this.each(source, function (value, name) {
                    obj[name] = value;
                });
            }, this);
            return obj;
        };
        /**
         * returns copy of object with only whitelisted keys, passed in 2+ arguments
         * @param obj
         * @returns {{}}
         */
        this.pick = function (obj) {
            var copy = {};
            var keys = array.union(slice(arguments, 1));
            keys.forEach(function (key) {
                key in obj && (copy[key] = obj[key]);
            });
            return copy;
        };
        /**
         * returns copy of object without blacklisted keys, passed in 2+ arguments
         * @param obj
         * @returns {{}}
         */
        this.omit = function (obj) {
            var copy = {};
            var keys = array.union(slice(arguments, 1));
            this.each(obj, function (value, name) {
                array.has(keys, name) || (copy[name] = value);
            });
            return copy;
        };
        /**
         * Fill in undefined properties in object with values
         * from the defaults objects, and return the object.
         * As soon as the property is filled, further defaults will have no effect.
         * @param obj
         * @returns {*}
         */
        this.defaults = function (obj) {
            this.each(slice(arguments, 1), function (source) {
                type.isObject(source) && this.each(source, function (value, name) {
                    this.hasKey(obj, name) || (obj[name] = source[name]);
                }, this);
            }, this);
            return obj;
        };
    });
    /**
     * array class pre-definition
     * @type {}
     * @private
     */
    var array = new (function () {
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
         * @param obj
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
                var name = keys[index], value = arr[name];
                var ok = object.every(where, function (param, name) {
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
                var name = keys[index], value = arr[name];
                var ok = object.every(where, function (param, name) {
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
                var name = keys[index], value = obj[name];
                var ok = object.every(where, function (param, name) {
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
            type.isNumber(count) || (count = 1);
            var found = 0;
            var keys = this.keys(arr);
            for (var index in keys) {
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
            var key = object.keys(arr).shift();
            return arr[key];
        };
        /**
         * returns last element of given array
         * @param arr
         * @returns {*}
         */
        this.last = function (arr) {
            var key = object.keys(arr).pop();
            return arr[key];
        };
        /**
         * removes first element of given array, that suites elem as key or value
         * @param arr
         * @param elem
         */
        this.remove = function (arr, elem) {
            if (type.isNumber(elem) && this.hasKey(arr, elem)) {
                arr.splice(elem, 1);
            } else if (this.has(arr, elem)) {
                arr.splice(arr.indexOf(elem), 1);
            }
        };
        /**
         * removes last element of given array, that suites elem as key or value
         * @param arr
         * @param elem
         */
        this.removeLast = function (arr, elem) {
            if (type.isNumber(elem) && this.hasKey(arr, elem)) {
                arr.splice(elem, 1);
            } else if (this.has(arr, elem)) {
                arr.splice(arr.lastIndexOf(elem), 1);
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param arr
         * @param elem
         */
        this.removeAll = function (arr, elem) {
            var elems = array.union(slice(arguments, 1));
            elems.forEach(function (elem) {
                this.remove(arr, elem);
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
            var rest = array.union(slice(arguments, 1));
            return arr.filter(function (value) {
                return !this.has(rest, value);
            }, this);
        };
        /**
         * returns array, filled by unique items of given array
         * @param arr
         * @returns {Array}
         */
        this.uniques = function (arr) {
            var unique = [];
            arr.forEach(function (value) {
                ~unique.indexOf(value) || unique.push(value);
            });
            return unique;
        };
        /**
         * returns copy of array with only whitelisted keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        this.pick = function (arr) {
            var copy = [];
            var keys = array.union(slice(arguments, 1));
            keys.forEach(function (key) {
                key in arr && (copy[key] = arr[key]);
            });
            return copy;
        };
        /**
         * returns copy of array without blacklisted keys, passed in 2+ arguments
         * @param arr
         * @returns {Array}
         */
        this.omit = function (arr) {
            var copy = [];
            var keys = array.union(slice(arguments, 1));
            arr.forEach(function (value, name) {
                this.has(keys, name) || (copy[name] = value);
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
            var defaults = array.union(slice(arguments, 1));
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
    /**
     * function class pre-definition
     * @type {}
     * @private
     */
    var fn = new (function () {
        /**
         * bind scope to function
         * @param fn
         * @param scope
         * @returns {Function}
         */
        this.bind = function (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            }
        }
        /**
         * prefills function's arguments
         * @param fn
         * @param defaults
         * @param scope
         * @returns {Function}
         */
        this.prefill = function (fn, defaults, scope) {
            return function () {
                var args = array.defaults(array.values(arguments), defaults);
                return fn.apply(scope, args);
            }
        };
        /**
         * creates function, being called once
         * @param fn
         * @returns {Function}
         */
        this.once = function (func) {
            var ran = false, memo;
            return function () {
                if (ran) return memo;
                ran = true;
                memo = func.apply(this, arguments);
                func = null;
                return memo;
            };
        };
        /**
         * wraps function within another function
         * @param fn
         * @param wrapper
         * @returns {Function}
         */
        this.wrap = function (fn, wrapper) {
            return function () {
                var args = slice(arguments);
                args.unshift(fn);
                return wrapper.apply(undefined, args);
            }
        };
        this.nextTick = function (fn, scope) {
            scope && (fn = this.prefill(fn, [], scope));
            setTimeout(fn, 0);
        }
    });
    /**
     * string class pre-definition
     * @type {}
     * @private
     */
    var string = new (function () {
    });
    /**
     * number class pre-definition
     * @type {}
     * @private
     */
    var number = new (function () {
    });

    /**
     * empty function instance
     * @type {Function}
     */
    var emptyFn = function () {
    };
    /**
     * base regular exceptions
     * @type {RegExp}
     */
    var namespaceRe = /^ns/i;
    var fnArgsRe = /^function\s(?:\w+)?\(([A-Za-z0-9\s,]*)\)/i;
    /**
     * Classes container
     * @type {{}}
     * @private
     */
    var classes = new (function () {
        /**
         * class definitions
         */
        var items = {};
        /**
         * checks whether items has class
         * @param name
         * @returns {boolean}
         */
        this.has = function (name) {
            return items.hasOwnProperty(name);
        };
        /**
         * gets class by name if exists, otherwise returns false
         * @param name
         * @returns {*}
         */
        this.get = function (name) {
            return this.has(name) ? items[name] : false;
        };
        /**
         * Sets given class as item at path, specified by name
         * @param root
         * @param name
         * @param cls
         */
        this.set = function (root, name, cls) {
            //explode name to parts
            var names = name.split('.');
            //return if empty name
            if (!names.length) {
                return;
            }
            if (cls.$name == name) {
                items[name] = cls;
            }
            //get parent namespace part
            var namespace = names.shift();
            //check whether namespace is leave or not
            if (names.length) {
                //create if not created yet
                typeof root[namespace] == 'object' || (root[namespace] = {});
                //downcall
                this.set(root[namespace], names.join('.'), cls);
            } else {
                //save cls as root's namespace item
                root[namespace] = cls;
            }
        };
        /**
         * gets class name according to namespace
         * @param name
         * @returns {string}
         */
        this.getName = function (name) {
            if (typeof this.$namespace === 'string') {
                return name.split(namespaceRe).join(this.$namespace);
            } else {
                return name;
            }
        };
        this.parent = function (args) {
            return args[args.length - 1];
        };
        this.isParent = function (child) {
            return type.isFunction(child.isChild) ? child.isChild(this) : false;
        };
        this.isChild = function (parent) {
            if (!type.isFunction(this.$parent)) {
                return false;
            } else if (this.$parent === parent) {
                return true;
            } else {
                return this.$parent.isChild(parent);
            }
        };
    });
    /**
     * core functions: extend, define, const, etc
     */
    var core = {
        /**
         * Extend core function
         * @param child child class
         * @param parent parent class
         * @returns {}
         */
        extend: function (child, parent) {
            var fn = function () {
            };
            fn.prototype = parent.prototype;
            child.prototype = new fn();
            child.prototype.constructor = child;
            //save reference to parent
            this.const(child, '$parent', parent);
        },
        factory: function (constructor) {
            function fn(args) {
                return constructor.apply(this, args);
            }

            fn.prototype = constructor.prototype;
            return function () {
                return new fn(arguments);
            };
        },
        defined: function (obj, key) {
            return !!(obj.hasOwnProperty(key));
        },
        define: function (obj, key, descriptor) {
            return descriptor ? Object.defineProperty(obj, key, descriptor) : Object.defineProperties(obj, key);
        },
        const: function (obj, name, value) {
            this.defined(obj, name) || this.define(obj, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            })
        },
        property: function (obj, name, descriptor) {
            this.defined(obj, name) || this.define(obj, name, object.defaults({
                enumerable: true,
                configurable: false
            }, descriptor))
        },
        method: function (obj, name, descriptor) {
            if (this.defined(obj, name)) {
                return;
            }
            var description = object.defaults({
                writable: false,
                enumerable: true,
                configurable: false
            }, descriptor);
            if (description.default || description.wrap) {
                description.default = type.isArray(description.default) ? description.default : [];
                var fn = description.value;
                if (description.wrap) {
                    //get count of arguments, defined by function;
                    var argsCount = fnArgsRe.exec(fn.toString()).pop().split(',').length;
                    description.value = function () {
                        var args = array.defaults(array.values(arguments), description.default);
                        //pass super, needed for parent() calls
                        if (args.length < argsCount) {
                            args[argsCount] = description.$parent;
                        } else {
                            args.push(description.$parent);
                        }
                        return fn.apply(this, args);
                    };
                } else {
                    description.value = function () {
                        var args = array.defaults(array.values(arguments), description.default);
                        return fn.apply(this, args);
                    };
                }
            }
            this.define(obj, name, description);
        }
    };
    var desc = {
        /**
         * determines whether given value is property descriptor
         * returns true when it is object and contains only some of 6 descriptor-relative properties
         */
        is: function (descriptor) {
            //false if descriptor is not object
            if (!type.isObject(descriptor)) {
                return false;
            }
            //check descriptor fields are filled correctly
            if (descriptor.value) {
                return true;
            } else if (descriptor.get || descriptor.set) {
                if (descriptor.get && !type.isFunction(descriptor.get)) {
                    return false;
                }
                if (descriptor.set && !type.isFunction(descriptor.set)) {
                    return false;
                }
                return true;
            }
            return false;
        },
        property: function (descriptor, name) {
            //process descriptor
            var desc = this.is(descriptor) ? descriptor : {value: descriptor};
            //if accessors given - remove value
            if (desc.get || desc.set) {
                //default getter setter to simple interpretation
                desc.get || eval('desc.get = function () {return this.__get(\'' + name + '\');}');
                desc.set || eval('desc.set = function (value) {return this.__set(\'' + name + '\',value);}');
                delete desc.value;
                delete desc.writable;
            } else {
                //get value
                desc.value = type.isUndefined(desc.value) ? undefined : desc.value;
                desc.writable = true;
            }
            return desc;
        },
        method: function (descriptor) {
            //process descriptor
            var desc = {};
            //process given descriptor. if something wrong - returns false
            //simple function allowed
            if (type.isFunction(descriptor)) {
                desc.value = descriptor;
                //allowed as object with fn property, containing method function
            } else if (type.isObject(descriptor)) {
                //function may be specified in fn or value propeties
                if (type.isFunction(descriptor.fn)) {
                    desc.value = descriptor.fn;
                } else if (type.isFunction(descriptor.value)) {
                    desc.value = descriptor.value;
                } else {
                    return false;
                }
                //else  - return false
            } else {
                return false;
            }
            //assign defaults
            type.isArray(descriptor.default) && (desc.default = descriptor.default);
            //assign wrap
            type.isBoolean(descriptor.wrap) && (desc.wrap = descriptor.wrap);
            return desc;
        },
        apply: function (cls, descriptor) {
            //correct descriptor
            var correctDescriptor = {
                const: {},
                static: {
                    properties: {},
                    methods: {}
                },
                properties: {},
                methods: {}
            };
            // constants
            set.each(descriptor.const, function (value, name) {
                //save const to class descriptor
                correctDescriptor.const[name] = value;
                core.const(cls, name, value);
            });
            //public static properties
            set.each(descriptor.static.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.static.properties[name] = propertyDescriptor;
                //define class property
                core.property(cls, name, propertyDescriptor);
                //assign default if specified
                object.hasKey(propertyDescriptor, 'default') && (cls[name] = propertyDescriptor.default);
            }, this);
            //public static methods
            set.each(descriptor.static.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.static.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls, name, object.defaults(propertyDescriptor, {
                    $parent: cls.$parent,
                    wrap: false
                }));
            }, this);
            //public properties
            set.each(descriptor.properties, function (value, name) {
                //parse value as property descriptor
                var propertyDescriptor = this.property(value, name);
                //store desc to class descriptor
                correctDescriptor.properties[name] = propertyDescriptor;
                //instance properties are defined in constructor
            }, this);
            //public methods
            set.each(descriptor.methods, function (value, name) {
                //parse value as method descriptor
                var propertyDescriptor = this.method(value);
                //if desc is wrong - return
                if (!propertyDescriptor) {
                    return;
                }
                //store desc to class descriptor
                correctDescriptor.methods[name] = propertyDescriptor;
                //define class property
                core.method(cls.prototype, name, object.defaults(propertyDescriptor, {
                    $parent: cls.$parent.prototype,
                    wrap: false
                }));
            }, this);
            return correctDescriptor;
        }
    };
    var preprocessors = {
        prepare: function (name, descriptor, createdFn) {
            if (!type.isString(name)) {
                throw 'class name must be string';
            }
            //check descriptor
            if (type.isFunction(descriptor)) {
                descriptor = descriptor();
            }
            //default descriptor to empty object
            type.isObject(descriptor) || (descriptor = {});
            //default namespace to null if not string
            var namespace = type.isString(descriptor.namespace) ? descriptor.namespace : null;
            //evaluate class name according to given namespace
            name = classes.getName.call({$namespace: namespace}, name);

            //default descriptor to object
            type.isObject(descriptor) || (descriptor = {});

            //default constructor to emptyFn if not function
            type.isFunction(descriptor.constructor) || (descriptor.constructor = emptyFn);

            //default constructor default to empty array if not array
            type.isArray(descriptor.default) || (descriptor.default = []);

            //return prepared data
            return {
                name: name,
                class: classes.has(name) ? classes.get(name) : false,
                namespace: namespace,
                descriptor: descriptor,
                createdFn: type.isFunction(createdFn) ? createdFn : emptyFn
            }
        },
        extend: function (cls, descriptor) {
            var parent;
            //determine parent class
            if (type.isString(descriptor.extend)) {
                parent = classes.get(cls.getClassName(descriptor.extend));
            } else {
                parent = Base;
            }
            //cls from parent
            core.extend(cls, parent);
            return parent;
        },
        singleton: function (cls, description) {
            //return cls if not singleton
            if (object.hasKey(description, 'singleton') && description.singleton) {
                //update description - move methods and properties to static
                description.static = {};
                if (description.properties) {
                    description.static.properties = description.properties;
                    delete description.properties;
                }
                if (description.methods) {
                    description.static.methods = description.methods;
                    delete description.methods;
                }
                return function () {
                };
            } else {
                return cls;
            }
        },
        require: function (cls, descriptor) {

        },
        mixin: function (cls, descriptor) {

        },
        configure: function (cls, parent, descriptor) {
            //combinate class descriptor
            //inherited descriptor
            var inherits = parent.getDescriptor();

            //own descriptor
            var owned = {};
            //const
            owned.const = type.isObject(descriptor.const) ? descriptor.const : {};
            //static properties and methods
            owned.static = {};
            type.isObject(descriptor.static) || (descriptor.static = {});
            owned.static.properties = type.isObject(descriptor.static.properties) ? descriptor.static.properties : {};
            owned.static.methods = type.isObject(descriptor.static.methods) ? descriptor.static.methods : {};
            //public properties and methods
            owned.properties = type.isObject(descriptor.properties) ? descriptor.properties : {};
            owned.methods = type.isObject(descriptor.methods) ? descriptor.methods : {};

            //real class descriptor applies owned properties defaulted to inherits
            var real = {};
            //const: defaulted from inherits
            real.const = object.defaults(owned.const, inherits.const);
            //static properties and methods
            real.static = {};
            real.static.properties = object.defaults(owned.static.properties, inherits.static.properties);
            real.static.methods = object.defaults(owned.static.methods, inherits.static.methods);
            //public properties and methods
            real.properties = object.defaults(owned.properties, inherits.properties);
            real.methods = object.defaults(owned.methods, inherits.methods);

            //apply real descriptor and return it in processed variant
            return desc.apply(cls, real);
        }
    };
    var postprocessors = {

    };
    /**
     * type-related functions
     * @type {}
     */
    var type = {
        get: function (value) {
            var type = typeof value;
            if (value == null) {
                type = 'null';
            } else if (Array.isArray(value)) {
                type = 'array';
            } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                type = 'number';
            }
            return type;
        },
        /**
         *
         * @param value
         * @returns {boolean}
         */
        isObject: function (value) {
            return typeof value == 'object';
        },
        isArray: function (value) {
            return Array.isArray(value);
        },
        isFunction: function (value) {
            return typeof value == 'function';
        },
        isString: function (value) {
            return typeof value == 'string';
        },
        isNumber: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        isNull: function (value) {
            return value == null;
        },
        isUndefined: function (value) {
            return typeof value == 'undefined';
        },
        isBoolean: function (value) {
            return typeof value == 'boolean';
        },
        isEmpty: function (value) {
            var type = this.typeOf(value);
            if (type == 'object') {
                return !object.keys(value).length;
            } else if (type == 'array') {
                return !value.length;
            } else if (type == 'string') {
                return !value.trim();
            } else if (type == 'number') {
                return value == 0;
            } else {
                return type != 'function' && type != 'boolean';
            }
        }
    };
    /**
     * implement Base class (all classes extend it)
     * @constructor
     */
    var Base = function () {
    };
    //set class basics
    //basic consts
    core.const(Base, '$name', 'Base');
    core.const(Base, '$namespace', null);
    //set basic methods
    core.method(Base, 'getClassName', {value: classes.getName});
    core.method(Base, 'getDescriptor', {value: function () {
        return {
            const: {
                $isClass: true
            },
            static: {
                properties: {},
                methods: {
                }
            },
            properties: {},
            methods: {
            }
        };
    }});
    //inheritance
    core.method(Base, 'isParent', {value: classes.isParent});
    core.method(Base, 'isChild', {value: classes.isChild});

    /**
     * framework-related base implementations
     * @type {}
     */
    var framework = {
        defined: function (name) {
            return classes.has(name);
        },
        define: function (name, description, createdFn) {
            //prepare class data
            var data = preprocessors.prepare(name, description, createdFn);
            description = data.descriptor;
            createdFn = data.createdFn;
            //return class if exists
            if (data.class) {
                //call createdFn
                createdFn.call(data.class);
                return data.class;
            }
            //proto object, containing constructor
            var proto = {};
            //class descriptor
            var descriptor;
            //static privates
            var privates = {};

            //create class object
            var cls = function Class() {
                //no all operations in native class constructor, preventing downcall usage
                if (!this.$class || this.$class === cls) {
                    //instance privates
                    var privates = {};
                    //parent method
                    core.method(this, 'parent', {value: classes.parent});
                    //private setter/getter
                    core.method(this, '__get', {value: function (name) {
                        return privates[name]
                    }});
                    core.method(this, '__set', {value: function (name, value) {
                        privates[name] = value;
                    }});
                    //class reference
                    core.const(this, '$class', cls);
                    //apply properties to object
                    set.each(descriptor.properties, function (description, name) {
                        core.property(this, name, description);
                        object.hasKey(description, 'default') && (this[name] = description.default);
                    }, this);
                }
                //apply constructor
                proto.constructor.apply(this, arguments);
            };
            //singleton implementation
            cls = preprocessors.singleton(cls, description);

            //set class basics
            //basic consts
            core.const(cls, '$name', data.name);
            core.const(cls, '$namespace', data.namespace);
            //basic methods
            core.method(cls, 'getClassName', {value: classes.getName});
            core.method(cls, 'getDescriptor', {value: function () {
                return descriptor;
            }});
            //inheritance
            core.method(cls, 'parent', {value: classes.parent});
            core.method(cls, 'isParent', {value: classes.isParent});
            core.method(cls, 'isChild', {value: classes.isChild});
            //static getter/setter
            core.method(cls, '__get', {value: function (name) {
                return privates[name]
            }});
            core.method(cls, '__set', {value: function (name, value) {
                privates[name] = value;
            }});

            //extend
            var parent = preprocessors.extend(cls, description);

            //proto constructor
            core.method(proto, 'constructor', {
                value: description.constructor,
                default: description.default,
                $parent: cls.$parent.prototype,
                wrap: true
            });
            core.method(cls, '$factory', {
                value: core.factory(cls)
            });

            //requires
            preprocessors.require(cls, data);
            //mixins
            preprocessors.mixin(cls, data);
            //properties configuration
            descriptor = preprocessors.configure(cls, parent, description);

            //save class in namespace
            classes.set(root, data.name, cls);

            //call createdFn after class created
            createdFn.call(cls);

            //return created class
            return cls;
        },
        /**
         * create class instance
         * @param name
         * @param properties
         */
        create: function (name) {
            if (!classes.has(name)) {
                throw 'class "' + name + '" doesn\'t exist';
            }
            var cls = classes.get(name);
            //call factory
            var instance = cls.$factory.apply(null, slice(arguments, 1));
            return instance;
        }
    };

    //define framework class
    framework.define(ns, {
        singleton: true,
        properties: {
            emptyFn: emptyFn
        },
        methods: {
            defined: framework.defined,
            define: framework.define,
            create: framework.create,
            typeOf: type.get,
            isObject: type.isObject,
            isArray: type.isArray,
            isFunction: type.isFunction,
            isString: type.isString,
            isNumber: type.isNumber,
            isNull: type.isNull,
            isUndefined: type.isUndefined,
            isBoolean: type.isBoolean,
            isEmpty: type.isEmpty,
            keys: set.keys,
            values: set.values,
            hasKey: set.hasKey,
            has: set.has,
            keyOf: set.keyOf,
            lastKeyOf: set.lastKeyOf,
            size: set.size,
            each: set.each,
            eachReverse: set.eachReverse,
            map: set.map,
            reduce: set.reduce,
            reduceRight: set.reduceRight,
            filter: set.filter,
            filterLast: set.filterLast,
            filterAll: set.filterAll,
            find: set.find,
            findLast: set.findLast,
            findAll: set.findAll,
            every: set.every,
            some: set.some,
            first: set.first,
            last: set.last,
            shift: set.shift,
            pop: set.pop,
            remove: set.remove,
            removeLast: set.removeLast,
            removeAll: set.removeAll,
            clone: set.clone,
            extend: set.extend,
            pick: set.pick,
            omit: set.omit,
            defaults: set.defaults,
            compact: array.compact,
            union: array.union,
            intersection: array.intersection,
            difference: array.difference,
            uniques: array.uniques,
            range: array.range,
            bind: fn.bind,
            prefill: fn.prefill,
            once: fn.once,
            wrap: fn.wrap,
            nextTick: fn.nextTick
        }
    });

    //shortcut framework
    var xs = root[ns];

    // Export the xs object for **Node.js**, if on server side.
    if (typeof exports !== 'undefined') {
        delete root[ns];
        exports[ns] = xs;
    }
}).call(window, 'xs');