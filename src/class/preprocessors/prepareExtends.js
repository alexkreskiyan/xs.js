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
     * Is used to get extended class name and add it to imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareExtends', function () {

        return true;
    }, function (Class, descriptor) {
        var extended = descriptor.extends;

        xs.log('xs.class.preprocessors.prepareExtends[', Class.label, ']. Extended:', extended);
        //assert that either extended is not defined or is defined as non-empty string
        xs.assert.ok(!xs.isDefined(extended) || (xs.isString(extended) && extended), '[$Class]: given extended "$extended" is incorrect', {
            $Class: Class.label,
            $extended: extended
        }, PrepareExtendsError);

        //if extended is given - add it to imports
        if (extended) {
            descriptor.imports.add(extended);
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
        this.message = 'xs.class.preprocessors.prepareExtends::' + message;
    }

    PrepareExtendsError.prototype = new Error();
})(window, 'xs');