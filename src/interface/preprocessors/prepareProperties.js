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
     * Preprocessor prepareProperties
     * Is used to process interface properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareProperties', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareProperties[', Interface.label, ']');

        //init properties reference
        var properties = Interface.descriptor.properties;


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Interface.parent.descriptor.properties;

        //add all inherited
        inherited.each(function (value, name) {
            properties.add(name, value);
        });


        //own
        var own = descriptor.properties;

        //get own properties from raw descriptor and apply

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PreparePropertiesError);

            //save descriptor basics
            var property = xs.Attribute.property.prepare(name, value);

            //if is assigned
            if (property.hasOwnProperty('value')) {
                list.set(name, {
                    isAssigned: true
                });
            } else {
                list.set(name, {
                    isAccessed: true,
                    isReadonly: property.get === xs.emptyFn
                });
            }
        });

        //add all own
        own.each(function (value, name) {
            if (properties.hasKey(name)) {
                properties.set(name, value);
            } else {
                properties.add(name, value);
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
     * @class PreparePropertiesError
     */
    function PreparePropertiesError(message) {
        this.message = 'xs.interface.preprocessors.properties::' + message;
    }

    PreparePropertiesError.prototype = new Error();
})(window, 'xs');