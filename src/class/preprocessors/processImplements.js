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

    var logger = new xs.log.Logger('xs.class.preprocessors.processImplements');

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
         * @method implements
         *
         * @param {Function} Interface verified interface
         *
         * @return {Boolean} whether Class.descriptor.implements collection contains label of given interface
         */
        xs.constant(Class, 'implements', function (Interface) {
            xs.assert.Interface(Interface, '[$Class]: given "$Interface" is not an interface', {
                $Class: Class.label,
                $Interface: Interface
            }, ProcessImplementsError);

            return this.descriptor.implements.has(Interface.label);
        });

        return true;
    }, function (Class, descriptor) {

        logger.trace(Class.label ? Class.label : 'undefined');

        //init
        //get interfaces list
        var interfaces = Class.descriptor.implements = descriptor.implements;


        //process interfaces list
        logger.trace((Class.label ? Class.label : 'undefined') + '. Declared interfaces', {
            interfaces: interfaces.toSource()
        });
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        interfaces.each(function (name, index, list) {

            //resolve name with namespace and update list
            name = resolveName(name);
            list.set(index, name);

            //assert, that interface is defined
            xs.assert.ok(xs.ContractsManager.has(name), '[$Class]: implemented interface "$name" is not defined. Move it to imports section, please', {
                $Class: Class.label,
                $name: name
            }, ProcessImplementsError);

            //get Interface reference
            var Interface = xs.ContractsManager.get(name);

            //check that contractor is xs.Interface
            xs.assert.Interface(Interface, '[$Class]: given "$Interface" is not interface', {
                $Class: Class.label,
                $Interface: Interface.label
            }, ProcessImplementsError);

            //check that interface is ready
            xs.assert.not(Interface.isProcessing, '[$Class]: implemented interface "$Interface" is not processed yet. Move it to imports section, please', {
                $Class: Class.label,
                $Interface: Interface.label
            }, ProcessImplementsError);
        });

        //add all inherited
        Class.parent.descriptor.implements.each(function (value) {
            interfaces.add(value);
        });

        //verify interfaces implementation
        //assert, that target implements all interfaces
        xs.assert.ok(_verifyImplements(Class, interfaces));
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
    var _verifyImplements = function (Class, interfaces) {
        //apply each interface
        interfaces.each(function (name) {

            var Interface = xs.ContractsManager.get(name);

            logger.trace((Class.label ? Class.label : 'undefined') + '. Verifying implementation of ' + Interface.label);
            //verify, that target implements Interface
            _verifyInterface(Class, Interface);
        });

        return true;
    };

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
    var _verifyInterface = function (Class, Interface) {
        var descriptor = Class.descriptor;
        //verify constants
        Interface.descriptor.constant.each(function (name) {
            //assert, that constant is declared
            xs.assert.ok(descriptor.constant.hasKey(name), '[$Class]: implemented interface "$Interface" requires constant "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name
            }, ProcessImplementsError);
        });

        //static properties
        Interface.descriptor.static.property.each(function (config, name) {
            //assert, that static property is declared
            xs.assert.ok(descriptor.static.property.hasKey(name), '[$Class]: implemented interface "$Interface" requires static property "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name
            }, ProcessImplementsError);

            //assert, that static property type is compatible with required
            var property = descriptor.static.property.at(name);

            if (config.isAccessed) {
                //assert, that static property is accessed
                xs.assert.not(property.hasOwnProperty('value'), '[$Class]: implemented interface "$Interface" requires static property "$name" to be accessed property, but it is declared as assigned one', {
                    $Class: Class.label,
                    $Interface: Interface.label,
                    $name: name
                }, ProcessImplementsError);

                //assert, that static property is readonly, if needed
                if (config.isReadonly) {
                    xs.assert.equal(property.set, xs.emptyFn, '[$Class]: implemented interface "$Interface" requires static property "$name" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                        $Class: Class.label,
                        $Interface: Interface.label,
                        $name: name
                    }, ProcessImplementsError);
                }
            } else {
                //assert, that static property is assigned
                xs.assert.ok(property.hasOwnProperty('value'), '[$Class]: implemented interface "$Interface" requires static property "$name" to be assigned property, but it is declared as accessed one', {
                    $Class: Class.label,
                    $Interface: Interface.label,
                    $name: name
                }, ProcessImplementsError);
            }
        });

        //static methods
        Interface.descriptor.static.method.each(function (config, name) {
            //assert, that static method is declared
            xs.assert.ok(descriptor.static.method.hasKey(name), '[$Class]: implemented interface "$Interface" requires static method "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name
            }, ProcessImplementsError);

            //assert, that static method arguments are compatible with required
            var requiredArguments = config.args.toString();
            var declaredArguments = xs.Function.getArguments(descriptor.static.method.at(name).value).toString();

            //assert, that arguments' lists are equal
            xs.assert.equal(declaredArguments, requiredArguments, '[$Class]: implemented interface "$Interface" requires static method "$name" to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name,
                $requiredArguments: requiredArguments,
                $declaredArguments: declaredArguments
            }, ProcessImplementsError);
        });

        //constructor, if given
        if (Interface.descriptor.constructor) {
            //assert, that constructor id declared
            xs.assert.ok(descriptor.constructor, '[$Class]: implemented interface "$Interface" requires constructor declared, but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label
            }, ProcessImplementsError);

            //assert, that constructor arguments are compatible with required
            var requiredArguments = Interface.descriptor.constructor.args.toString();
            var declaredArguments = xs.Function.getArguments(descriptor.constructor).toString();

            //assert, that arguments' lists are equal
            xs.assert.equal(declaredArguments, requiredArguments, '[$Class]: implemented interface "$Interface" requires constructor to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
                $Class: Class.label,
                $Interface: Interface.label,
                $requiredArguments: requiredArguments,
                $declaredArguments: declaredArguments
            }, ProcessImplementsError);
        }

        //properties
        Interface.descriptor.property.each(function (config, name) {
            //assert, that static property is declared
            xs.assert.ok(descriptor.property.hasKey(name), '[$Class]: implemented interface "$Interface" requires property "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name
            }, ProcessImplementsError);

            //assert, that property type is compatible with required
            var property = descriptor.property.at(name);

            if (config.isAccessed) {
                //assert, that property is accessed
                xs.assert.not(property.hasOwnProperty('value'), '[$Class]: implemented interface "$Interface" requires property "$name" to be accessed property, but it is declared as assigned one', {
                    $Class: Class.label,
                    $Interface: Interface.label,
                    $name: name
                }, ProcessImplementsError);

                //assert, that property is readonly, if needed
                if (config.isReadonly) {
                    xs.assert.equal(property.set, xs.emptyFn, '[$Class]: implemented interface "$Interface" requires property "$name" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                        $Class: Class.label,
                        $Interface: Interface.label,
                        $name: name
                    }, ProcessImplementsError);
                }
            } else {
                //assert, that property is assigned
                xs.assert.ok(property.hasOwnProperty('value'), '[$Class]: implemented interface "$Interface" requires property "$name" to be assigned property, but it is declared as accessed one', {
                    $Class: Class.label,
                    $Interface: Interface.label,
                    $name: name
                }, ProcessImplementsError);
            }
        });

        //methods
        Interface.descriptor.method.each(function (config, name) {
            //assert, that method is declared
            xs.assert.ok(descriptor.method.hasKey(name), '[$Class]: implemented interface "$Interface" requires method "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name
            }, ProcessImplementsError);

            //assert, that method arguments are compatible with required
            var requiredArguments = config.args.toString();
            var declaredArguments = xs.Function.getArguments(descriptor.method.at(name).value).toString();

            //assert, that arguments' lists are equal
            xs.assert.equal(declaredArguments, requiredArguments, '[$Class]: implemented interface "$Interface" requires method "$name" to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
                $Class: Class.label,
                $Interface: Interface.label,
                $name: name,
                $requiredArguments: requiredArguments,
                $declaredArguments: declaredArguments
            }, ProcessImplementsError);
        });

        return true;
    };

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
})(window, 'xs');
