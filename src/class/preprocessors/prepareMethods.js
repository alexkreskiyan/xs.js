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
     * Preprocessor prepareMethods
     * Is used to process class methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('prepareMethods', function () {

        return true;
    }, function ( Class, descriptor ) {

        //if methods are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.properties) ) {
            throw new MethodError('incorrect methods list');
        }

        //init methods reference
        var methods = Class.descriptor.methods;


        //inherited
        //get inherited methods from parent descriptor
        var inherited = Class.parent.descriptor.methods;

        //extend methods with inherited
        xs.extend(methods, inherited);


        //own
        //get own methods from raw descriptor
        var own = descriptor.methods;

        //verify and prepare them
        xs.each(own, function ( value, name, list ) {
            if ( !xs.isString(name) || !name ) {
                throw new MethodError('incorrect method name');
            }

            list[name] = xs.Attribute.method.prepare(name, value);
        });

        //extend methods with own ones
        xs.extend(methods, own);
    }, 'after', 'prepareProperties');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class MethodError
     */
    function MethodError ( message ) {
        this.message = 'xs.class.preprocessors.methods :: ' + message;
    }

    MethodError.prototype = new Error();
})(window, 'xs');