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
     * Preprocessor prepareConstants
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('prepareConstants', function () {
        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessor.prepareConstants[', Class.label, ']');
        //if constants are specified not as object - throw respective error
        if (!xs.isObject(descriptor.constants)) {
            throw new ConstError('[' + Class.label + ']: incorrect constants list');
        }

        //init constants reference
        var constants = Class.descriptor.constants;


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.constants;

        //extend constants with inherited
        xs.extend(constants, inherited);


        //own
        //get own constants from raw descriptor and save to Class.descriptor
        var own = descriptor.constants;

        //verify own constants
        xs.each(own, function (value, name) {
            if (!xs.isString(name) || !name) {
                throw new ConstError('[' + Class.label + ']: incorrect constant name');
            }
        });

        //extend constants with own
        xs.extend(constants, own);
    }, 'after', 'extends');

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ConstError
     */
    function ConstError(message) {
        this.message = 'xs.class.preprocessors.constants :: ' + message;
    }

    ConstError.prototype = new Error();
})(window, 'xs');