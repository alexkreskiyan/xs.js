'use strict';

var log = new xs.log.Logger('xs.interface.preprocessors.prepareElements');

var assert = new xs.core.Asserter(log, PrepareElementsError);

/**
 * Preprocessor prepareElements
 * Is used to process interface elements
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.interface.preprocessors.add('prepareElements', function () {

    return true;
}, function (Interface, descriptor) {

    log.trace(Interface.label);

    //constants
    processConstants(Interface, descriptor);

    //static properties
    processStaticProperties(Interface, descriptor);

    //static methods
    processStaticMethods(Interface, descriptor);

    //constructor
    processConstructor(Interface, descriptor);

    //properties
    processProperties(Interface, descriptor);

    //methods
    processMethods(Interface, descriptor);
});

function processConstants(Interface, descriptor) {

    //assert, that constants list is an array
    assert.array(descriptor.constant, '[$Interface]: constants list `$constants` is not an array', {
        $Interface: Interface.label,
        $constants: descriptor.constant
    });

    //convert to xs.core.Collection
    descriptor.constant = new xs.core.Collection(descriptor.constant);

    //get reference to descriptor
    var own = Interface.descriptor.constant;

    //add all inherited
    Interface.parent.descriptor.constant.each(function (name) {
        own.add(name);
    });

    //add own constants from raw descriptor and save to Interface.descriptor
    descriptor.constant.each(function (name) {
        assert.ok(name && xs.isString(name), '[$Interface]: given constant name `$name` is incorrect', {
            $Interface: Interface.label,
            $name: name
        });

        if (!own.has(name)) {
            own.add(name);
        }
    });

}

function processStaticProperties(Interface, descriptor) {

    //assert, that static properties list is an object
    assert.object(descriptor.static.property, '[$Interface]: static properties list `$properties` is not an object', {
        $Interface: Interface.label,
        $properties: descriptor.static.property
    });

    //convert to xs.core.Collection
    descriptor.static.property = new xs.core.Collection(descriptor.static.property);

    //get reference to descriptor
    var own = Interface.descriptor.static.property;

    //add all inherited
    Interface.parent.descriptor.static.property.each(function (value, name) {
        own.add(name, value);
    });

    //add own static properties from raw descriptor
    descriptor.static.property.each(function (value, name) {
        assert.ok(name, '[$Interface]: given static property name `$name` is incorrect', {
            $Interface: Interface.label,
            $name: name
        });

        //save descriptor basics
        var property = xs.property.prepare(name, value);

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
}

function processStaticMethods(Interface, descriptor) {

    //assert, that static methods list is an object
    assert.object(descriptor.static.method, '[$Interface]: static methods list `$methods` is not an object', {
        $Interface: Interface.label,
        $methods: descriptor.static.method
    });

    //convert to xs.core.Collection
    descriptor.static.method = new xs.core.Collection(descriptor.static.method);

    //get reference to descriptor
    var own = Interface.descriptor.static.method;

    //add all inherited
    Interface.parent.descriptor.static.method.each(function (value, name) {
        own.add(name, value);
    });

    //add own static methods from raw descriptor
    descriptor.static.method.each(function (value, name) {
        assert.ok(name, '[$Interface]: given static method name `$name` is incorrect', {
            $Interface: Interface.label,
            $name: name
        });

        //save descriptor basics
        var method = xs.method.prepare(name, value);

        var scheme = {
            args: xs.Function.getArguments(method.value)
        };

        if (own.hasKey(name)) {
            own.set(name, scheme);
        } else {
            own.add(name, scheme);
        }
    });

}

function processConstructor(Interface, descriptor) {
    var inherited = Interface.parent.descriptor.hasOwnProperty('constructor') ? Interface.parent.descriptor.constructor : undefined;

    //get own constructor from raw descriptor
    var own = descriptor.hasOwnProperty('constructor') ? descriptor.constructor : undefined;

    //verify, that own constructor is undefined or is function
    assert.ok(!xs.isDefined(own) || xs.isFunction(own), 'own constructor is defined and is not a function');

    //apply
    if (own) {
        Interface.descriptor.constructor = {
            args: xs.Function.getArguments(own)
        };
    } else if (inherited) {
        Interface.descriptor.constructor = inherited;
    }
}

function processProperties(Interface, descriptor) {

    //assert, that properties list is an object
    assert.object(descriptor.property, '[$Interface]: static properties list `$properties` is not an object', {
        $Interface: Interface.label,
        $properties: descriptor.property
    });

    //convert to xs.core.Collection
    descriptor.property = new xs.core.Collection(descriptor.property);

    //get reference to descriptor
    var own = Interface.descriptor.property;

    //add all inherited
    Interface.parent.descriptor.property.each(function (value, name) {
        own.add(name, value);
    });


    //add own properties from raw descriptor
    descriptor.property.each(function (value, name) {
        assert.ok(name, '[$Interface]: given property name `$name` is incorrect', {
            $Interface: Interface.label,
            $name: name
        });

        //save descriptor basics
        var property = xs.property.prepare(name, value);

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
}

function processMethods(Interface, descriptor) {

    //assert, that methods list is an object
    assert.object(descriptor.method, '[$Interface]: methods list `$methods` is not an object', {
        $Interface: Interface.label,
        $methods: descriptor.method
    });

    //init reference to methods list, converted to xs.core.Collection
    descriptor.method = new xs.core.Collection(descriptor.method);

    //get reference to descriptor
    var own = Interface.descriptor.method;

    //add all inherited
    Interface.parent.descriptor.method.each(function (value, name) {
        own.add(name, value);
    });


    //add own methods from raw descriptor
    descriptor.method.each(function (value, name) {
        assert.ok(name, '[$Interface]: given method name `$name` is incorrect', {
            $Interface: Interface.label,
            $name: name
        });

        //save descriptor basics
        var method = xs.method.prepare(name, value);

        var scheme = {
            args: xs.Function.getArguments(method.value)
        };

        if (own.hasKey(name)) {
            own.set(name, scheme);
        } else {
            own.add(name, scheme);
        }
    });
}

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
    this.message = 'xs.interface.preprocessors.prepareElements::' + message;
}

PrepareElementsError.prototype = new Error();