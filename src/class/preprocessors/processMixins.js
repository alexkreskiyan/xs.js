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
     * Preprocessor processMixins
     * Is used to process class mixins. Mixins list is given as hash of alias:name pairs.
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login';
     *
     *         this.mixins = 'ns.mixins.CanBuy'; //Name of some used mixin. Is automatically anonymously imported
     *
     *     });
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
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
         *
         * @throws {Error} Error is thrown, when:
         *
         * - non-class given
         */
        xs.constant(Class, 'mixins', function (Mixin) {
            xs.assert.Class(Mixin, '[$Class]: given non-class value "$Mixin"', {
                $Class: Class.label,
                $Mixin: Mixin
            }, ProcessMixinsError);

            var mixins = this.descriptor.allMixins;

            return xs.isObject(mixins) && mixins.has(Mixin.label);
        });

        return descriptor.mixins.length > 0;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.processMixins[', Class.label, ']');

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
        xs.log('xs.class.preprocessors.processMixins[', Class.label, ']. Mixins:', own.toSource());
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        own.each(function (name, alias) {

            //resolve name with namespace
            name = resolveName(name);

            //assert, that mixin is defined
            xs.assert.ok(xs.ContractsManager.has(name), '[$Class]: mixed class "$name" is not defined. Move it to imports section, please', {
                $Class: Class.label,
                $name: name
            }, ProcessMixinsError);

            //get Mixin reference
            var Mixin = xs.ContractsManager.get(name);

            //check that contractor is xs.Class
            xs.assert.Class(Mixin, '[$Class]: given "$Mixin" is not class', {
                $Class: Class.label,
                $Mixin: Mixin.label
            }, ProcessMixinsError);

            //check that mixin is ready
            xs.assert.not(Mixin.isProcessing, '[$Class]: mixed class "$Mixin" is not processed yet. Move it to imports section, please', {
                $Class: Class.label,
                $Mixin: Mixin.label
            }, ProcessMixinsError);

            //if name not in allMixins collection - add it to mixins and allMixins
            if (!allMixins.has(name)) {
                //add aliased name to mixins collection
                mixins.add(alias, name);

                //add name to allMixins collection
                allMixins.add(name);
            }
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
        _mixinSection('constant', target.constant, mix.constant);

        //static properties
        _mixinSection('static property', target.static.property, mix.static.property);

        //static methods
        _mixinSection('static method', target.static.method, mix.static.method);

        //properties
        _mixinSection('property', target.property, mix.property);

        //methods
        _mixinSection('method', target.method, mix.method);
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
        //assert that there are no intersections
        //block is included into another assert to exclude it completely from release version
        xs.assert.ok((function (type, target, mixin) {
            var name = '';

            //try to find already declared item
            target.find(function (targetValue, targetName) {
                //continue if not intersection
                if (!mixin.hasKey(targetName)) {

                    return;
                }

                //get mixed value
                var mixinValue = mixin.at(targetName);

                //if values equal - it's ok, continue
                if (mixinValue === targetValue) {

                    return;
                }

                //error, save name of already declared item
                name = targetName;

                return true;
            });

            xs.assert.not(name, '"$type" "$name" is already declared', {
                $type: type,
                $name: name
            }, ProcessMixinsError);

            //return true, all ok

            return true;
        })(type, target, mixin));

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
