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

    var log = new xs.log.Logger('xs.class.preprocessors.processMixins');

    var assert = new xs.core.Asserter(log, ProcessMixinsError);

    /**
     * Directive mixins
     *
     * Is used to process class mixins. Mixins list is given as hash of alias:name pairs.
     *
     * Be careful about using mixins, because framework is strict about that and doesn't allow multiple declarations between Class and it's mixins
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login';
     *
     *         this.mixins.CanBuy = 'ns.mixins.CanBuy'; //Name of some used mixin. Can not be empty
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property mixins
     */
    xs.class.preprocessors.add('processMixins', function (Class, descriptor) {

        /**
         * Returns whether Class mixins given Mixin class
         *
         * @member xs.class.Base
         *
         * @method mixins
         *
         * @param {Function} Mixin verified mixin class
         *
         * @return {Boolean} whether given Mixin class is stored with some alias in Class.prototype.mixins
         */
        xs.constant(Class, 'mixins', function (Mixin) {
            assert.Class(Mixin, '[$Class]: given non-class value `$Mixin`', {
                $Class: Class.label,
                $Mixin: Mixin
            });

            var mixins = this.descriptor.allMixins;

            return xs.isObject(mixins) && mixins.has(Mixin.label);
        });

        return true;
    }, function (Class, descriptor) {

        log.trace(Class.label ? Class.label : 'undefined');

        //init
        //own mixins initial list
        var own = descriptor.mixins;

        //inherited mixins initial list  - empty collection if missing, existing on (clone is use less) - if exists
        var inherited = Class.parent.descriptor.allMixins ? Class.parent.descriptor.allMixins : new xs.core.Collection();

        //Class mixins list (is empty by default)
        var mixins = Class.descriptor.mixins;

        //Class aggregate mixins list - mixins clone
        var allMixins = Class.descriptor.allMixins = inherited.clone();


        //Mixins are separated:
        //1. join own and inherited into allMixins list
        //2. subtract own from inherited into pure class mixins list

        //process own mixins list
        log.trace((Class.label ? Class.label : 'undefined') + '. Processed mixins', {
            mixins: own.toSource()
        });

        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        own.each(function (name, alias) {

            //resolve name with namespace
            name = resolveName(name);

            //assert, that mixin is defined
            assert.ok(xs.ContractsManager.has(name), '[$Class]: mixed class `$name` is not defined. Move it to imports section, please', {
                $Class: Class.label,
                $name: name
            });

            //get Mixin reference
            var Mixin = xs.ContractsManager.get(name);

            //check that contractor is xs.Class
            assert.Class(Mixin, '[$Class]: given `$Mixin` is not class', {
                $Class: Class.label,
                $Mixin: Mixin.label
            });

            //check that mixin is ready
            assert.not(Mixin.isProcessing, '[$Class]: mixed class `$Mixin` is not processed yet. Move it to imports section, please', {
                $Class: Class.label,
                $Mixin: Mixin.label
            });

            //if name not in allMixins collection - add it to mixins and allMixins
            if (!allMixins.has(name)) {
                //add aliased name to mixins collection
                mixins.add(alias, name);

                //add name to allMixins collection
                allMixins.add(name);
            }
        });

        //apply mixins to Class.descriptor
        applyMixins(Class, mixins);
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
    var applyMixins = function (Class, mixins) {
        //create mixins property in target.prototype
        Class.prototype.mixins = {};

        //apply each mixin
        mixins.each(function (name, alias) {

            var Mixin = xs.ContractsManager.get(name);

            log.trace((Class.label ? Class.label : 'undefined') + '. Mixining ' + Mixin.label + 'as ' + alias);
            //mix mixed class descriptor into target descriptor
            mixinClass(Class.descriptor, Mixin.descriptor);

            //save mixed into Class.mixins
            Class.mixins[alias] = Mixin;
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
    var mixinClass = function (target, mix) {

        //extend constants
        mixinSection('constant', target.constant, mix.constant);

        //static properties
        mixinSection('static property', target.static.property, mix.static.property);

        //static methods
        mixinSection('static method', target.static.method, mix.static.method);

        //properties
        mixinSection('property', target.property, mix.property);

        //methods
        mixinSection('method', target.method, mix.method);
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
    var mixinSection = function (type, target, mixin) {

        //default target with mixin
        mixin.each(function (descriptor, name) {
            if (!target.hasKey(name)) {
                target.add(name, descriptor);
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
     * @class ProcessMixinsError
     */
    function ProcessMixinsError(message) {
        this.message = 'xs.class.preprocessors.processMixins::' + message;
    }

    ProcessMixinsError.prototype = new Error();
})(window, 'xs');
