'use strict';

var log = new xs.log.Logger('xs.core.DependenciesManager');

var assert = new xs.core.Asserter(log, DependenciesManagerError);

/**
 * Private internal core class.
 *
 * DependenciesManager used to manage contracts' dependencies
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.core.DependenciesManager
 *
 * @singleton
 */
var DependenciesManager = (function () {
    var me = {};

    /**
     * Internal dependencies manager storage
     *
     * @property storage
     *
     * @type {xs.core.Collection}
     */
    var storage = new xs.core.Collection();

    /**
     * Adds new dependency from given contract to given waited contracts' collection
     *
     * @method add
     *
     * @param {Object|Function} contract dependent contract
     * @param {xs.core.Collection} waiting collection of contracts, given contract waits for
     * @param {Function} handleReady handler, being called as far as waiting dependencies are resolved
     */
    me.add = function (contract, waiting, handleReady) {

        //filter waiting
        waiting = waiting.find(function (contract) {

            return contract.isProcessing;
        }, xs.core.Collection.All);

        //execute handle ready on next tick, if no dependencies
        if (!waiting.size) {
            xs.nextTick(handleReady);

            return;
        }

        //get/create dependency from contract
        var dependency = getDependency(contract);

        //assign handleReady for dependency
        dependency.handleReady = handleReady;

        //add waiting as dependencies for contract dependency
        waiting.each(function (contract) {

            //get/create dependency from contract from waiting collection
            dependency.add(getDependency(contract));

            //assert, that no dead lock made
            assert.not(getDeadLock(dependency));
        });
    };

    /**
     * Removes contract from dependencies manager, because it is prepared
     *
     * @method remove
     *
     * @param {Object|Function} contract removed contract
     */
    me.remove = function (contract) {

        //try to find a dependency for removed contract in internal storage
        var removed = storage.find(function (dependency) {
            return dependency.contract === contract;
        });

        //return if nothing to remove
        if (!removed) {

            return;
        }

        //remove contract dependency from storage
        storage.remove(removed);

        //process internal storage
        storage.each(function (dependency) {

            //if any dependency has removed one as dependent, than
            if (dependency.has(removed)) {

                //remove it from dependent list
                dependency.remove(removed);

                //if removed dependency was last one and handleReady is defined - call handleReady on next tick
                if (!dependency.size && dependency.handleReady) {
                    xs.nextTick(dependency.handleReady);
                }
            }
        });
    };

    /**
     * Gets/creates a dependency for a given contract. Created dependency is stored in internal storage
     *
     * @private
     *
     * @method getDependency
     *
     * @param {Object|Function} contract
     *
     * @returns {Dependency} dependency for given contract
     */
    var getDependency = function (contract) {

        //try to find dependency in storage
        var dependency = storage.find(function (dependency) {

            //dependency match is based on contract reference
            return dependency.contract === contract;
        });

        //if dependency not found
        if (!dependency) {

            //create new Dependency from contract
            dependency = new Dependency(contract);

            //add dependecy to storage
            storage.add(dependency);
        }

        //return dependency
        return dependency;
    };

    /**
     * Returns false, when no deadLock is detected, assert fails otherwise. Coded as a function to make clear production code
     *
     * @private
     *
     * @method getDeadLock
     *
     * @param {Dependency} dependency dependency, tested to have a lock
     *
     * @returns {Boolean} false is returned, saying that dependency has no deadLock
     */
    var getDeadLock = function (dependency) {

        //try to find lock
        var deadLock = dependency.getLock();

        //if lock is found, assert fails with user-friendly lock description
        assert.not(deadLock, 'dead lock detected: ' + (deadLock ? showDeadLock(deadLock) : ''));

        return false;
    };

    /**
     * Internal method, that returns user-friendly message for given deadLock contracts' collection
     *
     * @private
     *
     * @method showDeadLock
     *
     * @param {xs.core.Collection} deadLock
     *
     * @returns {String}
     */
    var showDeadLock = function (deadLock) {

        //self lock case
        if (deadLock.size === 2) {
            return 'Contract `' + deadLock[0].contract.label + '` depends on itself';
        }

        //chain lock case. get locked contract label
        var locked = deadLock.shift().contract.label;

        //remove last contract - it's duplicate
        deadLock.pop();

        //get array of locked contracts' names
        var names = deadLock.values().map(function (dependency) {
            return dependency.contract.label;
        });

        //return deadLock descpription
        return 'Contract `' + locked + '` depends on `' + names.join('`, which depends on `') + '`, which, in it\'s turn, depends on `' + locked + '`';
    };

    return me;
})();

var ReadyManager = (function () {
    var me = {};

    var storage = new xs.core.Collection();

    me.add = function (waiting, handleReady) {

        //assert, that correct params given
        assert.ok(xs.isFunction(waiting) || (xs.isArray(waiting) && xs.isFunction(handleReady)), 'incorrect onReady parameters');

        //if waiting is function - it's handleReady and empty waiting
        if (xs.isFunction(waiting)) {
            handleReady = waiting;
            waiting = null;

            //else - waiting must be array, handleReady - function
        } else {
            waiting = new xs.core.Collection(waiting);
        }

        //waiting: null means, that all classes must be loaded
        if (!waiting) {

            //add item to storage
            storage.add({
                waiting: null,
                handleReady: handleReady
            });

            return;
        }

        //filter waiting
        waiting = waiting.find(function (name) {

            //if contract is not defined - wait
            if (!xs.ContractsManager.has(name)) {

                return true;
            }

            //get contract
            var contract = xs.ContractsManager.get(name);

            //return whether contract is processing
            return contract.isProcessing;
        }, xs.core.Collection.All);

        //add item to storage
        storage.add({
            waiting: waiting,
            handleReady: handleReady
        });
    };

    me.remove = function (processed) {

        //get resolved queue lists. If processed given - with non-null waiting list. If no processed given - with null lists only
        var resolved;
        if (processed === null) {
            resolved = storage.find(function (item) {
                //item is resolved, if waiting list is null

                return item.waiting === null;
            }, xs.core.Collection.All);
        } else {
            resolved = storage.find(function (item) {
                //items with waiting null are not resolved
                if (item.waiting === null) {

                    return false;
                }

                //return false if item waiting doesn't have processed
                if (!item.waiting.has(processed)) {
                    return false;
                }

                //remove processed from item waiting
                item.waiting.remove(processed);

                //item is resolved, if waiting is empty
                return !item.waiting.size;
            }, xs.core.Collection.All);
        }

        //process resolved dependencies to remove them from stack
        resolved.each(function (item) {
            storage.remove(item);
            item.handleReady();
        });
    };

    return me;
})();

//TODO remove
DependenciesManager.ready = ReadyManager.remove;

function Dependency(contract) {
    var me = this;

    me.contract = contract;
    me.dependencies = new xs.core.Collection();
}

Object.defineProperty(Dependency.prototype, 'size', {
    get: function () {
        return this.dependencies.size;
    },
    set: xs.noop
});

Dependency.prototype.add = function (dependency) {
    var me = this;

    me.dependencies.add(dependency);

    return me;
};

Dependency.prototype.has = function (dependency) {
    var me = this;

    return me.dependencies.has(dependency);
};

Dependency.prototype.remove = function (dependency) {
    var me = this;

    me.dependencies.remove(dependency);

    return me;
};

Dependency.prototype.getLock = function (chain) {
    var me = this;

    var lock = null;
    //lock is looked up for current dependency
    if (!arguments.length) {

        me.dependencies.find(function (dependency) {
            lock = dependency.getLock(new xs.core.Collection([me]));

            return lock;
        });

        return lock;
    }


    //lock chain is given

    //add this dependency to chain
    chain.add(me);

    //exit case
    if (me === chain.first()) {

        return chain;
    }

    me.dependencies.find(function (dependency) {
        lock = dependency.getLock(chain.clone());

        return lock;
    });

    return lock;
};

//save DependenciesManager.onReady to xs.onReady
xs.onReady = ReadyManager.add;

/**
 * @ignore
 *
 * Create DependenciesManager references hash for all contracts implemented.
 * When contract is implemented it fetches and removes it's reference from hash. If hash is empty - it is removed
 */
xs.DependenciesManager = {
    Class: DependenciesManager,
    Enum: DependenciesManager,
    Interface: DependenciesManager
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class DependenciesManagerError
 */
function DependenciesManagerError(message) {
    this.message = 'xs.DependenciesManager::' + message;
}

DependenciesManagerError.prototype = new Error();