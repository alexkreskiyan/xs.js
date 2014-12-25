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
        var constants = Interface.descriptor.constants;


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Interface.parent.descriptor.constants;

        //add all inherited
        inherited.each(function (name) {
            constants.add(name);
        });


        //own
        //get own constants from raw descriptor and save to Interface.descriptor
        var own = descriptor.constants;

        //verify own constants
        own.each(function (name) {
            if (!xs.isString(name) || !name) {
                throw new ConstError('[' + Interface.label + ']: incorrect constant name');
            }
        });

        //add own ones if not yet
        own.each(function (name) {
            constants.has(name) || constants.add(name);
        });
    });

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
        this.message = 'xs.interface.preprocessors.constants::' + message;
    }

    ConstError.prototype = new Error();
})(window, 'xs');