'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.defineElements');

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

    log.trace(Class.label ? Class.label : 'undefined');

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
    Class.descriptor.constant.each(function (value, name) {

        xs.constant(Class, name, value);
    });
}

function processStaticProperties(Class) {
    //create privates storage in class
    Class.private = {};

    //apply
    Class.descriptor.static.property.each(function (descriptor, name) {

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
            prototype[name] = undefined;
        }
    });
}

function processMethods(Class) {
    Class.descriptor.method.each(function (value, name) {

        //save method to prototype
        xs.method.define(Class.prototype, name, value);
    });
}