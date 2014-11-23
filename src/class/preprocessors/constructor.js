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
     * Preprocessor constructor
     * Is used to work with class constructor
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('constructor', function () {

        return true;
    }, function (Class, descriptor) {

        //inherited
        //get inherited constructor from parent descriptor
        var inherited = Class.parent.descriptor.constructor;


        //own
        //get own methods from raw descriptor
        var own = descriptor.constructor;


        //apply (comparison to Object guarantees, that constructor was really assigned)
        if (own != Object) {
            Class.descriptor.constructor = own;
        } else if (inherited != Object) {
            Class.descriptor.constructor = inherited;
        }

    });
})(window, 'xs');