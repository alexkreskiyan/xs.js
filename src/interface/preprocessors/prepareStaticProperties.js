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
     * Preprocessor prepareStaticProperties
     * Is used to process interface static properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareStaticProperties', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareStaticProperties[', Interface.label, ']');

        //init properties reference
        var properties = Interface.descriptor.static.property;


        //inherited
        //get inherited static properties from parent descriptor
        var inherited = Interface.parent.descriptor.static.property;

        //add all inherited
        inherited.each(function (value, name) {
            properties.add(name, value);
        });


        //own
        //get own static properties from raw descriptor
        var own = descriptor.static.property;

        //verify and prepare them
        own.each(function (value, name, list) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given static property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareStaticPropertiesError);

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
                    isReadonly: property.set === xs.emptyFn
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
     * @class PrepareStaticPropertiesError
     */
    function PrepareStaticPropertiesError(message) {
        this.message = 'xs.interface.preprocessors.prepareStaticProperties::' + message;
    }

    PrepareStaticPropertiesError.prototype = new Error();
})(window, 'xs');