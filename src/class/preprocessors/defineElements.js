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

    var log = new xs.log.Logger('xs.class.preprocessors.defineElements');

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

        log.trace(Class.label ? Class.label : 'undefined');

        //constants
        processConstants(Class);

        //static properties
        processStaticProperties(Class);

        //static methods
        processStaticMethods(Class);

        //properties
        processProperties(Class);

        //methods
        processMethods(Class);
    });

    var processConstants = function (Class) {
        Class.descriptor.constant.each(function (value, name) {

            xs.constant(Class, name, value);
        });
    };

    var processStaticProperties = function (Class) {
        //create privates storage in class
        Class.private = {};

        //apply
        Class.descriptor.static.property.each(function (descriptor, name) {

            //save property to class
            xs.Attribute.property.define(Class, name, descriptor);
        });
    };

    var processStaticMethods = function (Class) {
        Class.descriptor.static.method.each(function (descriptor, name) {

            //save method to class
            xs.Attribute.method.define(Class, name, descriptor);
        });
    };

    var processProperties = function (Class) {
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

    var processMethods = function (Class) {
        Class.descriptor.method.each(function (value, name) {

            //save method to prototype
            xs.Attribute.method.define(Class.prototype, name, value);
        });
    };

})(window, 'xs');