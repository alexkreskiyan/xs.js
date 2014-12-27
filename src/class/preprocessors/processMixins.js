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
     * Preprocessor processMixins
     * Is used to process class mixins
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('processMixins', function (Class, descriptor) {

        return descriptor.mixins.length > 0;
    }, function (Class) {

        xs.log('xs.class.preprocessors.processMixins[', Class.label, ']');

        //init
        //get mixins list
        var mixins = Class.descriptor.mixins;

        //process mixins list
        xs.log('xs.class.preprocessors.processMixins[', Class.label, ']. Mixins:', mixins.toSource());
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        mixins.each(function (name, alias, list) {

            //resolve name with namespace and update list
            name = resolveName(name);
            list.set(alias, name);

            //if Mixin is not defined - throw error
            if (!xs.ContractsManager.has(name)) {
                throw new ProcessMixinsError('[' + Class.label + ']: parent class "' + name + '" is not defined');
            }

            //get Mixin reference
            var Mixin = xs.ContractsManager.get(name);

            //check that contractor is same
            if (Mixin.contractor != Class.contractor) {
                throw new ProcessMixinsError('[' + Class.label + ']: mixin class "' + Mixin.label + '" has different contractor: "' + Mixin.contractor.label + '"');
            }

            //if Mixin is processing = throw error
            if (Mixin.isProcessing) {
                throw new ProcessMixinsError('[' + Class.label + ']: mixin class "' + Mixin.label + '" is not processed yet. Move it to imports section, please');
            }
        });

        //add all inherited
        Class.parent.descriptor.mixins.each(function (value, name) {
            mixins.add(name, value);
        });

        //apply mixins to Class.descriptor
        _applyMixins(Class, mixins);
    });

    /**
     * Core mixins function. Performs mixins' verification and applies each mixin to target class
     *
     * @ignore
     *
     * @method applyMixins
     *
     * @param {Object} Class target class
     * @param {Object} mixins mixins list
     */
    var _applyMixins = function (Class, mixins) {
        //create mixins property in target.prototype
        Class.prototype.mixins = {};

        //apply each mixin
        mixins.each(function (name, alias) {

            var Mixin = xs.ContractsManager.get(name);

            xs.log('xs.class.preprocessors.processMixins[', Class.label, ']. Mixing in:', Mixin.label, 'as', alias);
            //mix mixed class descriptor into target descriptor
            _mixinClass(Class.descriptor, Mixin.descriptor);

            //save mixed into Class.prototype.mixins
            Class.prototype.mixins[alias] = Mixin;
        });
    };

    /**
     * Core mixins function. Compares target descriptor parts with mix descriptor paths
     *
     * @ignore
     *
     * @method mixinClass
     *
     * @param {Object} target target class descriptor
     * @param {Object} mix mixin class descriptor
     */
    var _mixinClass = function (target, mix) {

        //extend constants
        _mixinSection('constant', target.constants, mix.constants);

        //static properties
        _mixinSection('static property', target.static.properties, mix.static.properties);

        //static methods
        _mixinSection('static method', target.static.methods, mix.static.methods);

        //properties
        _mixinSection('property', target.properties, mix.properties);

        //methods
        _mixinSection('method', target.methods, mix.methods);
    };

    /**
     * Core mixins function. Checks that source doesn't override target and extends it
     *
     * @ignore
     *
     * @method mixinSection
     *
     * @param {String} type type of extended data
     * @param {Object} target target data
     * @param {Object} mixin mixin data
     */
    var _mixinSection = function (type, target, mixin) {
        //find differing intersections
        target.each(function (targetValue, targetName) {
            //continue if not intersection
            if (!mixin.hasKey(targetName)) {

                return;
            }

            //get mixed value
            var mixinValue = mixin.at(targetName);

            //if values differ - its error
            if (mixinValue !== targetValue) {
                throw new ProcessMixinsError(type + ' "' + targetName + '" is already declared');
            }
        });

        //extend target with mixin
        xs.extend(target, mixin);
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ProcessMixinsError
     */
    function ProcessMixinsError(message) {
        this.message = 'xs.class.preprocessors.processMixins::' + message;
    }

    ProcessMixinsError.prototype = new Error();
})(window, 'xs');