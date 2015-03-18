'use strict';

/**
 * Private internal dependency class. Represents single node in dependencies mesh
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class Dependency
 */

/**
 * Creates dependency instance
 *
 * @constructor
 *
 * @param {Object|Function} contract contract, dependency is created from
 */
var Dependency = function (contract) {
    var me = this;

    //save contract reference
    me.contract = contract;

    //create dependencies collection
    me.dependencies = new xs.core.Collection();
};

//save Dependency reference
module.Dependency = Dependency;

/**
 * Dependency own dependencies collection size
 *
 * @property size
 *
 * @readonly
 *
 * @type {Number}
 */
Object.defineProperty(Dependency.prototype, 'size', {
    get: function () {
        return this.dependencies.size;
    },
    set: xs.noop
});

/**
 * Adds new dependent dependency for this one
 *
 * @method add
 *
 * @param {Dependency} dependency
 *
 * @chainable
 */
Dependency.prototype.add = function (dependency) {
    var me = this;

    me.dependencies.add(dependency);

    return me;
};

/**
 * Returns, whether dependency has given one as dependent
 *
 * @method has
 *
 * @param {Dependency} dependency
 *
 * @return {Boolean} verification status
 */
Dependency.prototype.has = function (dependency) {
    var me = this;

    return me.dependencies.has(dependency);
};

/**
 * Removes dependent dependency from this one
 *
 * @method remove
 *
 * @param {Dependency} dependency
 *
 * @chainable
 */
Dependency.prototype.remove = function (dependency) {
    var me = this;

    me.dependencies.remove(dependency);

    return me;
};

/**
 * Tries to find lock recursively withing dependency
 *
 * @method getLock
 *
 * @param {xs.core.Collection} [chain] existent lookup chain
 *
 * @return {null|xs.core.Collection} found locked chain or null if nothing found
 */
Dependency.prototype.getLock = function (chain) {
    var me = this;

    //define lock
    var lock = null;

    //lock is looked up for current dependency
    if (!arguments.length) {

        //try to find lock in dependents
        me.dependencies.find(function (dependency) {

            //try to find lock down recursively
            lock = dependency.getLock(new xs.core.Collection([me]));

            //lock is found, return
            return lock;
        });

        //return lookup result - null if nothing found or found chain
        return lock;
    }


    //lock chain is given

    //add this dependency to chain
    chain.add(me);

    //exit case - lock found
    if (me === chain.first()) {

        //return locked chain
        return chain;
    }

    //try to find lock in dependents
    me.dependencies.find(function (dependency) {

        //try to find lock down recursively
        lock = dependency.getLock(chain.clone());

        //lock is found, return
        return lock;
    });

    //return lookup result - null if nothing found or found chain
    return lock;
};