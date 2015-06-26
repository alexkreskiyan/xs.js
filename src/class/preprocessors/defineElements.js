'use strict';

/**
 * Preprocessor defineElements
 * Is used to inherit parent elements to class descriptor
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.class.preprocessors.add('defineElements', function () {

    return true;
}, function (Class) {

    //constants
    processConstants(Class);

    //static properties
    processStaticProperties(Class);

    //static methods
    processStaticMethods(Class);

    //properties
    processProperties(Class);

    //methods
    processMethods(Class);
});

function processConstants(Class) {
    //get xs.core.Generator reference
    var Generator = xs.core.Generator;

    Class.descriptor.constant.each(function (value, name) {

        xs.constant(Class, name, value instanceof Generator ? value.create() : value);
    });
}

function processStaticProperties(Class) {
    //get xs.core.Generator reference
    var Generator = xs.core.Generator;

    //apply
    Class.descriptor.static.property.each(function (descriptor, name) {

        //set value to a generated one
        if (descriptor.value instanceof Generator) {
            //use clone
            descriptor = xs.clone(descriptor);

            descriptor.value = descriptor.value.create();
        }

        //save property to class
        xs.property.define(Class, name, descriptor);
    });
}

function processStaticMethods(Class) {
    Class.descriptor.static.method.each(function (descriptor, name) {

        //save method to class
        xs.method.define(Class, name, descriptor);
    });
}

function processProperties(Class) {
    var prototype = Class.prototype;

    Class.descriptor.property.each(function (descriptor, name) {

        //save property to prototype
        xs.property.define(prototype, name, descriptor);

        //set undefined for assigned properties
        if (descriptor.hasOwnProperty('value')) {
            prototype[ name ] = undefined;
        }
    });
}

function processMethods(Class) {
    var prototype = Class.prototype;

    Class.descriptor.method.each(function (value, name) {

        //save method to prototype
        xs.method.define(prototype, name, value);
    });
}