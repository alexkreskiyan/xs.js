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
     * Preprocessor prepareStaticProperties
     * Is used to process class static properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareStaticProperties', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareStaticProperties[', Class.label, ']');

        //init properties reference
        var properties = Class.descriptor.static.properties;


        //inherited
        //get inherited static properties from parent descriptor
        var inherited = Class.parent.descriptor.static.properties;

        //add all inherited
        inherited.each(function (value, name) {
            properties.add(name, value);
        });


        //own
        //get own static properties from raw descriptor
        var own = descriptor.static.properties;

        //verify and prepare them
        own.each(function (value, name, list) {
            if (!xs.isString(name) || !name) {
                throw new StaticPropertyError('[' + Class.label + ']: incorrect static property name');
            }

            list.set(name, xs.Attribute.property.prepare(name, value));
        });

        //add all own
        own.each(function (value, name) {
            properties.hasKey(name) ? properties.set(name, value) : properties.add(name, value);
        });
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class StaticPropertyError
     */
    function StaticPropertyError(message) {
        this.message = 'xs.class.preprocessors.staticProperties::' + message;
    }

    StaticPropertyError.prototype = new Error();
})(window, 'xs');