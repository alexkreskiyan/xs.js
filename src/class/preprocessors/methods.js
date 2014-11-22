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
     * Preprocessor methods
     * Is used to process class methods
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('methods', function () {

        return true;
    }, function (Class, descriptor) {

        //init methods as empty hash
        var methods = {};


        //inherited
        //get inherited methods from parent descriptor
        var inherited = Class.parent.descriptor.methods;

        //extend methods with inherited
        xs.isObject(inherited) && xs.extend(methods, inherited);


        //own
        //get own methods from raw descriptor
        var own = descriptor.methods;

        //apply if any
        if (xs.isObject(own)) {
            //prepare them
            xs.each(own, function (value, name, list) {
                list[name] = xs.Attribute.method.prepare(name, value);
            });

            //extend methods with own ones
            xs.extend(methods, own);
        }


        //apply
        //save methods to Class.descriptor
        Class.descriptor.methods = methods;

        //apply all methods
        xs.each(methods, function (value, name) {
            xs.Attribute.method.define(Class.prototype, name, value);
        });
    });
})(window, 'xs');