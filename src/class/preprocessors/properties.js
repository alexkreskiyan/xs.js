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
     * Preprocessor properties
     * Is used to process class properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('properties', function () {

        return true;
    }, function ( Class, descriptor ) {

        //init properties as empty hash
        var properties = {};


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //extend properties with inherited
        if ( xs.isObject(inherited) ) {
            xs.extend(properties, inherited);
        }


        //own
        var own = descriptor.properties;

        //get own properties from raw descriptor and apply
        if ( xs.isObject(own) ) {

            //prepare them
            xs.each(own, function ( value, name, list ) {
                list[name] = xs.Attribute.property.prepare(name, value);
            });

            //extend properties with own ones
            xs.extend(properties, own);
        }


        //apply
        //save properties to Class.descriptor
        Class.descriptor.properties = properties;

        //apply all accessed properties
        var prototype = Class.prototype;

        xs.each(properties, function ( descriptor, name ) {

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            if ( xs.hasKey(descriptor, 'value') ) {
                prototype[name] = undefined;
            }
        });
    });
})(window, 'xs');