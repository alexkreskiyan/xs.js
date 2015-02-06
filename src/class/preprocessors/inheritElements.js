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

    var logger = new xs.log.Logger('xs.class.preprocessors.inheritElements');

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

        logger.trace(Class.label ? Class.label : 'undefined');

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

    var processConstants = function (Class) {

        //init reference
        var own = Class.descriptor.constant;

        //add all inherited
        Class.parent.descriptor.constant.each(function (value, name) {
            own.add(name, value);
        });
    };

    var processStaticProperties = function (Class) {

        //init reference
        var own = Class.descriptor.static.property;

        //add all inherited
        Class.parent.descriptor.static.property.each(function (value, name) {
            own.add(name, value);
        });
    };

    var processStaticMethods = function (Class) {

        //init reference
        var own = Class.descriptor.static.method;

        //add all inherited
        Class.parent.descriptor.static.method.each(function (value, name) {
            own.add(name, value);
        });
    };

    var processProperties = function (Class) {

        //init reference
        var own = Class.descriptor.property;

        //add all inherited
        Class.parent.descriptor.property.each(function (value, name) {
            own.add(name, value);
        });
    };

    var processMethods = function (Class) {

        //init reference
        var own = Class.descriptor.method;

        //add all inherited
        Class.parent.descriptor.method.each(function (value, name) {
            own.add(name, value);
        });
    };

})(window, 'xs');