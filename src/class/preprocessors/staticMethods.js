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
     * Preprocessor staticMethods
     * Is used to process class static methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('staticMethods', function () {

        return true;
    }, function ( Class, descriptor ) {

        //if static methods are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.static) || !xs.isObject(descriptor.static.methods) ) {
            throw new StaticMethodError('incorrect static methods list');
        }

        //init methods as empty hash
        var methods = {};


        //inherited
        //get inherited static methods from parent descriptor
        var inherited = Class.parent.descriptor.static.methods;

        //extend static methods with inherited
        xs.extend(methods, inherited);


        //own
        //get own static methods from raw descriptor
        var own = Class.own.static.methods = descriptor.static.methods;

        //prepare them
        xs.each(own, function ( value, name, list ) {
            list[name] = xs.Attribute.method.prepare(name, value);
        });

        //extend methods with own ones
        xs.extend(methods, own);


        //apply
        //save static methods to Class.descriptor
        Class.descriptor.static.methods = methods;

        //apply all methods
        xs.each(methods, function ( value, name ) {
            if ( !xs.isString(name) || !name ) {
                throw new StaticMethodError('incorrect static method name');
            }
            xs.Attribute.method.define(Class, name, value);
        });
    }, 'after', 'staticProperties');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class StaticMethodError
     */
    function StaticMethodError ( message ) {
        this.message = 'xs.class.preprocessors.staticMethods :: ' + message;
    }

    StaticMethodError.prototype = new Error();
})(window, 'xs');