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
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('properties', function () {

        return true;
    }, function ( Class, descriptor ) {

        //if properties are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.properties) ) {
            throw new PropertyError('incorrect properties list');
        }

        //init properties as empty hash
        var properties = {};


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //extend properties with inherited
        xs.extend(properties, inherited);


        //own
        var own = Class.own.properties = descriptor.properties;

        //get own properties from raw descriptor and apply

        //prepare them
        xs.each(own, function ( value, name, list ) {
            list[name] = xs.Attribute.property.prepare(name, value);
        });

        //extend properties with own ones
        xs.extend(properties, own);


        //apply
        //save properties to Class.descriptor
        Class.descriptor.properties = properties;

        //apply all accessed properties
        var prototype = Class.prototype;

        xs.each(properties, function ( descriptor, name ) {
            if ( !xs.isString(name) || !name ) {
                throw new PropertyError('incorrect property name');
            }

            //save property to prototype
            xs.Attribute.property.define(prototype, name, descriptor);

            //set undefined for assigned properties
            xs.hasKey(descriptor, 'value') && (prototype[name] = undefined);
        });
    }, 'after', 'constructor');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PropertyError
     */
    function PropertyError ( message ) {
        this.message = 'xs.class.preprocessors.properties :: ' + message;
    }

    PropertyError.prototype = new Error();
})(window, 'xs');