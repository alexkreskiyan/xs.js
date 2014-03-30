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
 * @type {Object}
 * @private
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var property = xs.Attribute = new (function () {
        /**
         * Checks whether object has own property defined
         * @param obj
         * @param key
         * @returns {boolean}
         */
        var defined = this.defined = function (obj, key) {
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
        var define = this.define = function (obj, key, descriptor) {
            return descriptor ? Object.defineProperty(obj, key, descriptor) : Object.defineProperties(obj, key);
        };
        /**
         * Fetches own property descriptor
         * @param obj
         * @param key
         * @returns {Object}
         */
        var getDescriptor = this.getDescriptor = function (obj, key) {
            return Object.getOwnPropertyDescriptor(obj, key);
        };
        /**
         * Checks whether property is assignable
         * @param obj
         * @param key
         * @returns {boolean}
         */
        this.isAssigned = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.hasOwnProperty('value');
        };
        /**
         * Checks whether property is accessed
         * @param obj
         * @param key
         * @returns {boolean}
         */
        this.isAccessed = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && (descriptor.hasOwnProperty('get') || descriptor.hasOwnProperty('get'));
        };
        /**
         * Checks whether property is writable
         * @param obj
         * @param key
         * @returns {boolean}
         */
        this.isWritable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && !!descriptor.writable;
        };
        /**
         * Checks whether property is configurable
         * @param obj
         * @param key
         * @returns {boolean|*}
         */
        var isConfigurable = this.isConfigurable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.configurable;
        };
        /**
         * Checks whether property is enumerable
         * @param obj
         * @param key
         * @returns {boolean|*}
         */
        this.isEnumerable = function (obj, key) {
            var descriptor = getDescriptor(obj, key);
            return !!descriptor && descriptor.enumerable;
        };
        /**
         * Defines constant
         * @param obj
         * @param name
         * @param value
         * @returns {boolean}
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
        /**
         * Checks whether given desc is descriptor
         * @param desc
         * @returns {boolean}
         */
        var isDescriptor = this.isDescriptor = function (desc) {
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
        /**
         * prepares descriptor from given object
         * @param desc
         * @returns {Object}
         */
        var prepareDescriptor = this.prepareDescriptor = function (desc) {
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
        /**
         * Property object
         * @type {{prepare: prepare, define: define}}
         */
        this.property = {
            /**
             * Prepares property descriptor
             * @param name
             * @param desc
             * @returns {Object}
             */
            prepare: function (name, desc) {
                //if not descriptor - returns generated one
                if (!isDescriptor(desc)) {
                    return {
                        value: desc,
                        default: desc
                    };
                }
                //default is fetched from value if not given
                desc.hasOwnProperty('default') || (desc.default = desc.value);
                //prepares descriptor
                desc = prepareDescriptor(desc);

                //accessors priority
                if (desc.get || desc.set) {
                    desc.get || eval('desc.get = function () {return this.__get(\'' + name + '\');}');
                    desc.set || eval('desc.set = function (value) {return this.__set(\'' + name + '\',value);}');
                } else {
                    desc.hasOwnProperty('value') || (desc.value = undefined);
                }

                return desc;
            },
            /**
             * Defines property for object
             * @param obj
             * @param name
             * @param desc
             * @returns {boolean}
             */
            define: function (obj, name, desc) {
                if (defined(obj, name) && !isConfigurable(obj, name)) {
                    return false;
                }

                //writable, enumerable and configurable are immutable defaults
                var defaults = {
                    enumerable: true,
                    configurable: false
                };
                if (!desc.get && !desc.set) {
                    defaults.writable = true;
                }
                var descriptor = xs.Object.defaults(defaults, desc);
                //define property and return
                define(obj, name, descriptor);
                return true;
            }
        };
        /**
         * Method object
         * @type {{prepare: prepare, define: define}}
         */
        this.method = {
            /**
             * Prepares method descriptor
             * @param name
             * @param desc
             * @returns {Object}
             */
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
                return descriptor;
            },
            /**
             * Define method for object
             * @param obj
             * @param name
             * @param desc
             * @returns {boolean}
             */
            define: function (obj, name, desc) {
                if (defined(obj, name) && !isConfigurable(obj, name)) {
                    return false;
                }
                var descriptor = xs.Object.defaults({
                    writable: false,
                    enumerable: true,
                    configurable: false
                }, desc);
                if (descriptor.default) {
                    descriptor.default = xs.isArray(descriptor.default) ? descriptor.default : [];
                    var fn = descriptor.value;
                    descriptor.value = function () {
                        var args = xs.Array.defaults(xs.Array.values(arguments), descriptor.default);
                        return fn.apply(this, args);
                    };
                }
                define(obj, name, descriptor);
                return true;
            }
        };
    });
    xs.Object.extend(xs, {
        const: property.const,
        property: property.property,
        method: property.method
    });
})(window, 'xs');