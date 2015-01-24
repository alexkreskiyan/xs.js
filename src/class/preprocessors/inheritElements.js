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

        xs.log('xs.class.preprocessors.inheritElements[', Class.label, ']');

        //constants
        _processConstants(Class);

        //static properties
        _processStaticProperties(Class);

        //static methods
        _processStaticMethods(Class);

        //properties
        _processProperties(Class);

        //methods
        _processMethods(Class);
    });

    var _processConstants = function (Class) {

        //init reference
        var own = Class.descriptor.constant;

        //add all inherited
        Class.parent.descriptor.constant.each(function (value, name) {
            own.add(name, value);
        });
    };

    var _processStaticProperties = function (Class) {

        //init reference
        var own = Class.descriptor.static.property;

        //add all inherited
        Class.parent.descriptor.static.property.each(function (value, name) {
            own.add(name, value);
        });
    };

    var _processStaticMethods = function (Class) {

        //init reference
        var own = Class.descriptor.static.method;

        //add all inherited
        Class.parent.descriptor.static.method.each(function (value, name) {
            own.add(name, value);
        });
    };

    var _processProperties = function (Class) {

        //init reference
        var own = Class.descriptor.property;

        //add all inherited
        Class.parent.descriptor.property.each(function (value, name) {
            own.add(name, value);
        });
    };

    var _processMethods = function (Class) {

        //init reference
        var own = Class.descriptor.method;

        //add all inherited
        Class.parent.descriptor.method.each(function (value, name) {
            own.add(name, value);
        });
    };

})(window, 'xs');