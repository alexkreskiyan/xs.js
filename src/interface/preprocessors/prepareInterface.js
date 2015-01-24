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
     * Preprocessor prepareInterface
     * Implements basic interface prepare operation
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareInterface', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareInterface[', Interface.label, ']');


        //prepare imports

        //create new empty collection
        descriptor.imports = new xs.core.Collection();


        //prepare extends

        var extended = descriptor.extends;
        xs.log('xs.interface.preprocessors.prepareInterface[', Interface.label, ']. Extended:', extended);

        //assert that either extended is not defined or is defined as non-empty string
        xs.assert.ok(!xs.isDefined(extended) || (xs.isString(extended) && extended), '[$Interface]: given extended "$extended" is incorrect', {
            $Interface: Interface.label,
            $extended: extended
        }, PrepareInterfaceError);

        //if extended is given - add it to imports
        if (extended) {
            descriptor.imports.add(extended);
        }

    });

    /**
     * Internal error interface
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareInterfaceError
     */
    function PrepareInterfaceError(message) {
        this.message = 'xs.interface.preprocessors.prepareInterface::' + message;
    }

    PrepareInterfaceError.prototype = new Error();
})(window, 'xs');