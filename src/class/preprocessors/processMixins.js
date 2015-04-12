'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.processMixins');

var assert = new xs.core.Asserter(log, XsClassPreprocessorsProcessMixinsError);

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
     * @static
     *
     * @method mixins
     *
     * @param {Function|Function[]} Mixin verified mixin class(es)
     *
     * @return {Boolean} whether given Mixin class is stored with some alias in Class.prototype.mixins
     */
    xs.constant(Class, 'mixins', function (Mixin) {
        var Class = this;

        //convert to collection
        var Mixins = new xs.core.Collection(xs.isArray(Mixin) ? Mixin : [ Mixin ]);

        var mixins = Class.descriptor.allMixins;

        //return whether all Mixins are used
        return Mixins.all(function (Mixin) {

            assert.Class(Mixin, '$Class: given `$Mixin` is not a class', {
                $Class: Class,
                $Mixin: Mixin
            });

            //return whether class mixins contain Mixin or it's child
            return mixins.find(function (Candidate) {

                return Candidate === Mixin || Candidate.inherits(Mixin);
            });
        });
    });

    return true;
}, function (Class, descriptor) {

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
    log.trace(Class + '. Processed mixins', {
        mixins: own.toSource()
    });

    //namespace shortcut
    var resolveName = Class.descriptor.resolveName;
    own.each(function (name, alias) {

        //resolve name with namespace
        name = resolveName(name);

        //assert, that mixin is defined
        assert.ok(xs.ContractsManager.has(name), '$Class: mixed class `$name` is not defined. Move it to imports section, please', {
            $Class: Class,
            $name: name
        });

        //get Mixin reference
        var Mixin = xs.ContractsManager.get(name);

        //check that contractor is xs.Class
        assert.Class(Mixin, '$Class: given `$Mixin` is not class', {
            $Class: Class,
            $Mixin: Mixin
        });

        //check that mixin is ready
        assert.not(Mixin.isProcessing, '$Class: mixed class `$Mixin` is not processed yet. Move it to imports section, please', {
            $Class: Class,
            $Mixin: Mixin
        });

        //if name not in allMixins collection - add it to mixins and allMixins
        if (!allMixins.has(Mixin)) {
            //add aliased Mixin to mixins collection
            mixins.add(alias, Mixin);

            //add name to allMixins collection
            allMixins.add(Mixin);
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
function applyMixins(Class, mixins) {

    //apply each mixin
    mixins.each(function (Mixin, alias) {

        log.trace(Class + '. Mixining ' + Mixin + 'as ' + alias);
        //mix mixed class descriptor into target descriptor
        mixinClass(Class.descriptor, Mixin.descriptor);

        //save mixed into Class.mixins
        Class.mixins[ alias ] = Mixin;
    });
}

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
function mixinClass(target, mix) {

    //extend constants
    mixinSection(target.constant, mix.constant);

    //static properties
    mixinSection(target.static.property, mix.static.property);

    //static methods
    mixinSection(target.static.method, mix.static.method);

    //properties
    mixinSection(target.property, mix.property);

    //methods
    mixinSection(target.method, mix.method);
}

/**
 * Core mixins function. Checks that source doesn't override target and extends it
 *
 * @ignore
 *
 * @method mixinSection
 *
 * @param {Object} target target data
 * @param {Object} mixin mixin data
 */
function mixinSection(target, mixin) {

    //default target with mixin
    mixin.each(function (descriptor, name) {
        if (!target.hasKey(name)) {
            target.add(name, descriptor);
        }
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsClassPreprocessorsProcessMixinsError
 */
function XsClassPreprocessorsProcessMixinsError(message) {
    this.message = 'xs.class.preprocessors.processMixins::' + message;
}

XsClassPreprocessorsProcessMixinsError.prototype = new Error();