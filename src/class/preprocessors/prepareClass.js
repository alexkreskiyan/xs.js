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
     * Preprocessor prepareClass
     * Implements basic class prepare operation
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareClass', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareClass[', Class.label, ']');


        //prepare imports

        //assert that imports are an array
        xs.assert.array(descriptor.imports, '[$Class]: given imports list "$imports" is not an array', {
            $Class: Class.label,
            $imports: descriptor.imports
        }, PrepareClassError);

        //convert to xs.core.Collection and save reference
        var imports = descriptor.imports = new xs.core.Collection(descriptor.imports);


        //prepare extends

        var extended = descriptor.extends;
        xs.log('xs.class.preprocessors.prepareClass[', Class.label, ']. Extended:', extended);

        //assert that either extended is not defined or is defined as non-empty string
        xs.assert.ok(!xs.isDefined(extended) || (xs.isString(extended) && extended), '[$Class]: given extended "$extended" is incorrect', {
            $Class: Class.label,
            $extended: extended
        }, PrepareClassError);

        //if extended is given - add it to imports
        if (extended) {
            descriptor.imports.add(extended);
        }


        //prepare mixins

        //assert that mixins are an object
        xs.assert.object(descriptor.mixins, '[$Class]: given mixins list "$mixins" is not an object', {
            $Class: Class.label,
            $mixins: descriptor.mixins
        }, PrepareClassError);

        //init mixins list with own values, converted to xs.core.Collection
        var mixins = descriptor.mixins = new xs.core.Collection(descriptor.mixins);

        //process mixins list
        xs.log('xs.class.preprocessors.prepareClass[', Class.label, ']. Mixins:', mixins.toSource());
        mixins.each(function (name, alias) {
            //verify mixed class name
            xs.assert.ok(name && xs.isString(name), '[$Class]: given mixed class name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, PrepareClassError);

            //verify mixed class alias
            xs.assert.ok(alias && xs.isString(name), '[$Class]: given empty mixed class alias', {
                $Class: Class.label
            }, PrepareClassError);

            imports.add(name);
        });


        //prepare implements

        //assert that implements are an array
        xs.assert.array(descriptor.implements, '[$Class]: given interfaces list "$implements" is not an array', {
            $Class: Class.label,
            $implements: descriptor.implements
        }, PrepareClassError);

        //init interfaces list with own values, converted to xs.core.Collection
        var interfaces = descriptor.implements = new xs.core.Collection(descriptor.implements);

        //process interfaces list
        xs.log('xs.class.preprocessors.prepareClass[', Class.label, ']. Interfaces:', interfaces.toSource());
        interfaces.each(function (name) {
            //verify implemented interface name
            xs.assert.ok(name && xs.isString(name), '[$Class]: given implemented interface name "$name" is incorrect', {
                $Class: Class.label,
                $name: name
            }, PrepareClassError);

            imports.add(name);
        });

    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareClassError
     */
    function PrepareClassError(message) {
        this.message = 'xs.class.preprocessors.prepareClass::' + message;
    }

    PrepareClassError.prototype = new Error();
})(window, 'xs');