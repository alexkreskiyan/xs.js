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

    var log = new xs.log.Logger('xs.class.preprocessors.addOwnElements');

    var assert = new xs.core.Asserter(log, AddOwnElementsError);

    /**
     * Preprocessor addOwnElements
     * Is used to process class elements
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('addOwnElements', function () {

        return true;
    }, function (Class, descriptor) {

        log.trace(Class.label ? Class.label : 'undefined');

        //constants
        processConstants(Class, descriptor);

        //static properties
        processStaticProperties(Class, descriptor);

        //static methods
        processStaticMethods(Class, descriptor);

        //properties
        processProperties(Class, descriptor);

        //methods
        processMethods(Class, descriptor);
    });

    /**
     * Directive constant
     *
     * Is used to declare class constants. Class constants are declared as name:value pairs within constant directive.
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.constant.a = 'A';
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property constant
     */
    var processConstants = function (Class, descriptor) {
        //assert, that constants list is an object
        assert.object(descriptor.constant, '[$Class]: constants list `$constants` is not an object', {
            $Class: Class.label,
            $constants: descriptor.constant
        });

        //convert to xs.core.Collection
        descriptor.constant = new xs.core.Collection(descriptor.constant);

        //get reference to descriptor
        var own = Class.descriptor.constant;

        //add constants from raw descriptor
        descriptor.constant.each(function (value, name) {
            //assert that constant name is not empty
            assert.ok(name, '[$Class]: given constant name `$name` is incorrect', {
                $Class: Class.label,
                $name: name
            });

            //add/set constant in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    /**
     * Directive static.property
     *
     * Is used to declare class static properties. Class static properties are declared as name:value pairs within static.property directive.
     *
     * Properties are declared in propertyDescriptor compatible format. See {@link xs.lang.Attribute.property#prepare} for details
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.static.property.a = 'A';
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property staticProperty
     */
    var processStaticProperties = function (Class, descriptor) {

        //assert, that static properties list is an object
        assert.object(descriptor.static.property, '[$Class]: static properties list `$properties` is not an object', {
            $Class: Class.label,
            $properties: descriptor.static.property
        });

        //convert to xs.core.Collection
        descriptor.static.property = new xs.core.Collection(descriptor.static.property);

        //get reference to descriptor
        var own = Class.descriptor.static.property;

        //add static properties from raw descriptor
        descriptor.static.property.each(function (value, name) {
            //assert that static property name is not empty
            assert.ok(name, '[$Class]: given static property name `$name` is not a string', {
                $Class: Class.label,
                $name: name
            });

            //prepare property descriptor
            value = xs.property.prepare(name, value);

            //add/set static property in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    /**
     * Directive static.method
     *
     * Is used to declare class static methods. Class static methods are declared as name:value pairs within static.method directive.
     *
     * Methods are declared in propertyDescriptor compatible format. See {@link xs.lang.Attribute.method#prepare} for details
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.static.method.echo = function(message) {
     *             return message;
     *         };
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property staticMethod
     */
    var processStaticMethods = function (Class, descriptor) {

        //assert, that static methods list is an object
        assert.object(descriptor.static.method, '[$Class]: static methods list `$methods` is not an object', {
            $Class: Class.label,
            $methods: descriptor.static.method
        });

        //convert to xs.core.Collection
        descriptor.static.method = new xs.core.Collection(descriptor.static.method);

        //get reference to descriptor
        var own = Class.descriptor.static.method;

        //add static methods from raw descriptor
        descriptor.static.method.each(function (value, name) {
            //assert that static method name is not empty
            assert.ok(name, '[$Class]: given static method name `$name` is not a string', {
                $Class: Class.label,
                $name: name
            });

            //prepare method descriptor
            value = xs.method.prepare(name, value);

            //add/set static method in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    /**
     * Directive property
     *
     * Is used to declare class properties. Class properties are declared as name:value pairs within property directive.
     *
     * Properties are declared in propertyDescriptor compatible format. See {@link xs.lang.Attribute.property#prepare} for details.
     *
     * Note, that all value-based properties are applied as default to each new instance before {@link #constructor} is called
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.property.a = 'A';
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property property
     */
    var processProperties = function (Class, descriptor) {

        //assert, that properties list is an object
        assert.object(descriptor.property, '[$Class]: static properties list `$properties` is not an object', {
            $Class: Class.label,
            $properties: descriptor.property
        });

        //convert to xs.core.Collection
        descriptor.property = new xs.core.Collection(descriptor.property);

        //get reference to descriptor
        var own = Class.descriptor.property;

        //add properties from raw descriptor
        descriptor.property.each(function (value, name) {
            //assert that property name is not empty
            assert.ok(name, '[$Class]: given property name `$name` is not a string', {
                $Class: Class.label,
                $name: name
            });

            //prepare property descriptor
            value = xs.property.prepare(name, value);

            //add/set property in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    /**
     * Directive method
     *
     * Is used to declare class methods. Class methods are declared as name:value pairs within method directive.
     *
     * Methods are declared in propertyDescriptor compatible format. See {@link xs.lang.Attribute.method#prepare} for details
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.method.echo = function(message) {
     *             return message;
     *         };
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property method
     */
    var processMethods = function (Class, descriptor) {

        //assert, that methods list is an object
        assert.object(descriptor.method, '[$Class]: methods list `$methods` is not an object', {
            $Class: Class.label,
            $methods: descriptor.method
        });

        //init reference to methods list, converted to xs.core.Collection
        descriptor.method = new xs.core.Collection(descriptor.method);

        //get reference to descriptor
        var own = Class.descriptor.method;

        //add methods from raw descriptor
        descriptor.method.each(function (value, name) {
            //assert that method name is not empty
            assert.ok(name, '[$Class]: given method name `$name` is not a string', {
                $Class: Class.label,
                $name: name
            });

            //prepare method descriptor
            value = xs.method.prepare(name, value);

            //add/set method in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class AddOwnElementsError
     */
    function AddOwnElementsError(message) {
        this.message = 'xs.class.preprocessors.addOwnElements::' + message;
    }

    AddOwnElementsError.prototype = new Error();

})(window, 'xs');