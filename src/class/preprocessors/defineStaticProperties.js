/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Preprocessor defineStaticProperties
     * Is used to process class static properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('defineStaticProperties', function () {

        return true;
    }, function (Class) {

        xs.log('xs.class.preprocessor.defineStaticProperties[', Class.label, ']');
        //create privates storage in class
        Class.privates = {};

        //apply
        xs.each(Class.descriptor.static.properties, function (descriptor, name) {

            //save property to class
            xs.Attribute.property.define(Class, name, descriptor);
        });
    });
})(window, 'xs');