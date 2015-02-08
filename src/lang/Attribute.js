/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var log = new xs.log.Logger('xs.interface.Interface');

    var assert = new xs.assert.Asserter(log, AttributeError);

    /**
     * xs.lang.Attribute is private singleton, providing basic attributes' operations
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.Attribute
     *
     * @singleton
     */
    var attribute = xs.Attribute = (function () {
        var me = {};

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
         * @return {Boolean} verification result
         */
        me.defined = function (object, name) {
            assert.string(name, 'defined - given "$name" is not a string', {
                $name: name
            });

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
         * @method define
         *
         * @param {Object} object used object
         * @param {String} name new property's name
         * @param {Object} descriptor descriptor of new property
         */
        me.define = function (object, name, descriptor) {
            assert.string(name, 'define - given "$name" is not a string', {
                $name: name
            });

            assert.object(descriptor, 'define - given "$descriptor" is not an object', {
                $descriptor: descriptor
            });

            Object.defineProperty(object, name, descriptor);
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
         * @param {String} name property name
         *
         * @return {Object} property descriptor
         */
        me.getDescriptor = function (object, name) {
            assert.string(name, 'getDescriptor - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'getDescriptor - given object does not have own property "$name"', {
                $name: name
            });

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
         * @param {String} name property name
         *
         * @return {Boolean} whether property is assigned
         */
        me.isAssigned = function (object, name) {
            assert.string(name, 'isAssigned - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'isAssigned - given object does not have own property "$name"', {
                $name: name
            });

            return Object.getOwnPropertyDescriptor(object, name).hasOwnProperty('value');
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
         * @param {String} name property name
         *
         * @return {Boolean} whether property is accessed
         */
        me.isAccessed = function (object, name) {
            assert.string(name, 'isAccessed - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'isAccessed - given object does not have own property "$name"', {
                $name: name
            });

            return Object.getOwnPropertyDescriptor(object, name).hasOwnProperty('get');
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
         * @param {String} name property name
         *
         * @return {Boolean} whether property is writable
         */
        me.isWritable = function (object, name) {
            assert.string(name, 'isWritable - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'isWritable - given object does not have own property "$name"', {
                $name: name
            });

            return Boolean(Object.getOwnPropertyDescriptor(object, name).writable);
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
         * @param {String} name property name
         *
         * @return {Boolean} whether property is configurable
         */
        var isConfigurable = me.isConfigurable = function (object, name) {
            assert.string(name, 'isConfigurable - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'isConfigurable - given object does not have own property "$name"', {
                $name: name
            });

            return Boolean(Object.getOwnPropertyDescriptor(object, name).configurable);
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
         * @param {String} name property name
         *
         * @return {Boolean} whether property is enumerable
         */
        me.isEnumerable = function (object, name) {
            assert.string(name, 'isEnumerable - given "$name" is not a string', {
                $name: name
            });

            assert.ok(object.hasOwnProperty(name), 'isEnumerable - given object does not have own property "$name"', {
                $name: name
            });

            return Boolean(Object.getOwnPropertyDescriptor(object, name).enumerable);
        };

        /**
         * Checks whether given descriptor is descriptor
         *
         * For example:
         *
         *     console.log(xs.Attribute.isDescriptor({enumerable: true, configurable: true})); //true
         *     console.log(xs.Attribute.isDescriptor({date: 1, number: 3})); //false
         *
         * @method isDescriptor
         *
         * @param {Object} descriptor verified descriptor
         *
         * @return {Boolean} whether descriptor given
         */
        var isDescriptor = me.isDescriptor = function (descriptor) {
            //false if descriptor is not object
            if (!xs.isObject(descriptor)) {

                return false;
            }

            //if any descriptor fields specified - it is descriptor
            return descriptor.hasOwnProperty('get') || descriptor.hasOwnProperty('set') || descriptor.hasOwnProperty('value') || descriptor.hasOwnProperty('writable') || descriptor.hasOwnProperty('configurable') || descriptor.hasOwnProperty('enumerable');
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
         *     //    x: 5 //properties, not relative to descriptor are not removed
         *     //}
         *     console.log(xs.Attribute.prepareDescriptor({
         *         get: 5,
         *         value: 1,
         *         x: 5
         *     }));
         *     //outputs:
         *     //{
         *     //    value: 1,
         *     //    x: 5 //properties, not relative to descriptor are not removed
         *     //}
         *     console.log(xs.Attribute.prepareDescriptor({
         *         get: function() {},
         *         value: 1,
         *         x: 5
         *     }));
         *     //outputs:
         *     //{
         *     //    get: function() {},
         *     //    x: 5 //properties, not relative to descriptor are not removed
         *     //}
         *
         * Important: Properties, that are not relative to property descriptor itself, are not removed from given descriptor
         *
         * @method prepareDescriptor
         *
         * @param {Object} descriptor incoming descriptor
         *
         * @return {Object} corrected descriptor copy
         */
        var prepareDescriptor = me.prepareDescriptor = function (descriptor) {
            assert.object(descriptor, 'prepareDescriptor - given "$descriptor" is not an object', {
                $descriptor: descriptor
            });

            //clone descriptor
            descriptor = xs.clone(descriptor);

            //non-function get|set are removed
            if (descriptor.hasOwnProperty('get') && !xs.isFunction(descriptor.get)) {
                delete descriptor.get;
            }
            if (descriptor.hasOwnProperty('set') && !xs.isFunction(descriptor.set)) {
                delete descriptor.set;
            }

            //get|set are preferred to value: value and writable are removed
            if (descriptor.get || descriptor.set) {
                delete descriptor.value;
                delete descriptor.writable;
            }

            //writable,enumerable,configurable - are converted if presented
            if (descriptor.hasOwnProperty('writable')) {
                descriptor.writable = Boolean(descriptor.writable);
            }
            if (descriptor.hasOwnProperty('configurable')) {
                descriptor.configurable = Boolean(descriptor.configurable);
            }
            if (descriptor.hasOwnProperty('enumerable')) {
                descriptor.enumerable = Boolean(descriptor.enumerable);
            }

            //any additional fields allowed
            return descriptor;
        };

        /**
         * Defines constant
         *
         * For example:
         *
         *     var x = {};
         *     console.log(xs.Attribute.constant(x, 'a', 5)); //true
         *     console.log(xs.Attribute.constant(x, 'a', 5)); //false
         *     console.log(xs.Attribute.isAssigned(x, 'a')); //true
         *     console.log(xs.Attribute.isAccessed(x, 'a')); //false
         *     console.log(xs.Attribute.isWritable(x, 'a')); //false
         *     console.log(xs.Attribute.isConfigurable(x, 'a')); //false
         *     console.log(xs.Attribute.isEnumerable(x, 'a')); //true
         *
         * @method constant
         *
         * @param {Object} object used object
         * @param {String} name constant name
         * @param {*} value constant value
         */
        me.constant = function (object, name, value) {
            assert.string(name, 'constant - given "$name" is not a string', {
                $name: name
            });

            //assert, that object has no constant "name", or it is defined, but is configurable
            assert.ok(!object.hasOwnProperty(name) || isConfigurable(object, name), 'constant "$name" is already defined', {
                $name: name
            });

            Object.defineProperty(object, name, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false
            });
        };

        /**
         * Contains methods to prepare and define properties
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @private
         *
         * @class xs.lang.Attribute.property
         *
         * @alternateClassName xs.property
         *
         * @singleton
         */
        me.property = (function () {
            var me = {};

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
             *     //    set: function(value) { this.private.x = value },
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *
             * @method prepare
             *
             * @param {String} name property name
             * @param {Object|*} descriptor raw property descriptor
             *
             * @return {Object} prepared descriptor
             */
            me.prepare = function (name, descriptor) {
                assert.string(name, 'property::prepare - given "$name" is not a string', {
                    $name: name
                });

                //if not descriptor - returns generated one
                if (!isDescriptor(descriptor)) {

                    return {
                        value: descriptor,
                        writable: true,
                        enumerable: true,
                        configurable: false
                    };
                }

                //prepares descriptor
                descriptor = prepareDescriptor(descriptor);

                //get|set priority
                if (descriptor.get || descriptor.set) {
                    if (!descriptor.get) {
                        eval('descriptor.get = function () { \'use strict\'; return this.private.' + name + ';};');
                    }
                    if (!descriptor.set) {
                        eval('descriptor.set = function (value) { \'use strict\'; this.private.' + name + ' = value;};');
                    }
                } else {
                    if (!descriptor.hasOwnProperty('value')) {
                        descriptor.value = undefined;
                    }
                    descriptor.writable = true;
                }
                descriptor.enumerable = true;
                descriptor.configurable = false;

                return descriptor;
            };

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
             * @param {String} name defined property name
             * @param {Object} descriptor defined property descriptor
             */
            me.define = function (object, name, descriptor) {
                assert.string(name, 'property::define - given "$name" is not a string', {
                    $name: name
                });

                assert.ok(isDescriptor(descriptor), 'property::define - given object is not a descriptor');

                //assert, that object has no property "name", or it is defined, but is configurable
                assert.ok(!object.hasOwnProperty(name) || isConfigurable(object, name), 'property::define - property "$name" is already defined', {
                    $name: name
                });

                //writable, enumerable and configurable are immutable defaults
                descriptor.enumerable = true;
                descriptor.configurable = false;

                if (!descriptor.get && !descriptor.set) {
                    descriptor.writable = true;
                }

                //define property and return
                Object.defineProperty(object, name, descriptor);
            };

            return me;
        })();

        /**
         * Contains methods to prepare and define methods
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @private
         *
         * @class xs.lang.Attribute.method
         *
         * @alternateClassName xs.method
         *
         * @singleton
         */
        me.method = (function () {
            var me = {};

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
             *     //    writable: function(value) { this.private.x = value },
             *     //    enumerable: true,
             *     //    configurable: false
             *     //}
             *
             * @method prepare
             *
             * @param {String} name raw descriptor
             * @param {*} descriptor raw descriptor
             *
             * @return {Object} prepared method descriptor
             */
            me.prepare = function (name, descriptor) {
                assert.string(name, 'method::prepare - given "$name" is not a string', {
                    $name: name
                });

                //assert, that descriptor is function, or is object with property "value", that is function
                assert.ok(xs.isFunction(descriptor) || (xs.isObject(descriptor) && xs.isFunction(descriptor.value)), 'method::prepare - Method "$name" descriptor "$descriptor" is incorrect', {
                    $name: name,
                    $descriptor: descriptor
                });

                //simple function
                if (xs.isFunction(descriptor)) {

                    return {
                        value: descriptor,
                        writable: false,
                        enumerable: true,
                        configurable: false
                    };

                }

                descriptor = xs.clone(descriptor);

                //complex object descriptor with function in descriptor.value
                descriptor.writable = false;
                descriptor.enumerable = true;
                descriptor.configurable = false;

                return descriptor;
            };

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
             * @param {Object} object used object
             * @param {String} name defined method name
             * @param {Object} descriptor defined method descriptor
             */
            me.define = function (object, name, descriptor) {
                assert.string(name, 'method::define - given "$name" is not a string', {
                    $name: name
                });

                assert.ok(isDescriptor(descriptor), 'method::define - given object is not a descriptor');

                assert.fn(descriptor.value, 'method::define - given "$value" is not a function', {
                    $value: descriptor.value
                });

                //assert, that object has no method "name", or it is defined, but is configurable
                assert.ok(!object.hasOwnProperty(name) || isConfigurable(object, name), 'method::define - method "$name" is already defined', {
                    $name: name
                });

                Object.defineProperty(object, name, {
                    value: descriptor.value,
                    writable: false,
                    enumerable: true,
                    configurable: false
                });
            };

            return me;
        })();

        return me;
    })();

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class AttributeError
     */
    function AttributeError(message) {
        this.message = 'xs.lang.Attribute::' + message;
    }

    AttributeError.prototype = new Error();

    xs.constant = attribute.constant;
    xs.property = attribute.property;
    xs.method = attribute.method;
})(window, 'xs');