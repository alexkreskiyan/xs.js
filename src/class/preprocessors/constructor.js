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
     * Preprocessor constructor
     * Is used to work with class constructor
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('constructor', function () {

        return true;
    }, function ( Class, descriptor ) {

        //inherited
        //get inherited constructor from parent descriptor
        var inherited = xs.hasKey(Class.parent.descriptor, 'constructor') ? Class.parent.descriptor.constructor : undefined;


        //own
        //get own methods from raw descriptor
        var own = xs.hasKey(descriptor, 'constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is function
        if ( xs.isDefined(own) && !xs.isFunction(own) ) {
            throw new ConstructorError('incorrect constructor');
        }

        //apply (comparison to Object guarantees, that constructor was really assigned)
        if ( own ) {
            Class.descriptor.constructor = own;
        } else if ( inherited ) {
            Class.descriptor.constructor = inherited;
        }

    }, 'after', 'defineStaticMethods');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ConstructorError
     */
    function ConstructorError ( message ) {
        this.message = 'xs.class.preprocessors.constructor :: ' + message;
    }

    ConstructorError.prototype = new Error();
})(window, 'xs');