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
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('staticProperties', function () {

        return true;
    }, function ( Class, descriptor ) {

        //if static properties are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.static) || !xs.isObject(descriptor.static.properties) ) {
            throw new StaticPropertyError('incorrect static properties list');
        }

        //create privates storage in class
        Class.privates = {};

        //init properties as empty hash
        var properties = {};


        //inherited
        //get inherited static properties from parent descriptor
        var inherited = Class.parent.descriptor.static.properties;

        //extend static properties with inherited
        xs.extend(properties, inherited);


        //own
        //get own static properties from raw descriptor
        var own = Class.own.static.properties = descriptor.static.properties;

        //prepare them
        xs.each(own, function ( value, name, list ) {
            list[name] = xs.Attribute.property.prepare(name, value);
        });

        //extend properties with own ones
        xs.extend(properties, own);


        //apply
        //save static properties to Class.descriptor
        Class.descriptor.static.properties = properties;

        //apply all properties
        xs.each(properties, function ( descriptor, name ) {
            if ( !xs.isString(name) || !name ) {
                throw new StaticPropertyError('incorrect static property name');
            }
            xs.Attribute.property.define(Class, name, descriptor);
        });
    }, 'after', 'const');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class StaticPropertyError
     */
    function StaticPropertyError ( message ) {
        this.message = 'xs.class.preprocessors.staticProperties :: ' + message;
    }

    StaticPropertyError.prototype = new Error();
})(window, 'xs');