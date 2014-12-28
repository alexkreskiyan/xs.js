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
     * Preprocessor defineProperties
     * Is used to process class properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('defineProperties', function () {

        return true;
    }, function (Class) {

        xs.log('xs.class.preprocessors.defineProperties[', Class.label, ']');
        //apply
        var prototype = Class.prototype;

        Class.descriptor.properties.each(function (descriptor, name) {

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            if (descriptor.hasOwnProperty('value')) {
                prototype[name] = undefined;
            }
        });
    });
})(window, 'xs');