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
     * Preprocessor addOwnElements
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('addOwnElements', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.addOwnElements[', Class.label, ']');

        //constants
        _processConstants(Class, descriptor);

        //static properties
        _processStaticProperties(Class, descriptor);

        //static methods
        _processStaticMethods(Class, descriptor);

        //properties
        _processProperties(Class, descriptor);

        //methods
        _processMethods(Class, descriptor);
    });

    var _processConstants = function (Class, descriptor) {
        //assert, that constants list is an object
        xs.assert.object(descriptor.constant, '[$Class]: constants list "$constants" is not an object', {
            $Class: Class.label,
            $constants: descriptor.constant
        }, AddOwnElementsError);

        //convert to xs.core.Collection
        descriptor.constant = new xs.core.Collection(descriptor.constant);

        //get reference to descriptor
        var own = Class.descriptor.constant;

        //add constants from raw descriptor
        descriptor.constant.each(function (value, name) {
            //assert that constant name is not empty
            xs.assert.ok(name, '[$Class]: given constant name "$name" is incorrect', {
                $Class: Class.label,
                $name: name
            }, AddOwnElementsError);

            //add/set constant in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    var _processStaticProperties = function (Class, descriptor) {

        //assert, that static properties list is an object
        xs.assert.object(descriptor.static.property, '[$Class]: static properties list "$properties" is not an object', {
            $Class: Class.label,
            $properties: descriptor.static.property
        }, AddOwnElementsError);

        //convert to xs.core.Collection
        descriptor.static.property = new xs.core.Collection(descriptor.static.property);

        //get reference to descriptor
        var own = Class.descriptor.static.property;

        //add static properties from raw descriptor
        descriptor.static.property.each(function (value, name) {
            //assert that static property name is not empty
            xs.assert.ok(name, '[$Class]: given static property name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, AddOwnElementsError);

            //prepare property descriptor
            value = xs.Attribute.property.prepare(name, value);

            //add/set static property in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    var _processStaticMethods = function (Class, descriptor) {

        //assert, that static methods list is an object
        xs.assert.object(descriptor.static.method, '[$Class]: static methods list "$methods" is not an object', {
            $Class: Class.label,
            $methods: descriptor.static.method
        }, AddOwnElementsError);

        //convert to xs.core.Collection
        descriptor.static.method = new xs.core.Collection(descriptor.static.method);

        //get reference to descriptor
        var own = Class.descriptor.static.method;

        //add static methods from raw descriptor
        descriptor.static.method.each(function (value, name) {
            //assert that static method name is not empty
            xs.assert.ok(name, '[$Class]: given static method name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, AddOwnElementsError);

            //prepare property descriptor
            value = xs.Attribute.method.prepare(name, value);

            //add/set static method in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    var _processProperties = function (Class, descriptor) {

        //assert, that properties list is an object
        xs.assert.object(descriptor.property, '[$Class]: static properties list "$properties" is not an object', {
            $Class: Class.label,
            $properties: descriptor.property
        }, AddOwnElementsError);

        //convert to xs.core.Collection
        descriptor.property = new xs.core.Collection(descriptor.property);

        //get reference to descriptor
        var own = Class.descriptor.property;

        //add properties from raw descriptor
        descriptor.property.each(function (value, name) {
            //assert that property name is not empty
            xs.assert.ok(name, '[$Class]: given property name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, AddOwnElementsError);

            //prepare property descriptor
            value = xs.Attribute.property.prepare(name, value);

            //add/set property in class descriptor
            if (own.hasKey(name)) {
                own.set(name, value);
            } else {
                own.add(name, value);
            }
        });
    };

    var _processMethods = function (Class, descriptor) {

        //assert, that methods list is an object
        xs.assert.object(descriptor.method, '[$Class]: methods list "$methods" is not an object', {
            $Class: Class.label,
            $methods: descriptor.method
        }, AddOwnElementsError);

        //init reference to methods list, converted to xs.core.Collection
        descriptor.method = new xs.core.Collection(descriptor.method);

        //get reference to descriptor
        var own = Class.descriptor.method;

        //add methods from raw descriptor
        descriptor.method.each(function (value, name) {
            //assert that method name is not empty
            xs.assert.ok(name, '[$Class]: given method name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, AddOwnElementsError);

            //prepare property descriptor
            value = xs.Attribute.method.prepare(name, value);

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