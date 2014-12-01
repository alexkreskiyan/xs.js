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
     * @param {Object} mixes mixes list
     * @param {Object} target target class descriptor
     */
    var applyMixins = function ( mixes, target ) {
        //TODO: inherit mixins, save mixins list, save mixins prototypes, apply mixins
        //apply each mix in reverse mode (last mentioned mix has advantage)
        xs.eachReverse(mixes, function ( mixed, alias ) {
            mixin(mixed.descriptor, target);
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

        //get mixins list
        var mixins = descriptor.mixins;

        //init loads list
        var loads = [];

        //mixed classes list
        var mixes = {};

        xs.log('xs.class.preprocessor.mixins. Mixins:', mixins);
        xs.each(mixins, function ( name, alias ) {

            //resolve name with namespace
            name = Class.descriptor.namespace.resolve(name);

            //try to get mixed class from ClassManager
            var mixed = xs.ClassManager.get(name);

            xs.log('xs.class.preprocessor.mixins. Mixing in:', name, 'as', alias);
            //if mixed class is already loaded - save it in mixed with alias
            if ( mixed ) {
                xs.log('xs.class.preprocessor.mixins. Mixed', name, 'already loaded, saving as', alias, 'in mixes');
                mixes[alias] = mixed;

                return;
            }

            xs.log('xs.class.preprocessor.mixins. Mixed', name, 'not loaded yet, loading');
            //add class to load list
            loads.push(name);
        });

        //if no loads required, apply mixes and return
        if ( !xs.size(loads) ) {
            //apply mixins to Class.descriptor
            applyMixins(mixes, Class.descriptor);

            return;
        }

        //require async
        xs.require(loads, function () {

            //assign mixes
            xs.each(loads, function ( name ) {
                //save loaded class in mixes by alias
                mixes[xs.keyOf(mixins, name)] = xs.ClassManager.get(name);
            });

            //apply mixins to Class.descriptor
            applyMixins(mixes, Class.descriptor);

            //call ready to notify processor stack, that import succeed
            ready();
        });

        //return false to sign async processor
        return false;
    }, 'after', 'extends');
})(window, 'xs');