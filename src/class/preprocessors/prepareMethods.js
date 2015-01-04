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
     * Is used to process class methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareMethods', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareMethods[', Class.label, ']');

        //init methods reference
        var methods = Class.descriptor.methods;


        //inherited
        //get inherited methods from parent descriptor
        var inherited = Class.parent.descriptor.methods;

        //add all inherited
        inherited.each(function (value, name) {
            methods.add(name, value);
        });


        //own
        //get own methods from raw descriptor
        var own = descriptor.methods;

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), '[$Class]: given method name "$name" is incorrect', {
                $Class: Class.label,
                $name: name
            }, PrepareMethodsError);

            list.set(name, xs.Attribute.method.prepare(name, value));
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
        this.message = 'xs.class.preprocessors.methods::' + message;
    }

    PrepareMethodsError.prototype = new Error();
})(window, 'xs');