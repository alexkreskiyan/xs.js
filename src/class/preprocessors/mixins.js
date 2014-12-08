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
     * Preprocessor mixins
     * Is used to process class mixins
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('mixins', function () {

        return true;
    }, function (Class, descriptor, ns, dependencies, ready) {

        //if mixins are specified not as object - throw respective error
        if (!xs.isObject(descriptor.mixins)) {
            throw new MixinError('incorrect mixins list');
        }

        //init
        //init mixins list
        var mixins = Class.descriptor.mixins = {};

        //extend mixins with inherited mixins
        xs.extend(mixins, Class.parent.descriptor.mixins);

        //extend mixins with own mixins
        xs.extend(mixins, descriptor.mixins);


        //load
        //init loads list
        var loads = [];

        xs.log('xs.class.preprocessor.mixins. Mixins:', mixins);
        xs.each(mixins, function (name, alias, list) {
            //verify mixed class name
            if (!xs.isString(name) || !name) {
                throw new ConstError('incorrect mixed class name');
            }

            //verify mixed class alias
            if (!alias) {
                throw new ConstError('incorrect mixed class alias');
            }

            //resolve name with namespace and update list
            name = list[alias] = Class.descriptor.namespace.resolve(name);

            xs.log('xs.class.preprocessor.mixins. Mixing in:', name, 'as', alias);
            //if mixed class is already loaded - go to next mixin
            if (xs.ClassManager.has(name)) {
                xs.log('xs.class.preprocessor.mixins. Mixed', name, 'already loaded');

                return;
            }

            xs.log('xs.class.preprocessor.mixins. Mixed', name, 'not loaded yet, loading');
            //add class to load list
            loads.push(name);
        });

        //if no loads required, apply mixes and return
        if (!xs.size(loads)) {
            //apply mixins to Class.descriptor
            _applyMixins(Class, mixins);

            return;
        }

        xs.log('xs.class.preprocessor.mixins. Loading mixins', mixins);
        //require async
        xs.require(loads, function (classes) {

            xs.log('xs.class.preprocessor.extends. Mixins', loads, 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, xs.values(classes), function(){

                xs.log('xs.class.preprocessor.extends. Mixins', loads, 'processed, applying mixins');
                //apply mixins to Class.descriptor
                _applyMixins(Class, mixins);

                //call ready to notify processor stack, that mixins succeed
                ready();
            });
        });

        //return false to sign async processor
        return false;
    }, 'after', 'prepareMethods');

    /**
     * Core mixins function. Performs mixins' verification and applies each mixin to target class
     *
     * @ignore
     *
     * @method applyMixins
     *
     * @param {Object} target target class
     * @param {Object} mixins mixins list
     */
    var _applyMixins = function (target, mixins) {
        //create mixins property in target.prototype
        target.prototype.mixins = {};

        //apply each mixin
        xs.each(mixins, function (name, alias) {

            //get reference for mixed class
            var mixed = xs.ClassManager.get(name);

            //mix mixed class descriptor into target descriptor
            _mixinClass(target.descriptor, mixed.descriptor);

            //save mixed into target.prototype.mixins
            target.prototype.mixins[alias] = mixed;
        });
    };

    /**
     * Core mixins function. Defaults target descriptor parts with mix descriptor paths
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
        xs.each(target, function (targetValue, targetName) {
            var mixinValue = mixin[targetName];
            if (xs.isDefined(mixinValue) && mixinValue !== targetValue) {
                throw new MixinError(type + ' "' + targetName + '" is already declared');
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
     * @class MixinError
     */
    function MixinError(message) {
        this.message = 'xs.class.preprocessors.mixin :: ' + message;
    }

    MixinError.prototype = new Error();
})(window, 'xs');