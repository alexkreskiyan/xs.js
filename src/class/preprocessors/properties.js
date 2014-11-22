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
     * Preprocessor properties
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('properties', function () {

        return true;
    }, function (Class, descriptor) {

        //init properties as empty hash
        var properties = {
            accessed: {},
            assigned: {}
        };


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //extend properties with inherited
        if (xs.isObject(inherited)) {
            xs.extend(properties.accessed, inherited.accessed);
            xs.extend(properties.assigned, inherited.assigned);
        }


        //own
        //get own properties from raw descriptor and apply
        if (xs.isObject(descriptor.properties)) {
            var own = {
                accessed: {},
                assigned: {}
            };

            //prepare them
            xs.each(descriptor.properties, function (value, name) {
                var descriptor = xs.Attribute.property.prepare(name, value);

                //save depending on property type
                if (descriptor.get) {
                    own.accessed[name] = descriptor;
                } else {
                    own.assigned[name] = descriptor;
                }
            });

            //extend properties with own ones
            xs.extend(properties, own);
        }


        //apply
        //save properties to Class.descriptor
        Class.descriptor.properties = properties;

        //apply all accessed properties
        xs.each(properties.accessed, function (value, name) {
            xs.Attribute.property.define(Class.prototype, name, value);
        });
    });
})(window, 'xs');