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
     * Preprocessor prepareConstructor
     * Is used to process interface constructor
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareConstructor', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareConstructor[', Interface.label, ']');


        //inherited
        //get inherited constructor from parent descriptor
        var inherited = Interface.parent.descriptor.hasOwnProperty('constructor') ? Interface.parent.descriptor.constructor : undefined;


        //own
        //get own constructor from raw descriptor
        var own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is undefined or is function
        xs.assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function', PrepareConstructorError);


        //apply
        if (own) {
            Interface.descriptor.constructor = {
                args: xs.Function.getArguments(own)
            };
        } else if (inherited) {
            Interface.descriptor.constructor = inherited;
        }
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareConstructorError
     */
    function PrepareConstructorError(message) {
        this.message = 'xs.interface.preprocessors.prepareConstructor::' + message;
    }

    PrepareConstructorError.prototype = new Error();
})(window, 'xs');