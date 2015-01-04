/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

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
    xs.class.preprocessors.add('constructor', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.constructor[', Class.label, ']');
        //inherited
        //get inherited constructor from parent descriptor
        var inherited = Class.parent.descriptor.hasOwnProperty('constructor') ? Class.parent.descriptor.constructor : undefined;


        //own
        //get own methods from raw descriptor
        var own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is undefined or is function
        xs.assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function', ConstructorError);

        //apply (comparison to Object guarantees, that constructor was really assigned)
        if (own) {
            Class.descriptor.constructor = own;
        } else if (inherited) {
            Class.descriptor.constructor = inherited;
        }

    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ConstructorError
     */
    function ConstructorError(message) {
        this.message = 'xs.class.preprocessors.constructor::' + message;
    }

    ConstructorError.prototype = new Error();
})(window, 'xs');