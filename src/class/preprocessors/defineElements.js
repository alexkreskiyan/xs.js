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

        xs.log('xs.class.preprocessors.defineElements[', Class.label, ']');


        //constants
        Class.descriptor.constant.each(function (value, name) {

            xs.constant(Class, name, value);
        });


        //static properties
        //create privates storage in class
        Class.private = {};

        //apply
        Class.descriptor.static.property.each(function (descriptor, name) {

            //save property to class
            xs.Attribute.property.define(Class, name, descriptor);
        });


        //static methods
        Class.descriptor.static.method.each(function (descriptor, name) {

            //save method to class
            xs.Attribute.method.define(Class, name, descriptor);
        });


        //properties
        var prototype = Class.prototype;

        Class.descriptor.property.each(function (descriptor, name) {

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            if (descriptor.hasOwnProperty('value')) {
                prototype[name] = undefined;
            }
        });


        //methods
        Class.descriptor.method.each(function (value, name) {

            //save method to prototype
            xs.Attribute.method.define(Class.prototype, name, value);
        });
    });

})(window, 'xs');