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
     * Preprocessor const
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('const', function () {
        return true;
    }, function (Class, descriptor) {

        //init constants as empty hash
        var constants = {};


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.const;

        //extend constants with inherited
        xs.isObject(inherited) && xs.extend(constants, inherited);


        //own
        //get own constants from raw descriptor
        var own = descriptor.const;

        //extend constants with own
        xs.isObject(own) && xs.extend(constants, own);


        //apply
        //save constants to Class.descriptor
        Class.descriptor.const = constants;

        //apply all constants
        xs.each(constants, function (value, name) {
            xs.const(Class, name, value);
        });
    });
})(window, 'xs');