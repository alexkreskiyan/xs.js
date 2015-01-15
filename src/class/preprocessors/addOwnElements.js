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

        var own;


        //constants

        //get reference to descriptor
        own = Class.descriptor.constant;
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


        //static properties

        //get reference to descriptor
        own = Class.descriptor.static.property;
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


        //static methods

        //get reference to descriptor
        own = Class.descriptor.static.method;
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


        //properties

        //get reference to descriptor
        own = Class.descriptor.property;
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


        //methods

        //get reference to descriptor
        own = Class.descriptor.method;
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
    });

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