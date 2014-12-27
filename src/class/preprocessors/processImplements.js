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
     * Preprocessor processImplements
     * Is used to process class mixins
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('processImplements', function (Class, descriptor) {

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
        interfaces.each(function (name, alias, list) {

            //resolve name with namespace and update list
            name = resolveName(name);
            list.set(alias, name);

            //if Interface is not defined - throw error
            if (!xs.ContractsManager.has(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + name + '" is not defined');
            }

            //get Interface reference
            var Interface = xs.ContractsManager.get(name);

            //check that contractor is xs.Interface
            if (Interface.contractor != xs.Interface) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" has different contractor: "' + Interface.contractor.label + '"');
            }

            //if Interface is processing = throw error
            if (Interface.isProcessing) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" is not processed yet. Move it to imports section, please');
            }

        });

        //add all inherited
        Class.parent.descriptor.implements.each(function (value, name) {
            interfaces.add(name, value);
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
            //throw error if constant is not declared
            if (!descriptor.constants.hasKey(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires constant "' + name + '", but it is not declared');
            }
        });

        //static properties
        Interface.descriptor.static.properties.each(function (config, name) {
            //throw error if static property is not declared
            if (!descriptor.static.properties.hasKey(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static property "' + name + '", but it is not declared');
            }

            //throw error if static property type is not compatible with required
            var property = descriptor.static.properties.at(name);

            if (config.isAccessed) {
                //if property is assigned - it's error
                if (property.hasOwnProperty('value')) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static property "' + name + '" to be accessed property, but it is declared as assigned one');
                }

                //if property is required to be readonly, but is not - it's error
                if (config.isReadonly && property.set !== xs.emptyFn) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static property "' + name + '" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly');
                }
            } else {
                //if property is accessed - it's error
                if (property.hasOwnProperty('get')) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static property "' + name + '" to be assigned property, but it is declared as accessed one');
                }
            }
        });

        //static methods
        Interface.descriptor.static.methods.each(function (config, name) {
            //throw error if static method is not declared
            if (!descriptor.static.methods.hasKey(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static method "' + name + '", but it is not declared');
            }

            //throw error if static method arguments are not compatible with required
            var arguments = xs.Function.getArguments(descriptor.static.methods.at(name).value);

            if (arguments.toString() != config.arguments.toString()) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires static method "' + name + '" to have arguments list: ' + config.arguments.toString() + ', but declared function has list: ' + arguments.toString());
            }
        });

        //properties
        Interface.descriptor.properties.each(function (config, name) {
            //throw error if property is not declared
            if (!descriptor.properties.hasKey(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires property "' + name + '", but it is not declared');
            }

            //throw error if property type is not compatible with required
            var property = descriptor.properties.at(name);

            if (config.isAccessed) {
                //if property is assigned - it's error
                if (property.hasOwnProperty('value')) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires property "' + name + '" to be accessed property, but it is declared as assigned one');
                }

                //if property is required to be readonly, but is not - it's error
                if (config.isReadonly && property.get !== xs.emptyFn) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires property "' + name + '" to be readonly, but it is not. Use xs.emptyFn as set to mark property, as readonly');
                }
            } else {
                //if property is accessed - it's error
                if (property.hasOwnProperty('get')) {
                    throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires property "' + name + '" to be assigned property, but it is declared as accessed one');
                }
            }
        });

        //methods
        Interface.descriptor.methods.each(function (config, name) {
            //throw error if method is not declared
            if (!descriptor.methods.hasKey(name)) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires method "' + name + '", but it is not declared');
            }

            //throw error if method arguments are not compatible with required
            var arguments = xs.Function.getArguments(descriptor.methods.at(name).value);

            if (arguments.toString() != config.arguments.toString()) {
                throw new ProcessImplementsError('[' + Class.label + ']: implemented interface "' + Interface.label + '" requires method "' + name + '" to have arguments list: ' + config.arguments.toString() + ', but declared function has list: ' + arguments.toString());
            }
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