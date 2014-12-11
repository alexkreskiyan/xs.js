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
     * Preprocessor defineMethods
     * Is used to process class methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('defineMethods', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessor.defineMethods[', Class.label, ']');
        //apply
        xs.each(Class.descriptor.methods, function (value, name) {

            //save method to prototype
            xs.Attribute.method.define(Class.prototype, name, value);
        });
    }, 'after', 'defineProperties');
})(window, 'xs');