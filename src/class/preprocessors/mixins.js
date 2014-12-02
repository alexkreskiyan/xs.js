/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Core mixins function. Defaults target descriptor parts with mix descriptor paths
     *
     * @ignore
     *
     * @method mixin
     *
     * @param {Object} mix mixin class descriptor
     * @param {Object} target target class descriptor
     */
    var mixin = function ( mix, target ) {
        //constants
        xs.defaults(target.const, mix.const);

        //static properties
        xs.defaults(target.static.properties, mix.static.properties);

        //static methods
        xs.defaults(target.static.methods, mix.static.methods);

        //properties
        xs.defaults(target.properties, mix.properties);

        //methods
        xs.defaults(target.methods, mix.methods);
    };

    /**
     * Core mixins function. Defaults target descriptor parts with mix descriptor paths
     *
     * @ignore
     *
     * @method applyMixins
     *
     * @param {Object} mixins mixins list
     * @param {Object} target target class
     */
    var applyMixins = function ( mixins, target ) {
        //create mixins property in target.prototype
        target.prototype.mixins = {};

        //apply each mix in reverse mode (last mentioned mix has advantage)
        xs.eachReverse(mixins, function ( name, alias ) {

            //get reference for mixed class
            var mixed = xs.ClassManager.get(name);

            //mix mixed class descriptor into target descriptor
            mixin(mixed.descriptor, target.descriptor);

            //save mixed.prototype into target.prototype.mixins
            target.prototype.mixins[alias] = mixed.prototype;
        });
    };

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
    }, function ( Class, descriptor, ns, ready ) {

        //if mixins are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.mixins) ) {
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
        xs.each(mixins, function ( name, alias, list ) {

            //resolve name with namespace and update list
            name = list[alias] = Class.descriptor.namespace.resolve(name);

            xs.log('xs.class.preprocessor.mixins. Mixing in:', name, 'as', alias);
            //if mixed class is already loaded - go to next mixin
            if ( xs.ClassManager.has(name) ) {
                xs.log('xs.class.preprocessor.mixins. Mixed', name, 'already loaded');

                return;
            }

            xs.log('xs.class.preprocessor.mixins. Mixed', name, 'not loaded yet, loading');
            //add class to load list
            loads.push(name);
        });

        //if no loads required, apply mixes and return
        if ( !xs.size(loads) ) {
            //apply mixins to Class.descriptor
            applyMixins(mixins, Class);

            return;
        }

        //require async
        xs.require(loads, function () {

            //apply mixins to Class.descriptor
            applyMixins(mixins, Class);

            //call ready to notify processor stack, that import succeed
            ready();
        });

        //return false to sign async processor
        return false;
    }, 'after', 'extends');


    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class MixinError
     */
    function MixinError ( message ) {
        this.message = 'xs.class.preprocessors.mixin :: ' + message;
    }

    MixinError.prototype = new Error();
})(window, 'xs');