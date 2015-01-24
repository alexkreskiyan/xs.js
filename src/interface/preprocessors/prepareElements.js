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

    /**
     * Preprocessor prepareConstants
     * Is used to process interface constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareConstants', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareConstants[', Interface.label, ']');

        //constants
        _processConstants(Interface, descriptor);

        //static properties
        _processStaticProperties(Interface, descriptor);

        //static methods
        _processStaticMethods(Interface, descriptor);

        //constructor
        _processConstructor(Interface, descriptor);

        //properties
        _processProperties(Interface, descriptor);

        //methods
        _processMethods(Interface, descriptor);
    });

    var _processConstants = function (Interface, descriptor) {

        //assert, that constants list is an object
        xs.assert.array(descriptor.constant, '[$Interface]: constants list "$constants" is not an array', {
            $Interface: Interface.label,
            $constants: descriptor.constant
        }, PrepareElementsError);

        //convert to xs.core.Collection
        descriptor.constant = new xs.core.Collection(descriptor.constant);

        //get reference to descriptor
        var own = Interface.descriptor.constant;

        //add all inherited
        Interface.parent.descriptor.constant.each(function (name) {
            own.add(name);
        });

        //add own constants from raw descriptor and save to Interface.descriptor
        descriptor.constant.each(function (name) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given constant name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            if (!own.has(name)) {
                own.add(name);
            }
        });

    };

    var _processStaticProperties = function (Interface, descriptor) {

        //assert, that static properties list is an object
        xs.assert.object(descriptor.static.property, '[$Interface]: static properties list "$properties" is not an object', {
            $Interface: Interface.label,
            $properties: descriptor.static.property
        }, PrepareElementsError);

        //convert to xs.core.Collection
        descriptor.static.property = new xs.core.Collection(descriptor.static.property);

        //get reference to descriptor
        var own = Interface.descriptor.static.property;

        //add all inherited
        Interface.parent.descriptor.static.property.each(function (value, name) {
            own.add(name, value);
        });

        //add own static properties from raw descriptor
        descriptor.static.property.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given static property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var property = xs.Attribute.property.prepare(name, value);

            var scheme;
            //if is assigned
            if (property.hasOwnProperty('value')) {
                scheme = {
                    isAssigned: true
                };
            } else {
                scheme = {
                    isAccessed: true,
                    isReadonly: property.set === xs.emptyFn
                };
            }

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });
    };

    var _processStaticMethods = function (Interface, descriptor) {

        //assert, that static methods list is an object
        xs.assert.object(descriptor.static.method, '[$Interface]: static methods list "$methods" is not an object', {
            $Interface: Interface.label,
            $methods: descriptor.static.method
        }, PrepareElementsError);

        //convert to xs.core.Collection
        descriptor.static.method = new xs.core.Collection(descriptor.static.method);

        //get reference to descriptor
        var own = Interface.descriptor.static.method;

        //add all inherited
        Interface.parent.descriptor.static.method.each(function (value, name) {
            own.add(name, value);
        });

        //add own static methods from raw descriptor
        descriptor.static.method.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given static method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var method = xs.Attribute.property.prepare(name, value);

            var scheme = {
                args: xs.Function.getArguments(method.value)
            };

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });

    };

    var _processConstructor = function (Interface, descriptor) {
        var inherited = Interface.parent.descriptor.hasOwnProperty('constructor') ? Interface.parent.descriptor.constructor : undefined;

        //get own constructor from raw descriptor
        var own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is undefined or is function
        xs.assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function', PrepareElementsError);

        //apply
        if (own) {
            Interface.descriptor.constructor = {
                args: xs.Function.getArguments(own)
            };
        } else if (inherited) {
            Interface.descriptor.constructor = inherited;
        }
    };

    var _processProperties = function (Interface, descriptor) {

        //assert, that properties list is an object
        xs.assert.object(descriptor.property, '[$Interface]: static properties list "$properties" is not an object', {
            $Interface: Interface.label,
            $properties: descriptor.property
        }, PrepareElementsError);

        //convert to xs.core.Collection
        descriptor.property = new xs.core.Collection(descriptor.property);

        //get reference to descriptor
        var own = Interface.descriptor.property;

        //add all inherited
        Interface.parent.descriptor.property.each(function (value, name) {
            own.add(name, value);
        });


        //add own properties from raw descriptor
        descriptor.property.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var property = xs.Attribute.property.prepare(name, value);

            var scheme;
            //if is assigned
            if (property.hasOwnProperty('value')) {
                scheme = {
                    isAssigned: true
                };
            } else {
                scheme = {
                    isAccessed: true,
                    isReadonly: property.set === xs.emptyFn
                };
            }

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });
    };

    var _processMethods = function (Interface, descriptor) {

        //assert, that methods list is an object
        xs.assert.object(descriptor.method, '[$Interface]: methods list "$methods" is not an object', {
            $Interface: Interface.label,
            $methods: descriptor.method
        }, PrepareElementsError);

        //init reference to methods list, converted to xs.core.Collection
        descriptor.method = new xs.core.Collection(descriptor.method);

        //get reference to descriptor
        var own = Interface.descriptor.method;

        //add all inherited
        Interface.parent.descriptor.method.each(function (value, name) {
            own.add(name, value);
        });


        //add own methods from raw descriptor
        descriptor.method.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var method = xs.Attribute.property.prepare(name, value);

            var scheme = {
                args: xs.Function.getArguments(method.value)
            };

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
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
     * @class PrepareElementsError
     */
    function PrepareElementsError(message) {
        this.message = 'xs.interface.preprocessors.prepareConstants::' + message;
    }

    PrepareElementsError.prototype = new Error();
})(window, 'xs');