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
     * Preprocessor processImplements
     * Is used to process class mixins
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
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
         *
         * @throws {Error} Error is thrown, when:
         *
         * - non-interface given
         */
        xs.constant(Class, 'implements', function (Interface) {
            xs.assert.Interface(Interface, ProcessImplementsError, '[$Class]: given "$Interface" is not interface', {
                $Class: Class.label,
                $Interface: Interface
            });

            return this.descriptor.implements.has(Interface.label);
        });

        return true;
    }, function (Class) {

        xs.log('xs.class.preprocessors.processImplements[', Class.label, ']');

        //init
        //get interfaces list
        var interfaces = Class.descriptor.implements;


        //process interfaces list
        xs.log('xs.class.preprocessors.processImplements[', Class.label, ']. Interfaces:', interfaces.toSource());
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        interfaces.each(function (name, index, list) {

            //resolve name with namespace and update list
            name = resolveName(name);
            list.set(index, name);

            //assert, that interface is defined
            xs.assert.ok(xs.ContractsManager.has(name), ProcessImplementsError, '[$Class]: implemented interface "$name" is not defined. Move it to imports section, please', {
                $Class: Class.label,
                $name: name
            });

            //get Interface reference
            var Interface = xs.ContractsManager.get(name);

            //check that contractor is xs.Interface
            xs.assert.Interface(Interface, ProcessImplementsError, '[$Class]: given "$Interface" is not interface', {
                $Class: Class.label,
                $Interface: Interface.label
            });

            //check that interface is ready
            xs.assert.not(Interface.isProcessing, ProcessImplementsError, '[$Class]: implemented interface "$Interface" is not processed yet. Move it to imports section, please', {
                $Class: Class.label,
                $Interface: Interface.label
            });
        });

        //add all inherited
        Class.parent.descriptor.implements.each(function (value) {
            interfaces.add(value);
        });

        //verify interfaces implementation
        _verifyImplements(Class, interfaces);
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

            xs.log('xs.class.preprocessors.processImplements[', Class.label, ']. Verifying implementation of', Interface.label);
            //verify, that target implements Interface
            _verifyInterface(Class, Interface);
        });
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
        Interface.descriptor.constants.each(function (name) {
            //assert, that constant is declared
            xs.assert.ok(descriptor.constants.hasKey(name), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires constant "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name
            });
        });

        //static properties
        Interface.descriptor.static.properties.each(function (config, name) {
            //assert, that static property is declared
            xs.assert.ok(descriptor.static.properties.hasKey(name), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static property "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name
            });

            //assert, that static property type is compatible with required
            var property = descriptor.static.properties.at(name);

            if (config.isAccessed) {
                //assert, that static property is accessed
                xs.assert.not(property.hasOwnProperty('value'), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static property "$name" to be accessed property, but it is declared as assigned one', {
                    $Class: Class.label,
                    $Interface: Class.label,
                    $name: name
                });

                //assert, that static property is readonly, if needed
                if (config.isReadonly) {
                    xs.assert.equal(property.set, xs.emptyFn, ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static property "$name" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                        $Class: Class.label,
                        $Interface: Class.label,
                        $name: name
                    });
                }
            } else {
                //assert, that static property is assigned
                xs.assert.ok(property.hasOwnProperty('value'), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static property "$name" to be assigned property, but it is declared as accessed one', {
                    $Class: Class.label,
                    $Interface: Class.label,
                    $name: name
                });
            }
        });

        //static methods
        Interface.descriptor.static.methods.each(function (config, name) {
            //assert, that static method is declared
            xs.assert.ok(descriptor.static.methods.hasKey(name), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static method "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name
            });

            //assert, that static method arguments are compatible with required
            var requiredArguments = config.args.toString();
            var declaredArguments = xs.Function.getArguments(descriptor.static.methods.at(name).value).toString();

            //assert, that arguments' lists are equal
            xs.assert.equal(declaredArguments, requiredArguments, ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires static method "$name" to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name,
                $requiredArguments: requiredArguments,
                $declaredArguments: declaredArguments
            });
        });

        //properties
        Interface.descriptor.properties.each(function (config, name) {
            //assert, that static property is declared
            xs.assert.ok(descriptor.properties.hasKey(name), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires property "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name
            });

            //assert, that property type is compatible with required
            var property = descriptor.properties.at(name);

            if (config.isAccessed) {
                //assert, that property is accessed
                xs.assert.not(property.hasOwnProperty('value'), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires property "$name" to be accessed property, but it is declared as assigned one', {
                    $Class: Class.label,
                    $Interface: Class.label,
                    $name: name
                });

                //assert, that property is readonly, if needed
                if (config.isReadonly) {
                    xs.assert.equal(property.set, xs.emptyFn, ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires property "$name" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly', {
                        $Class: Class.label,
                        $Interface: Class.label,
                        $name: name
                    });
                }
            } else {
                //assert, that property is assigned
                xs.assert.ok(property.hasOwnProperty('value'), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires property "$name" to be assigned property, but it is declared as accessed one', {
                    $Class: Class.label,
                    $Interface: Class.label,
                    $name: name
                });
            }
        });

        //methods
        Interface.descriptor.methods.each(function (config, name) {
            //assert, that method is declared
            xs.assert.ok(descriptor.methods.hasKey(name), ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires method "$name", but it is not declared', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name
            });

            //assert, that method arguments are compatible with required
            var requiredArguments = config.args.toString();
            var declaredArguments = xs.Function.getArguments(descriptor.methods.at(name).value).toString();

            //assert, that arguments' lists are equal
            xs.assert.equal(declaredArguments, requiredArguments, ProcessImplementsError, '[$Class]: implemented interface "$Interface" requires method "$name" to have arguments list: $requiredArguments, but declared function has list: $declaredArguments', {
                $Class: Class.label,
                $Interface: Class.label,
                $name: name,
                $requiredArguments: requiredArguments,
                $declaredArguments: declaredArguments
            });
        });
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
