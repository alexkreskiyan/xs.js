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
     * Preprocessor prepareStaticMethods
     * Is used to process interface static methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareStaticMethods', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareStaticMethods[', Interface.label, ']');

        //init methods reference
        var methods = Interface.descriptor.static.method;


        //inherited
        //get inherited static methods from parent descriptor
        var inherited = Interface.parent.descriptor.static.method;

        //add all inherited
        inherited.each(function (value, name) {
            methods.add(name, value);
        });


        //own
        //get own static methods from raw descriptor
        var own = descriptor.static.method;

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given static method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareStaticMethodsError);

            //save descriptor basics
            var method = xs.Attribute.method.prepare(name, value);
            list.set(name, {
                args: xs.Function.getArguments(method.value)
            });
        });

        //add all own
        own.each(function (value, name) {
            if (methods.hasKey(name)) {
                methods.set(name, value);
            } else {
                methods.add(name, value);
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
     * @class PrepareStaticMethodsError
     */
    function PrepareStaticMethodsError(message) {
        this.message = 'xs.interface.preprocessors.prepareStaticMethods::' + message;
    }

    PrepareStaticMethodsError.prototype = new Error();
})(window, 'xs');