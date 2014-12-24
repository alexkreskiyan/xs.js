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
     * Preprocessor prepareProperties
     * Is used to process class properties
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareProperties', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareProperties[', Class.label, ']');

        //init properties reference
        var properties = Class.descriptor.properties;


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //add all inherited
        inherited.each(function (value, name) {
            properties.add(name, value);
        });


        //own
        var own = descriptor.properties;

        //get own properties from raw descriptor and apply

        //verify and prepare them
        own.each(function (value, name, list) {
            if (!xs.isString(name) || !name) {
                throw new PropertyError('[' + Class.label + ']: incorrect property name');
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
     * @class PropertyError
     */
    function PropertyError(message) {
        this.message = 'xs.class.preprocessors.properties :: ' + message;
    }

    PropertyError.prototype = new Error();
})(window, 'xs');