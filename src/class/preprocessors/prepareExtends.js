/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

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
        //if extended is non-empty string - resolve parent name
        if (xs.isString(extended) && extended) {
            descriptor.imports.add(extended);

            //if no parent given - extend from xs.class.Base
        } else if (xs.isDefined(extended)) {

            //if extended is not string (empty string) - throw respective error
            throw new PrepareExtendsError('[' + Class.label + ']: incorrect extended name');
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
        this.message = 'xs.class.preprocessors.prepareExtends :: ' + message;
    }

    PrepareExtendsError.prototype = new Error();
})(window, 'xs');