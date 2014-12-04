/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

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
    xs.Class.preprocessors.add('defineProperties', function () {

        return true;
    }, function ( Class ) {

        //apply
        var prototype = Class.prototype;

        xs.each(Class.descriptor.properties, function ( descriptor, name ) {

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            xs.hasKey(descriptor, 'value') && (prototype[name] = undefined);
        });
    }, 'after', 'constructor');
})(window, 'xs');