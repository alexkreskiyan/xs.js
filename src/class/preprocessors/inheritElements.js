'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.inheritElements');

/**
 * Preprocessor inheritElements
 * Is used to inherit parent elements to class descriptor
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.class.preprocessors.add('inheritElements', function () {

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

    //init reference
    var own = Class.descriptor.constant;

    //add all inherited
    Class.parent.descriptor.constant.each(function (value, name) {
        own.add(name, value);
    });
}

function processStaticProperties(Class) {

    //init reference
    var own = Class.descriptor.static.property;

    //add all inherited
    Class.parent.descriptor.static.property.each(function (value, name) {
        own.add(name, value);
    });
}

function processStaticMethods(Class) {

    //init reference
    var own = Class.descriptor.static.method;

    //add all inherited
    Class.parent.descriptor.static.method.each(function (value, name) {
        own.add(name, value);
    });
}

function processProperties(Class) {

    //init reference
    var own = Class.descriptor.property;

    //add all inherited
    Class.parent.descriptor.property.each(function (value, name) {
        own.add(name, value);
    });
}

function processMethods(Class) {

    //init reference
    var own = Class.descriptor.method;

    //add all inherited
    Class.parent.descriptor.method.each(function (value, name) {
        own.add(name, value);
    });
}