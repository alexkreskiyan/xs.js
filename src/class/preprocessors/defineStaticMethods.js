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
     * Preprocessor defineStaticMethods
     * Is used to process class static methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('defineStaticMethods', function () {

        return true;
    }, function (Class) {

        //apply
        xs.each(Class.descriptor.static.methods, function (descriptor, name) {

            //save method to class
            xs.Attribute.method.define(Class, name, descriptor);
        });
    }, 'after', 'defineStaticProperties');
})(window, 'xs');