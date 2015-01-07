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
     * Preprocessor defineStaticMethods
     * Is used to process class static methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('defineStaticMethods', function () {

        return true;
    }, function (Class) {

        xs.log('xs.class.preprocessors.defineStaticMethods[', Class.label, ']');
        //apply
        Class.descriptor.static.method.each(function (descriptor, name) {

            //save method to class
            xs.Attribute.method.define(Class, name, descriptor);
        });
    });
})(window, 'xs');