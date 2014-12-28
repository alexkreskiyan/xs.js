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
     * Preprocessor prepareImplements
     * Is used to prepare mixins and add them to imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareImplements', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareImplements[', Class.label, ']');

        //init
        //init interfaces list with own values
        var interfaces = Class.descriptor.implements = descriptor.implements;


        //process
        //get imports reference
        var imports = descriptor.imports;

        //process interfaces list
        xs.log('xs.class.preprocessors.prepareImplements[', Class.label, ']. Interfaces:', interfaces.toSource());
        interfaces.each(function (name) {
            //verify implemented interface name
            xs.assert.ok(name && xs.isString(name), PrepareImplementsError, '[$Class]: incorrect implemented interface name', {
                $Class: Class.label
            });

            imports.add(name);
        });
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareImplementsError
     */
    function PrepareImplementsError(message) {
        this.message = 'xs.class.preprocessors.prepareImplements::' + message;
    }

    PrepareImplementsError.prototype = new Error();
})(window, 'xs');