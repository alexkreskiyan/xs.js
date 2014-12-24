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
     * Preprocessor defineConstants
     * Is used to process class constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('defineConstants', function () {

        return true;
    }, function (Class) {

        xs.log('xs.class.preprocessor.defineConstants[', Class.label, ']');
        //define constants
        Class.descriptor.constants.each(function (value, name) {

            xs.constant(Class, name, value);
        });
    });
})(window, 'xs');