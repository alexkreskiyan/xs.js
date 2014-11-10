/*!
 This file is core of xs.js

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
 * @class xs.lang.Attribute
 * @singleton
 * @private
 *
 * xs.lang.Attribute is private singleton, providing basic attributes' operations
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var attribute = xs.Attribute = new (function () {
        var me = this;

        /**
         * Checks whether object has name, defined as own property
         *
         * For example:
         *
         *     var object = {
         *         x: 1
         *     };
         *     console.log(xs.Attribute.defined(object, 'x'));//true
         *     console.log(xs.Attribute.defined(object, 'y'));//false
         *
         * @method defined
         *
         * @param {Object} object verified object
         * @param {String} name verified name
         *
         * @returns {boolean} verification result
         */
        var defined = me.defined = function (object, name) {
            return object.hasOwnProperty(name);
        };

        /**
         * Defines property with given descriptor for object
         * If descriptor given - one property with name equal to name is defined
         * If no descriptor is given - a set of properties given in name is defined
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {
         *         value: 5,
         *         configurable: true
         *     });
         *     console.log(x);
         *     //outputs:
         *     //{
         *     //    a: 5
         *     //}
         *
         *     xs.Attribute.define(x, {
         *         a: {value: 1},
         *         b: {value: 2}
         *     });
         *     console.log(x);
         *     //outputs:
         *     //{
         *     //    a: 1,
         *     //    b: 2
         *     //}
         *
         * @method define
         *
         * @param {Object} object used object
         * @param {Object|string} name new property's name of list of new properties
         * @param {Object} descriptor descriptor of new property
         */
        var define = me.define = function (object, name, descriptor) {
            descriptor ? Object.defineProperty(object, name, descriptor) : Object.defineProperties(object, name);
        };

        /**
         * Fetches own property descriptor
         *
         * For example:
         *
         *     xs.Attribute.getDescriptor({x: 1}, 'x');
         *
         * @method getDescriptor
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {Object} property descriptor
         */
        var getDescriptor = me.getDescriptor = function (object, name) {
            return Object.getOwnPropertyDescriptor(object, name);
        };

        /**
         * Checks whether property is assignable (Value name exists in descriptor)
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {value: 1, configurable: true});
         *     console.log(xs.Attribute.isAssigned(x, 'a')); //true
         *     xs.Attribute.define(x, 'a', {set: function(){}});
         *     console.log(xs.Attribute.isAssigned(x, 'a')); //false
         *
         * @method isAssigned
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {boolean} whether property is assigned
         */
        me.isAssigned = function (object, name) {
            var descriptor = getDescriptor(object, name);
            return !!descriptor && descriptor.hasOwnProperty('value');
        };

        /**
         * Checks whether property is accessed
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {value: 1, configurable: true});
         *     console.log(xs.Attribute.isAccessed(x, 'a')); //false
         *     xs.Attribute.define(x, 'a', {set: function(){}});
         *     console.log(xs.Attribute.isAccessed(x, 'a')); //true
         *
         * @method isAccessed
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {boolean} whether property is accessed
         */
        me.isAccessed = function (object, name) {
            var descriptor = getDescriptor(object, name);
            return !!descriptor && (descriptor.hasOwnProperty('get') || descriptor.hasOwnProperty('set'));
        };

        /**
         * Checks whether property is writable
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {value: 1, writable: true, configurable: true});
         *     console.log(xs.Attribute.isWritable(x, 'a')); //true
         *     xs.Attribute.define(x, 'a', {set: function(){ }});
         *     console.log(xs.Attribute.isWritable(x, 'a')); //false
         *
         * @method isWritable
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {boolean} whether property is writable
         */
        me.isWritable = function (object, name) {
            var descriptor = getDescriptor(object, name);
            return !!descriptor && !!descriptor.writable;
        };

        /**
         * Checks whether property is configurable
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {value: 1, writable: true, configurable: true});
         *     console.log(xs.Attribute.isWritable(x, 'a')); //true
         *     xs.Attribute.define(x, 'a', {set: function(){ }});
         *     console.log(xs.Attribute.isWritable(x, 'a')); //false
         *
         * @method isConfigurable
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {boolean} whether property is configurable
         */
        var isConfigurable = me.isConfigurable = function (object, name) {
            var descriptor = getDescriptor(object, name);
            return !!descriptor && !!descriptor.configurable;
        };

        /**
         * Checks whether property is enumerable
         *
         * For example:
         *
         *     var x = {};
         *     xs.Attribute.define(x, 'a', {enumerable: true, configurable: true});
         *     console.log(xs.Attribute.isEnumerable(x, 'a')); //true
         *     xs.Attribute.define(x, 'a', {enumerable: false});
         *     console.log(xs.Attribute.isEnumerable(x, 'a')); //false
         *
         * @method isEnumerable
         *
         * @param {Object} object used object
         * @param {string} name property name
         *
         * @returns {boolean} whether property is enumerable
         */
        me.isEnumerable = function (object, name) {
            var descriptor = getDescriptor(object, name);
            return !!descriptor && !!descriptor.enumerable;
        };

        /**
         * Checks whether given desc is descriptor
         *
         * For example:
         *
         *     console.log(xs.Attribute.isDescriptor({enumerable: true, configurable: true})); //true
         *     console.log(xs.Attribute.isDescriptor({date: 1, number: 3})); //false
         *
         * @method isDescriptor
         *
         * @param {Object} desc verified descriptor
         *
         * @returns {boolean} whether descriptor given
         */
        var isDescriptor = me.isDescriptor = function (desc) {
            //false if descriptor is not object
            if (!xs.isObject(desc)) {
                return false;
            }

            //if any descriptor fields specified - it is descriptor
            return defined(desc, 'get') || defined(desc, 'set') || defined(desc, 'value') || defined(desc, 'writable') || defined(desc, 'configurable') || defined(desc, 'enumerable');
        };

        /**
         * Defines constant
         *
         * For example:
         *
         *     var x = {};
         *     console.log(xs.Attribute.const(x, 'a', 5)); //true
         *     console.log(xs.Attribute.const(x, 'a', 5)); //false
         *     console.log(xs.Attribute.isAssigned(x, 'a')); //true
         *     console.log(xs.Attribute.isAccessed(x, 'a')); //false
         *     console.log(xs.Attribute.isWritable(x, 'a')); //false
         *     console.log(xs.Attribute.isConfigurable(x, 'a')); //false
         *     console.log(xs.Attribute.isEnumerable(x, 'a')); //true
         *
         * @method const
         *
         * @param {Object} object used object
         * @param {string} name const name
         * @param {*} value const value
         *
         * @returns {boolean} define status. false is returned if object.name is already defined and not configurable
         */
        me.const = function (object, name, value) {
            if (defined(object, name) && !isConfigurable(object, name)) {
                return false;
            }
            define(object, name, {
                value:        value,
                writable:     false,
                enumerable:   true,
                configurable: false
            });
            return true;
        };

        /**
         * Prepares descriptor from given object
         *
         * For example:
         *
         *     console.log(xs.Attribute.prepareDescriptor({
         *         value: 1,
         *         x: 5
         *     }));
         *     //outputs:
         *     //{
         *     //    value: 1,
         *     //    x: 5 //properties, not relative to descriptor are not deleted
         *     //}
         *     console.log(xs.Attribute.prepareDescriptor({
         *         get: 5,
         *         value: 1,
         *         x: 5
         *     }));
         *     //outputs:
         *     //{
         *     //    value: 1,
         *     //    x: 5 //properties, not relative to descriptor are not deleted
         *     //}
         *     console.log(xs.Attribute.prepareDescriptor({
         *         get: function() {},
         *         value: 1,
         *         x: 5
         *     }));
         *     //outputs:
         *     //{
         *     //    get: function() {},
         *     //    x: 5 //properties, not relative to descriptor are not deleted
         *     //}
         *
         * Important: Properties, that are not relative to property descriptor itself, are not removed from given descriptor
         *
         * @method prepareDescriptor
         *
         * @param {Object} descriptor incoming descriptor
         *
         * @returns {Object} corrected descriptor copy
         */
        var prepareDescriptor = me.prepareDescriptor = function (descriptor) {
            var desc = xs.clone(descriptor);
            //non-function get|set are removed
            if (defined(desc, 'get') && !xs.isFunction(desc.get)) {
                delete desc.get;
            }
            if (defined(desc, 'set') && !xs.isFunction(desc.set)) {
                delete desc.set;
            }

            //get|set are preferred to value: value and writable are removed
            if (desc.get || desc.set) {
                delete desc.value;
                delete desc.writable;
            }

            //writable,enumerable,configurable - are converted if presented
            defined(desc, 'writable') && (desc.writable = !!desc.writable);
            defined(desc, 'configurable') && (desc.configurable = !!desc.configurable);
            defined(desc, 'enumerable') && (desc.enumerable = !!desc.enumerable);

            //any additional fields allowed
            return desc;
        };

        /**
         * @class xs.lang.Attribute.property
         * @singleton
         * @private
         *
         * Contains methods to prepare and define properties
         */
        me.property = {

            /**
             * Prepares property descriptor
             *
             * For example:
             *
             *     var descriptor = xs.Attribute.property.prepare();
             *     console.log(descriptor);
             *     //outputs:
             *     //{
             *     //    value: undefined,
             *     //    writable: false,
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *     var descriptor = xs.Attribute.property.prepare('x', {
             *         get: function() {}
             *     });
             *     console.log(descriptor);
             *     //outputs:
             *     //{
             *     //    get: function(){},
             *     //    set: function(value) { this.privates.x = value },
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *
             * @method prepare
             *
             * @param {string} name property name
             * @param {Object|*} descriptor property descriptor
             *
             * @returns {Object} prepared descriptor
             */
            prepare: function (name, descriptor) {
                //if not descriptor - returns generated one
                if (!isDescriptor(descriptor)) {

                    return {
                        value:        descriptor,
                        writable:     true,
                        enumerable:   true,
                        configurable: false
                    };
                }

                //prepares descriptor
                var desc = prepareDescriptor(descriptor);

                //get|set priority
                if (desc.get || desc.set) {
                    desc.get || eval('desc.get = function () {return this.privates.' + name + ';}');
                    desc.set || eval('desc.set = function (value) {this.privates.' + name + ' = value;}');
                } else {
                    defined(desc, 'value') || (desc.value = undefined);
                    desc.writable = true;
                }
                desc.enumerable = true;
                desc.configurable = false;

                return desc;
            },

            /**
             * Defines property for object
             *
             * For example:
             *
             *     var x = {};
             *     console.log(xs.Attribute.property.define(x, 'a', {
             *         value: 1,
             *         enumerable: false,
             *         configurable: true
             *     }));
             *     //outputs:
             *     //true
             *     console.log(xs.Attribute.getDescriptor(x, 'a'));
             *     //outputs:
             *     //{
             *     //    value: 1,
             *     //    writable: true,
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *     console.log(xs.Attribute.property.define(x, 'a', {
             *         value: 1,
             *         enumerable: false,
             *         configurable: true
             *     }));
             *     //outputs:
             *     //false
             *
             * @method define
             *
             * @param {Object} object used object
             * @param {string} name defined property name
             * @param {Object} desc defined property descriptor
             *
             * @returns {boolean}
             */
            define: function (object, name, desc) {
                if (defined(object, name) && !isConfigurable(object, name)) {

                    return false;
                }

                //writable, enumerable and configurable are immutable defaults
                var descriptor = {
                    enumerable:   true,
                    configurable: false
                };
                if (!desc.get && !desc.set) {
                    descriptor.writable = true;
                }

                xs.defaults(descriptor, desc);

                //define property and return
                define(object, name, descriptor);

                return true;
            }
        };

        /**
         * @class xs.lang.Attribute.method
         * @singleton
         * @private
         *
         * Contains methods to prepare and define methods
         */
        me.method = {

            /**
             * Prepares method descriptor
             *
             * For example:
             *
             *     var descriptor = xs.Attribute.method.prepare();
             *     console.log(descriptor);
             *     //outputs:
             *     //false
             *     var descriptor = xs.Attribute.method.prepare('x', function() {});
             *     console.log(descriptor);
             *     //outputs:
             *     //{
             *     //    value: function(){},
             *     //    writable: function(value) { this.privates.x = value },
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *
             * @method prepare
             *
             * @param name
             * @param desc
             *
             * @returns {Object}
             */
            prepare: function (name, desc) {
                var descriptor = {
                    writable:     false,
                    enumerable:   true,
                    configurable: false
                };
                if (xs.isFunction(desc)) {
                    descriptor.value = desc;
                    //allowed as object with fn property, containing method function
                } else if (xs.isObject(desc) && xs.isFunction(desc.value)) {
                    descriptor.value = desc.value;
                    //else  - return false
                } else {
                    return false;
                }
                return descriptor;
            },

            /**
             * Define method for object
             *
             * For example:
             *
             *     var x = {};
             *     console.log(xs.Attribute.method.define(x, 'a', {
             *         value:function(){ }
             *     }));
             *     //outputs:
             *     //true
             *     console.log(xs.Attribute.getDescriptor(x, 'a'));
             *     //outputs:
             *     //{
             *     //    value: function(){ },
             *     //    writable: false,
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *     console.log(xs.Attribute.method.define(x, 'a', {
             *         value:function(){ }
             *     }));
             *     //outputs:
             *     //false
             *
             * @method define
             *
             * @param object
             * @param name
             * @param desc
             *
             * @returns {boolean}
             */
            define: function (object, name, desc) {
                if (defined(object, name) && !isConfigurable(object, name)) {
                    return false;
                }
                define(object, name, {
                    value:        desc.value,
                    writable:     false,
                    enumerable:   true,
                    configurable: false
                });
                return true;
            }

        };

    });

    xs.extend(xs, {
        const:    attribute.const,
        property: attribute.property,
        method:   attribute.method
    });
})(window, 'xs');