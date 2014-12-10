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
    xs.Class.preprocessors.add('prepareProperties', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessor.prepareProperties[', Class.label, ']');
        //if properties are specified not as object - throw respective error
        if (!xs.isObject(descriptor.properties)) {
            throw new PropertyError('[' + Class.label + ']: incorrect properties list');
        }

        //init properties reference
        var properties = Class.descriptor.properties;


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //extend properties with inherited
        xs.extend(properties, inherited);


        //own
        var own = descriptor.properties;

        //get own properties from raw descriptor and apply

        //verify and prepare them
        xs.each(own, function (value, name, list) {
            if (!xs.isString(name) || !name) {
                throw new PropertyError('[' + Class.label + ']: incorrect property name');
            }

            list[name] = xs.Attribute.property.prepare(name, value);
        });

        //extend properties with own ones
        xs.extend(properties, own);
    }, 'after', 'prepareStaticMethods');

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