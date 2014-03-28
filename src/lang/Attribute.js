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

    var property = xs.Attribute = new (function () {
        /**
         * Fetches arguments names from function string representation
         * @type {RegExp}
         */
        var fnArgsRe = /^function\s(?:\w+)?\(([A-Za-z0-9\s,]*)\)/i;
        /**
         * Checks whether object has own property defined
         * @param obj
         * @param key
         * @returns {boolean}
         */
        var defined = function (obj, key) {
            return !!(obj.hasOwnProperty(key));
        };
        /**
         * Defines property with given descriptor for object
         * If descriptor given - one property with name equal to key is defined
         * If no descriptor is given - a set of properties given in key is defined
         * @param obj
         * @param key
         * @param descriptor
         * @returns {Object}
         */
        var define = function (obj, key, descriptor) {
            return descriptor ? Object.defineProperty(obj, key, descriptor) : Object.defineProperties(obj, key);
        };
        /**
         * Fetches own property descriptor
         * @param obj
         * @param key
         * @returns {Object}
         */
        var getDescriptor = function (obj, key) {
            return Object.getOwnPropertyDescriptor(obj, key);
        };
        var isAssigned = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.hasOwnProperty('value');
        };
        var isAccessed = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && (descriptor.hasOwnProperty('get') || descriptor.hasOwnProperty('get'));
        };
        var isWritable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && !!descriptor.writable;
        };
        var isConfigurable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.configurable;
        };
        var isEnumerable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.enumerable;
        };
        var defineConstant = function (obj, name, value) {
            if (defined(obj, name) && !isConfigurable(obj, name)) {
                return false;
            }
            define(obj, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            });
            return true;
        };
        var isDescriptor = function (desc) {
            //false if descriptor is not object
            if (!xs.isObject(desc)) {
                return false;
            }
            //if any descriptor fields specified - it is descriptor
            if (desc.hasOwnProperty('get') ||
                desc.hasOwnProperty('set') ||
                desc.hasOwnProperty('value') ||
                desc.hasOwnProperty('writable') ||
                desc.hasOwnProperty('configurable') ||
                desc.hasOwnProperty('enumerable')) {
                return true;
            }
            return false;
        };
        var prepareDescriptor = function (desc) {
            //non-function accessors are removed
            if (desc.hasOwnProperty('get') && !xs.isFunction(desc.get)) {
                delete desc.get;
            }
            if (desc.hasOwnProperty('set') && !xs.isFunction(desc.set)) {
                delete desc.set;
            }
            //accessors are preferred to value: value and writable are removed
            if (desc.get || desc.set) {
                delete desc.value;
                delete desc.writable;
            }
            //writable,enumerable,configurable - are converted if presented
            desc.hasOwnProperty('writable') && (desc.writable = !!desc.writable);
            desc.hasOwnProperty('configurable') && (desc.configurable = !!desc.configurable);
            desc.hasOwnProperty('enumerable') && (desc.enumerable = !!desc.enumerable);
            //any additional fields allowed
            return desc;
        };
        var property = {
            prepare: function (name, desc) {
                if (!isDescriptor(desc)) {
                    return {
                        value: desc
                    };
                }
                desc = prepareDescriptor(desc);
                if (desc.get || desc.set) {
                    desc.get || eval('desc.get = function () {return this.__get(\'' + name + '\');}');
                    desc.set || eval('desc.set = function (value) {return this.__set(\'' + name + '\',value);}');
                } else {
                    desc.hasOwnProperty('value') || (desc.value = undefined);
                    desc.writable = true;
                }
                desc.default = desc.value;
                return desc;
                //checks for incorrect descriptor
                //check for
            },
            define: function (obj, name, desc) {
                if (defined(obj, name) && !isConfigurable(obj, name)) {
                    return false;
                }
                var descriptor = xs.Object.defaults({
                    writable: true,
                    enumerable: true,
                    configurable: false
                }, desc);
                define(obj, name, descriptor);
                return true;
            }
        };
        var method = {
            prepare: function (name, desc) {
                var descriptor = {};
                if (xs.isFunction(desc)) {
                    descriptor.value = desc;
                    //allowed as object with fn property, containing method function
                } else if (xs.isObject(desc)) {
                    desc = prepareDescriptor(desc);
                    //function may be specified in fn or value properties
                    if (xs.isFunction(desc.fn)) {
                        descriptor.value = desc.fn;
                    } else if (xs.isFunction(desc.value)) {
                        descriptor.value = desc.value;
                    } else {
                        return false;
                    }
                    //else  - return false
                } else {
                    return false;
                }
                //assign defaults
                xs.isArray(desc.default) && (descriptor.default = desc.default);
                //assign wrap
                xs.isBoolean(desc.downcall) && (descriptor.wrap = desc.wrap);
                return descriptor;
            },
            define: function (obj, name, desc) {
                if (defined(obj, name) && !isConfigurable(obj, name)) {
                    return false;
                }
                var descriptor = xs.Object.defaults({
                    writable: false,
                    enumerable: true,
                    configurable: false
                }, desc);
                if (descriptor.default || descriptor.downcall) {
                    descriptor.default = xs.isArray(descriptor.default) ? descriptor.default : [];
                    var fn = descriptor.value;
                    if (descriptor.downcall) {
                        //get count of arguments, defined by function;
                        var argsCount = fnArgsRe.exec(fn.toString()).pop().split(',').length;
                        descriptor.value = function () {
                            var args = xs.Array.defaults(xs.Array.values(arguments), descriptor.default);
                            //pass super, needed for parent() calls
                            if (args.length < argsCount) {
                                args[argsCount] = descriptor.parent;
                            } else {
                                args.push(descriptor.parent);
                            }
                            return fn.apply(this, args);
                        };
                    } else {
                        descriptor.value = function () {
                            var args = xs.Array.defaults(xs.Array.values(arguments), descriptor.default);
                            return fn.apply(this, args);
                        };
                    }
                }
                define(obj, name, descriptor);
                return true;
            }
        };
        /**
         * Shorthand for {@link defined}
         * @type {defined}
         */
        this.defined = defined;
        /**
         * Shorthand for {@link define}
         * @type {define}
         */
        this.define = define;
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.getDescriptor = getDescriptor;
        this.isDescriptor = isDescriptor;
        this.prepareDescriptor = prepareDescriptor;
        this.isAssigned = isAssigned;
        this.isAccessed = isAccessed;
        this.isWritable = isWritable;
        this.isConfigurable = isConfigurable;
        this.isEnumerable = isEnumerable;
        this.const = defineConstant;
        this.property = property;
        this.method = method;
    });
    xs.Object.extend(xs, {
        const: property.const,
        property: property.property,
        method: property.method
    });
})(window, 'xs');