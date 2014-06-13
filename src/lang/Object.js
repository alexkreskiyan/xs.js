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
 * object class pre-definition
 * @type {{}}
 * @private
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var object = xs.Object = new (function () {
        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice);
        /**
         * returns object keys
         * @param obj
         * @returns {Array}
         */
        var _keys = this.keys = function (obj) {
            return Object.keys(obj);
        };
        /**
         * returns object values
         * @param obj
         * @returns {Array}
         */
        this.values = function (obj) {
            var values = [],
                idx,
                keys = _keys(obj),
                len = keys.length;
            for (idx = 0; idx < len; idx++) {
                values.push(obj[keys[idx]]);
            }
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
         * @param value
         * @returns {boolean}
         */
        var _has = this.has = function (obj, value) {
            return _find(obj, function (val) {
                return val === value;
            }) !== undefined;
        };
        /**
         * returns name of first property with value equal to given
         * @param obj
         * @param value
         * @returns {string|Number|undefined}
         */
        var _keyOf = this.keyOf = function (obj, value) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
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
        var _lastKeyOf = this.lastKeyOf = function (obj, value) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
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
            return Object.keys(obj).length;
        };
        /**
         * iterates over object own properties
         * @param obj
         * @param iterator
         * @param scope
         */
        var _each = this.each = function (obj, iterator, scope) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                iterator.call(scope, obj[name], name, obj);
            }
        };
        /**
         * iterates over object own properties in reverse order
         * @param obj
         * @param iterator
         * @param scope
         */
        var _eachReverse = this.eachReverse = function (obj, iterator, scope) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                iterator.call(scope, obj[name], name, obj);
            }
        };
        /**
         * produces a new object with properties, updated by iterator function
         * @param obj
         * @param iterator
         * @param scope
         * @returns {Object}
         */
        this.map = function (obj, iterator, scope) {
            var result = _clone(obj);
            _each(obj, function (value, key, object) {
                result[key] = iterator.call(this, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces a hash of elements, returned by iterator function from left
         * @param obj
         * @param iterator
         * @param scope
         * @param memo
         * @returns {*}
         */
        this.reduce = function (obj, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                var key = _keys(obj).shift();
                result = obj[key];
                obj = _omit(obj, key);
            }
            _each(obj, function (value, key, object) {
                result = iterator.call(this, result, value, key, object);
            }, scope);
            return result;
        };
        /**
         * reduces a hash of elements, returned by iterator function from right
         * @param obj
         * @param iterator
         * @param scope
         * @param memo
         * @returns {*}
         */
        this.reduceRight = function (obj, iterator, memo, scope) {
            var result;
            if (arguments.length > 2) {
                result = memo;
            } else {
                var key = _keys(obj).pop();
                result = obj[key];
                obj = _omit(obj, key);
            }
            _eachReverse(obj, function (value, key, object) {
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
        var _find = this.find = function (obj, finder, scope) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name,
                value;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                value = obj[name];
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
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name,
                value;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                value = obj[name];
                if (finder.call(scope, value, name, obj)) {
                    return value;
                }
            }
        };
        /**
         * returns pick of object, where all properties match given finder function
         * @param obj
         * @param finder
         * @param scope
         * @returns {Array|*}
         */
        var _findAll = this.findAll = function (obj, finder, scope) {
            var keys = [];
            _each(obj, function (value, name, obj) {
                finder.call(this, value, name, obj) && keys.push(name);
            }, scope);
            return _pick(obj, keys);
        };
        /**
         * returns value of first property, matching given where clause
         * @param obj
         * @param where
         * @returns {*}
         */
        this.filter = function (obj, where) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name,
                value,
                ok;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                value = obj[name];
                ok = _every(where, function (param, name) {
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
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name,
                value,
                ok;
            for (idx = len - 1; idx >= 0; idx--) {
                name = keys[idx];
                value = obj[name];
                ok = _every(where, function (param, name) {
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
            var keys = [];
            _each(obj, function (value, name) {
                _every(where, function (param, name) {
                    return value[name] === param;
                }) && keys.push(name);
            }, this);
            return _pick(obj, keys);
        };
        /**
         * returns whether all object properties pass given tester function
         * @param obj
         * @param tester
         * @param scope
         * @returns {boolean}
         */
        var _every = this.every = function (obj, tester, scope) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                if (!tester.call(scope, obj[name], name, obj)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * returns whether count of object properties pass given tester function
         * @param obj
         * @param tester
         * @param count
         * @param scope
         * @returns {boolean}
         */
        this.some = function (obj, tester, count, scope) {
            var idx,
                keys = _keys(obj),
                len = keys.length,
                name,
                found = 0;
            count = count || 1;
            for (idx = 0; idx < len; idx++) {
                name = keys[idx];
                tester.call(scope, obj[name], name, obj) && found++;
                if (found >= count) {
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
            var key = _keys(obj).shift();
            return obj[key];
        };
        /**
         * returns last object property
         * @param obj
         * @returns {*}
         */
        this.last = function (obj) {
            var key = _keys(obj).pop();
            return obj[key];
        };
        /**
         * shifts and returns first object property
         * @param obj
         * @returns {*}
         */
        this.shift = function (obj) {
            var key = _keys(obj).shift();
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
            var key = _keys(obj).pop();
            var value = obj[key];
            delete obj[key];
            return value;
        };
        /**
         * removes first property from object, that matches given element by name or value
         * @param obj
         * @param element
         */
        var _remove = this.remove = function (obj, element) {
            if ((typeof element == 'string' || typeof element == 'number') && obj.hasOwnProperty(element)) {
                delete obj[element];
            } else if (_has(obj, element)) {
                delete obj[_keyOf(obj, element)];
            }
        };
        /**
         * removes last property from object, that matches given element by name or value
         * @param obj
         * @param element
         */
        this.removeLast = function (obj, element) {
            if ((typeof element == 'number' || typeof element == 'string') && obj.hasOwnProperty(element)) {
                delete obj[element];
            } else if (_has(obj, element)) {
                delete obj[_lastKeyOf(obj, element)];
            }
        };
        /**
         * removes all items from list, passed as array/plain arguments
         * @param obj
         */
        this.removeAll = function (obj) {
            var elements = xs.Array.union(slice(arguments, 1));
            xs.Array.each(elements, function (element) {
                _remove(obj, element);
            }, this);
        };
        /**
         * return shallow-cloned object copy
         * @param obj
         * @returns {*}
         */
        var _clone = this.clone = function (obj) {
            return _extend({}, obj);
        };
        /**
         * copies all properties from objects/arrays, passed as arguments to given obj
         * @param obj
         * @returns {*}
         */
        var _extend = this.extend = function (obj) {
            var adds = xs.Array.union(slice(arguments, 1));
            xs.Array.each(adds, function (source) {
                source !== null && typeof source == 'object' && _each(source, function (value, name) {
                    obj[name] = value;
                });
            }, this);
            return obj;
        };
        /**
         * returns copy of given object, filtered not to have falsy values
         * @param obj
         * @returns {*}
         */
        this.compact = function (obj) {
            return _findAll(obj, function (value) {
                return value;
            })
        };
        /**
         * returns union of objects, passed as arguments, or array of objects as single argument
         * @returns {*}
         */
        this.union = function () {
            var merge = xs.Array.union(arguments.length == 1 ? slice(arguments).pop() : slice(arguments)),
                union = {},
                key;
            xs.Array.each(merge, function (value) {
                key = _keys(value).pop();
                union[key] = value[key];
            }, this);
            return _unique(union);
        };
        /**
         * returns intersection of given objects (although intersection elements are unique)
         * @returns {Object}
         */
        this.intersection = function () {
            var objects = arguments.length == 1 && arguments[0] ? slice(arguments).pop() : slice(arguments); //get objects list
            if (!objects.length) {
                return {};
            }
            var first = objects.pop();
            //iterate over each element in all (they are unique)
            return _findAll(first, function (item) {
                //check whether all other objects have this value
                return objects.every(function (obj) {
                    return _has(obj, item);
                }, this);
            }, this);
        };
        /**
         * Take the difference between one object and a number of other objects.
         * Only the elements present in just the first object will remain.
         * @param obj
         * @returns {Object}
         */
        this.difference = function (obj) {
            var objects = slice(arguments, 1); //get objects list
            if (!objects.length) {
                return obj;
            }
            //iterate over each element in all (they are unique)
            return _findAll(obj, function (item) {
                //check whether all other objects have this value
                return objects.every(function (obj) {
                    return !_has(obj, item);
                }, this);
            }, this);
        };
        /**
         * returns object, filled by unique items of given object
         * @param obj
         * @returns {Object}
         */
        var _unique = this.unique = function (obj) {
            var unique = {};
            _each(obj, function (value, name) {
                _has(unique, value) || (unique[name] = value);
            }, this);
            return unique;
        };
        /**
         * returns copy of object with only white-listed keys, passed in 2+ arguments
         * @param obj
         * @returns {{}}
         */
        var _pick = this.pick = function (obj) {
            var copy = {},
                keys = xs.Array.union(slice(arguments, 1));
            xs.Array.each(keys, function (key) {
                key in obj && (copy[key] = obj[key]);
            });
            return copy;
        };
        /**
         * returns copy of object without black-listed keys, passed in 2+ arguments
         * @param obj
         * @returns {{}}
         */
        var _omit = this.omit = function (obj) {
            var copy = {},
                keys = xs.Array.union(slice(arguments, 1));
            _each(obj, function (value, name) {
                keys.indexOf(name) < 0 && (copy[name] = value);
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
            _each(slice(arguments, 1), function (source) {
                source !== null && typeof source == 'object' && _each(source, function (value, name) {
                    obj.hasOwnProperty(name) || (obj[name] = source[name]);
                }, this);
            }, this);
            return obj;
        };
    });
    xs.extend = object.extend;
})(window, 'xs');