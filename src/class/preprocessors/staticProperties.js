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
     * Preprocessor staticProperties
     * Is used to process class static properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('staticProperties', function () {

        return true;
    }, function ( Class, descriptor ) {

        //create privates storage in class
        Class.privates = {};

        //init properties as empty hash
        var properties = {};


        //inherited
        //get inherited static properties from parent descriptor
        var inherited = xs.isObject(Class.parent.descriptor.static) ? Class.parent.descriptor.static.properties : undefined;

        //extend static properties with inherited
        xs.isObject(inherited) && xs.extend(properties, inherited);


        //own
        //get own static properties from raw descriptor
        var own = xs.isObject(descriptor.static) ? descriptor.static.properties : undefined;

        //apply if any
        if ( xs.isObject(own) ) {
            //prepare them
            xs.each(own, function ( value, name, list ) {
                list[name] = xs.Attribute.property.prepare(name, value);
            });

            //extend properties with own ones
            xs.extend(properties, own);
        }


        //apply
        //save static properties to Class.descriptor
        xs.isObject(Class.descriptor.static) || (Class.descriptor.static = {});
        Class.descriptor.static.properties = properties;

        //apply all properties
        xs.each(properties, function ( descriptor, name ) {
            xs.Attribute.property.define(Class, name, descriptor);
        });
    });
})(window, 'xs');