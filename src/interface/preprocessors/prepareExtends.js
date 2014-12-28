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
     * Preprocessor prepareExtends
     * Is used to get extended interface name and add it to imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareExtends', function () {

        return true;
    }, function (Interface, descriptor) {
        var extended = descriptor.extends;

        //reset imports collection
        descriptor.imports.remove();

        xs.log('xs.interface.preprocessors.prepareExtends[', Interface.label, ']. Extended:', extended);
        //if extended is non-empty string - resolve parent name
        if (xs.isString(extended) && extended) {
            descriptor.imports.add(extended);

            //if no parent given - extend from xs.interface.Base
        } else if (xs.isDefined(extended)) {

            //if extended is not string (empty string) - throw respective error
            throw new PrepareExtendsError('[' + Interface.label + ']: incorrect extended name');
        }
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareExtendsError
     */
    function PrepareExtendsError(message) {
        this.message = 'xs.interface.preprocessors.prepareExtends::' + message;
    }

    PrepareExtendsError.prototype = new Error();
})(window, 'xs');