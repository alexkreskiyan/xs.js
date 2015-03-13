'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.processImplements');

var assert = new xs.core.Asserter(log, ProcessImplementsError);

/**
 * Directive implements
 *
 * Is used to process class implements list.
 *
 * Directive is used to list interfaces, class' signature is matched against. For detailed info, look to {@link xs.interface.Interface}
 *
 * For example:
 *
 *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
 *
 *         'use strict';
 *
 *         this.implements = ['ns.IUser'];   //Name of implemented interface. Class must specify it's methods like ns.IUser interface needs
 *
 *     });
 *
 * @member xs.class.preprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property implements
 */
xs.class.preprocessors.add('processImplements', function (Class) {

    /**
     * Returns whether Class implements given interface
     *
     * @member xs.class.Base
     *
     * @static
     *
     * @method implements
     *
     * @param {Function} Interface verified interface
     *
     * @return {Boolean} whether Class.descriptor.implements collection contains label of given interface
     */
    xs.constant(Class, 'implements', function (Interface) {
        assert.Interface(Interface, '$Class: given `$Interface` is not an interface', {
            $Class: Class,
            $Interface: Interface
        });

        return this.descriptor.implements.has(Interface.label); //TODO implements must contain interfaces?
    });

    return true;
}, function (Class, descriptor) {

    //init
    //get interfaces list
    var interfaces = Class.descriptor.implements = descriptor.implements; //TODO implements must contain interfaces?


    //process interfaces list
    log.trace(Class + '. Declared interfaces', {
        interfaces: interfaces.toSource()
    });
    //namespace shortcut
    var resolveName = Class.descriptor.resolveName;
    interfaces.each(function (name, index, list) {

        //resolve name with namespace and update list
        name = resolveName(name);
        list.set(index, name);

        //assert, that interface is defined
        assert.ok(xs.ContractsManager.has(name), '$Class: implemented interface `$name` is not defined. Move it to imports section, please', {
            $Class: Class,
            $name: name
        });

        //get Interface reference
        var Interface = xs.ContractsManager.get(name);

        //check that contractor is xs.Interface
        assert.Interface(Interface, '$Class: given `$Interface` is not interface', {
            $Class: Class,
            $Interface: Interface
        });

        //check that interface is ready
        assert.not(Interface.isProcessing, '$Class: implemented interface `$Interface` is not processed yet. Move it to imports section, please', {
            $Class: Class,
            $Interface: Interface
        });
    });

    //add all inherited
    Class.parent.descriptor.implements.each(function (value) {
        interfaces.add(value);
    });

    //verify interfaces implementation
    //assert, that target implements all interfaces
    assert.ok(verifyImplements(Class, interfaces), 'Implementation verification failed');
});

/**
 * Core interfaces function. Performs interfaces' implementation verification
 *
 * @ignore
 *
 * @method verifyImplements
 *
 * @param {Object} Class target class
 * @param {Object} interfaces interfaces list
 */
function verifyImplements(Class, interfaces) {
    //apply each interface
    interfaces.each(function (name) {

        var Interface = xs.ContractsManager.get(name);

        log.trace(Class + '. Verifying implementation of ' + Interface);
        //verify, that target implements Interface
        verifyInterface(Class, Interface);
    });

    return true;
}

/**
 * Core interfaces function. Verifies, that
 *
 * @ignore
 *
 * @method verifyInterface
 *
 * @param {Object} Class target class
 * @param {Object} Interface verified interface
 */
function verifyInterface(Class, Interface) {
    var descriptor = Class.descriptor;
    //verify constants
    Interface.descriptor.constant.each(function (name) {
        //assert, that constant is declared
        assert.ok(descriptor.constant.hasKey(name), '$Class: implemented interface `$Interface` requires constant `$name`, but it is not declared', {
            $Class: Class,
            $Interface: Interface,
            $name: name
        });
    });

    //static properties
    Interface.descriptor.static.property.each(function (config, name) {
        //assert, that static property is declared
        assert.ok(descriptor.static.property.hasKey(name), '$Class: implemented interface `$Interface` requires static property `$name`, but it is not declared', {
            $Class: Class,
            $Interface: Interface,
            $name: name
        });

        //assert, that static property type is compatible with required
        var property = descriptor.static.property.at(name);

        if (config.isAccessed) {
            //assert, that static property is accessed
            assert.not(property.hasOwnProperty('value'), '$Class: implemented interface `$Interface` requires static property `$name` to be accessed property, but it is declared as assigned one', {
                $Class: Class,
                $Interface: Interface,
                $name: name
            });

            //assert, that static property is readonly, if needed
            if (config.isReadonly) {
                assert.equal(property.set, xs.emptyFn, '$Class: implemented interface `$Interface` requires static property `$name` to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                    $Class: Class,
                    $Interface: Interface,
                    $name: name
                });
            }
        } else {
            //assert, that static property is assigned
            assert.ok(property.hasOwnProperty('value'), '$Class: implemented interface `$Interface` requires static property `$name` to be assigned property, but it is declared as accessed one', {
                $Class: Class,
                $Interface: Interface,
                $name: name
            });
        }
    });

    //static methods
    Interface.descriptor.static.method.each(function (config, name) {
        //assert, that static method is declared
        assert.ok(descriptor.static.method.hasKey(name), '$Class: implemented interface `$Interface` requires static method `$name`, but it is not declared', {
            $Class: Class,
            $Interface: Interface,
            $name: name
        });

        //assert, that static method arguments are compatible with required
        var requiredArguments = config.args.toString();
        var declaredArguments = xs.Function.getArguments(descriptor.static.method.at(name).value).toString();

        //assert, that arguments' lists are equal
        assert.equal(declaredArguments, requiredArguments, '$Class: implemented interface `$Interface` requires static method `$name` to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
            $Class: Class,
            $Interface: Interface,
            $name: name,
            $requiredArguments: requiredArguments,
            $declaredArguments: declaredArguments
        });
    });

    //if class is abstract, constructor, properties nad methods are not verified
    if (Class.descriptor.abstract) {

        return true;
    }

    //constructor, if given
    if (Interface.descriptor.constructor) {
        //assert, that constructor id declared
        assert.ok(descriptor.constructor, '$Class: implemented interface `$Interface` requires constructor declared, but it is not declared', {
            $Class: Class,
            $Interface: Interface
        });

        //assert, that constructor arguments are compatible with required
        var requiredArguments = Interface.descriptor.constructor.args.toString();
        var declaredArguments = xs.Function.getArguments(descriptor.constructor).toString();

        //assert, that arguments' lists are equal
        assert.equal(declaredArguments, requiredArguments, '$Class: implemented interface `$Interface` requires constructor to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
            $Class: Class,
            $Interface: Interface,
            $requiredArguments: requiredArguments,
            $declaredArguments: declaredArguments
        });
    }

    //properties
    Interface.descriptor.property.each(function (config, name) {
        //assert, that static property is declared
        assert.ok(descriptor.property.hasKey(name), '$Class: implemented interface `$Interface` requires property `$name`, but it is not declared', {
            $Class: Class,
            $Interface: Interface,
            $name: name
        });

        //assert, that property type is compatible with required
        var property = descriptor.property.at(name);

        if (config.isAccessed) {
            //assert, that property is accessed
            assert.not(property.hasOwnProperty('value'), '$Class: implemented interface `$Interface` requires property `$name` to be accessed property, but it is declared as assigned one', {
                $Class: Class,
                $Interface: Interface,
                $name: name
            });

            //assert, that property is readonly, if needed
            if (config.isReadonly) {
                assert.equal(property.set, xs.emptyFn, '$Class: implemented interface `$Interface` requires property `$name` to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                    $Class: Class,
                    $Interface: Interface,
                    $name: name
                });
            }
        } else {
            //assert, that property is assigned
            assert.ok(property.hasOwnProperty('value'), '$Class: implemented interface `$Interface` requires property `$name` to be assigned property, but it is declared as accessed one', {
                $Class: Class,
                $Interface: Interface,
                $name: name
            });
        }
    });

    //methods
    Interface.descriptor.method.each(function (config, name) {
        //assert, that method is declared
        assert.ok(descriptor.method.hasKey(name), '$Class: implemented interface `$Interface` requires method `$name`, but it is not declared', {
            $Class: Class,
            $Interface: Interface,
            $name: name
        });

        //assert, that method arguments are compatible with required
        var requiredArguments = config.args.toString();
        var declaredArguments = xs.Function.getArguments(descriptor.method.at(name).value).toString();

        //assert, that arguments' lists are equal
        assert.equal(declaredArguments, requiredArguments, '$Class: implemented interface `$Interface` requires method `$name` to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
            $Class: Class,
            $Interface: Interface,
            $name: name,
            $requiredArguments: requiredArguments,
            $declaredArguments: declaredArguments
        });
    });

    return true;
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class ProcessImplementsError
 */
function ProcessImplementsError(message) {
    this.message = 'xs.class.preprocessors.processImplements::' + message;
}

ProcessImplementsError.prototype = new Error();