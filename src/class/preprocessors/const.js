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
     * Preprocessor const
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('const', function () {
        return true;
    }, function ( Class, descriptor ) {

        //if constants are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.const) ) {
            throw new ConstError('incorrect constants list');
        }

        //init constants reference
        var constants = Class.descriptor.const;


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.const;

        //extend constants with inherited
        xs.extend(constants, inherited);


        //own
        //get own constants from raw descriptor and save to Class.descriptor
        var own = descriptor.const;

        //extend constants with own
        xs.extend(constants, own);


        //apply
        //apply all constants
        xs.each(constants, function ( value, name ) {
            if ( !xs.isString(name) || !name ) {
                throw new ConstError('incorrect constant name');
            }
            xs.const(Class, name, value);
        });
    }, 'after', 'singleton');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ConstError
     */
    function ConstError ( message ) {
        this.message = 'xs.class.preprocessors.const :: ' + message;
    }

    ConstError.prototype = new Error();
})(window, 'xs');