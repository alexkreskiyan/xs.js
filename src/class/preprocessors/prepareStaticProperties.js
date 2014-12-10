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
    xs.Class.preprocessors.add('prepareStaticProperties', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessor.prepareStaticProperties[', Class.label, ']');
        //if static properties are specified not as object - throw respective error
        if (!xs.isObject(descriptor.static) || !xs.isObject(descriptor.static.properties)) {
            throw new StaticPropertyError('[' + Class.label + ']: incorrect static properties list');
        }

        //init properties reference
        var properties = Class.descriptor.static.properties;


        //inherited
        //get inherited static properties from parent descriptor
        var inherited = Class.parent.descriptor.static.properties;

        //extend static properties with inherited
        xs.extend(properties, inherited);


        //own
        //get own static properties from raw descriptor
        var own = descriptor.static.properties;

        //verify and prepare them
        xs.each(own, function (value, name, list) {
            if (!xs.isString(name) || !name) {
                throw new StaticPropertyError('[' + Class.label + ']: incorrect static property name');
            }

            list[name] = xs.Attribute.property.prepare(name, value);
        });

        //extend properties with own ones
        xs.extend(properties, own);
    }, 'after', 'prepareConstants');

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
        this.message = 'xs.class.preprocessors.staticProperties :: ' + message;
    }

    StaticPropertyError.prototype = new Error();
})(window, 'xs');