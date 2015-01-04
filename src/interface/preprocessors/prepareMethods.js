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
     * Preprocessor prepareMethods
     * Is used to process interface methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareMethods', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareMethods[', Interface.label, ']');

        //init methods reference
        var methods = Interface.descriptor.methods;


        //inherited
        //get inherited methods from parent descriptor
        var inherited = Interface.parent.descriptor.methods;

        //add all inherited
        inherited.each(function (value, name) {
            methods.add(name, value);
        });


        //own
        //get own methods from raw descriptor
        var own = descriptor.methods;

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareMethodsError);

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
     * @class PrepareMethodsError
     */
    function PrepareMethodsError(message) {
        this.message = 'xs.interface.preprocessors.methods::' + message;
    }

    PrepareMethodsError.prototype = new Error();
})(window, 'xs');