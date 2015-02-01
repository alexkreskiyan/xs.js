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
     * Preprocessor defineElements
     * Is used to inherit parent elements to class descriptor
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('defineElements', function () {

        return true;
    }, function (Class) {

        xs.logToConsole('xs.class.preprocessors.defineElements[', Class.label, ']');

        //constants
        _processConstants(Class);

        //static properties
        _processStaticProperties(Class);

        //static methods
        _processStaticMethods(Class);

        //properties
        _processProperties(Class);

        //methods
        _processMethods(Class);
    });

    var _processConstants = function (Class) {
        Class.descriptor.constant.each(function (value, name) {

            xs.constant(Class, name, value);
        });
    };

    var _processStaticProperties = function (Class) {
        //create privates storage in class
        Class.private = {};

        //apply
        Class.descriptor.static.property.each(function (descriptor, name) {

            //save property to class
            xs.Attribute.property.define(Class, name, descriptor);
        });
    };

    var _processStaticMethods = function (Class) {
        Class.descriptor.static.method.each(function (descriptor, name) {

            //save method to class
            xs.Attribute.method.define(Class, name, descriptor);
        });
    };

    var _processProperties = function (Class) {
        var prototype = Class.prototype;

        Class.descriptor.property.each(function (descriptor, name) {

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            if (descriptor.hasOwnProperty('value')) {
                prototype[name] = undefined;
            }
        });
    };

    var _processMethods = function (Class) {
        Class.descriptor.method.each(function (value, name) {

            //save method to prototype
            xs.Attribute.method.define(Class.prototype, name, value);
        });
    };

})(window, 'xs');