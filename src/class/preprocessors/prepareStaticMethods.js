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
     * Preprocessor prepareStaticMethods
     * Is used to process class static methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareStaticMethods', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareStaticMethods[', Class.label, ']');

        //init methods reference
        var methods = Class.descriptor.static.methods;


        //inherited
        //get inherited static methods from parent descriptor
        var inherited = Class.parent.descriptor.static.methods;

        //add all inherited
        inherited.each(function (value, name) {
            methods.add(name, value);
        });


        //own
        //get own static methods from raw descriptor
        var own = descriptor.static.methods;

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), PrepareStaticMethodsError, '[$Class]: incorrect static method name', {
                $Class: Class.label
            });

            list.set(name, xs.Attribute.method.prepare(name, value));
        });

        //add all own
        own.each(function (value, name) {
            methods.hasKey(name) ? methods.set(name, value) : methods.add(name, value);
        });
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareStaticMethodsError
     */
    function PrepareStaticMethodsError(message) {
        this.message = 'xs.class.preprocessors.staticMethods::' + message;
    }

    PrepareStaticMethodsError.prototype = new Error();
})(window, 'xs');