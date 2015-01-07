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
     * Preprocessor prepareConstants
     * Is used to process interface constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareConstants', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareConstants[', Interface.label, ']');

        //init constants reference
        var constants = Interface.descriptor.constant;


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Interface.parent.descriptor.constant;

        //add all inherited
        inherited.each(function (name) {
            constants.add(name);
        });


        //own
        //get own constants from raw descriptor and save to Interface.descriptor
        var own = descriptor.constant;

        //verify own constants
        own.each(function (name) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given constant name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareConstantsError);
        });

        //add own ones if not yet
        own.each(function (name) {
            if (!constants.has(name)) {
                constants.add(name);
            }
        });
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareConstantsError
     */
    function PrepareConstantsError(message) {
        this.message = 'xs.interface.preprocessors.constant::' + message;
    }

    PrepareConstantsError.prototype = new Error();
})(window, 'xs');