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

    var property = xs.Property = new (function () {
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
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.isAssigned = isAssigned;
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.isAccessed = isAccessed;
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.isWritable = isWritable;
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.isConfigurable = isConfigurable;
        /**
         * Shorthand for {@link getDescriptor}
         * @type {getDescriptor}
         */
        this.isEnumerable = isEnumerable;
        /**
         * Defines a constant
         * @param obj
         * @param name
         * @param value
         */
        this.const = function (obj, name, value) {
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
        this.property = function (obj, name, desc) {
            if (defined(obj, name) && !isConfigurable(obj, name)) {
                return false;
            }
            if (!desc.hasOwnProperty('value') && !desc.hasOwnProperty('get') && !desc.hasOwnProperty('set')) {
                return false;
            }
            var descriptor = xs.Object.defaults({
                enumerable: true,
                configurable: false
            }, desc);
            define(obj, name, descriptor);
            return true;
        };
        this.method = function (obj, name, desc) {
            if (defined(obj, name) && !isConfigurable(obj, name)) {
                return false;
            }
            if (!desc.hasOwnProperty('value')) {
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
        };
    });
    xs.Object.extend(xs, {
        const: property.const,
        property: property.property,
        method: property.method
    });
})(window, 'xs');