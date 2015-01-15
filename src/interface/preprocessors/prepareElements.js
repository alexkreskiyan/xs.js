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
     * Preprocessor prepareConstants
     * Is used to process interface constants
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('prepareConstants', function () {

        return true;
    }, function (Interface, descriptor) {

        xs.log('xs.interface.preprocessors.prepareConstants[', Interface.label, ']');
        var own;


        //constants
        own = Interface.descriptor.constant;

        //add all inherited
        Interface.parent.descriptor.constant.each(function (name) {
            own.add(name);
        });

        //add own constants from raw descriptor and save to Interface.descriptor
        descriptor.constant.each(function (name) {
            xs.assert.ok(name && xs.isString(name), '[$Interface]: given constant name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            if (!own.has(name)) {
                own.add(name);
            }
        });


        //static properties
        own = Interface.descriptor.static.property;

        //add all inherited
        Interface.parent.descriptor.static.property.each(function (value, name) {
            own.add(name, value);
        });

        //add own static properties from raw descriptor
        descriptor.static.property.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given static property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var property = xs.Attribute.property.prepare(name, value);

            var scheme;
            //if is assigned
            if (property.hasOwnProperty('value')) {
                scheme = {
                    isAssigned: true
                };
            } else {
                scheme = {
                    isAccessed: true,
                    isReadonly: property.set === xs.emptyFn
                };
            }

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });


        //static methods
        own = Interface.descriptor.static.method;

        //add all inherited
        Interface.parent.descriptor.static.method.each(function (value, name) {
            own.add(name, value);
        });

        //add own static methods from raw descriptor
        descriptor.static.method.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given static method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var method = xs.Attribute.property.prepare(name, value);

            var scheme = {
                args: xs.Function.getArguments(method.value)
            };

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });


        //constructor
        var inherited = Interface.parent.descriptor.hasOwnProperty('constructor') ? Interface.parent.descriptor.constructor : undefined;

        //get own constructor from raw descriptor
        own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

        //verify, that own constructor is undefined or is function
        xs.assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function', PrepareElementsError);

        //apply
        if (own) {
            Interface.descriptor.constructor = {
                args: xs.Function.getArguments(own)
            };
        } else if (inherited) {
            Interface.descriptor.constructor = inherited;
        }


        //properties
        own = Interface.descriptor.property;

        //add all inherited
        Interface.parent.descriptor.property.each(function (value, name) {
            own.add(name, value);
        });


        //add own properties from raw descriptor
        descriptor.property.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given property name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var property = xs.Attribute.property.prepare(name, value);

            var scheme;
            //if is assigned
            if (property.hasOwnProperty('value')) {
                scheme = {
                    isAssigned: true
                };
            } else {
                scheme = {
                    isAccessed: true,
                    isReadonly: property.set === xs.emptyFn
                };
            }

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
            }
        });


        //methods
        own = Interface.descriptor.method;

        //add all inherited
        Interface.parent.descriptor.method.each(function (value, name) {
            own.add(name, value);
        });


        //add own methods from raw descriptor
        descriptor.method.each(function (value, name) {
            xs.assert.ok(name, '[$Interface]: given method name "$name" is incorrect', {
                $Interface: Interface.label,
                $name: name
            }, PrepareElementsError);

            //save descriptor basics
            var method = xs.Attribute.property.prepare(name, value);

            var scheme = {
                args: xs.Function.getArguments(method.value)
            };

            if (own.hasKey(name)) {
                own.set(name, scheme);
            } else {
                own.add(name, scheme);
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
     * @class PrepareElementsError
     */
    function PrepareElementsError(message) {
        this.message = 'xs.interface.preprocessors.prepareConstants::' + message;
    }

    PrepareElementsError.prototype = new Error();
})(window, 'xs');