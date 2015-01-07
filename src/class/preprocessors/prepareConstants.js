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
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareConstants', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareConstants[', Class.label, ']');

        //init constants reference
        var constants = Class.descriptor.constant;


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.constant;

        //add all inherited
        inherited.each(function (value, name) {
            constants.add(name, value);
        });


        //own
        //get own constants from raw descriptor and save to Class.descriptor
        var own = descriptor.constant;

        //verify own constants
        own.each(function (value, name) {
            xs.assert.ok(name && xs.isString(name), '[$Class]: given constant name "$name" is incorrect', {
                $Class: Class.label,
                $name: name
            }, PrepareConstantsError);
        });

        //add all own
        own.each(function (value, name) {
            if (constants.hasKey(name)) {
                constants.set(name, value);
            } else {
                constants.add(name, value);
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
        this.message = 'xs.class.preprocessors.prepareConstants::' + message;
    }

    PrepareConstantsError.prototype = new Error();
})(window, 'xs');