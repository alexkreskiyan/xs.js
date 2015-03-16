'use strict';

var log = new xs.log.Logger('xs.core.DependenciesManager');

var assert = new xs.core.Asserter(log, DependenciesManagerError);

/**
 * Private internal core class.
 *
 * DependenciesManager used to manage contracts' dependencies
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

    var storage = new xs.core.Collection();

    me.add = function (contract, waiting, handleReady) {

        //filter waiting
        waiting = waiting.find(function (contract) {

            return contract.isProcessing;
        }, xs.core.Collection.All);

        if (!waiting.size) {
            xs.nextTick(handleReady);

            return;
        }

        var dependency = getDependency(contract);
        dependency.handleReady = handleReady;

        //add dependencies
        waiting.each(function (contract) {
            dependency.add(getDependency(contract));

            //assert, that no dead lock made
            assert.not(getDeadLock(dependency));
        });
    };

    me.remove = function (contract) {
        var removed = storage.find(function (dependency) {
            return dependency.contract === contract;
        });

        //return if nothing to remove
        if (!removed) {

            return;
        }

        storage.remove(removed);

        var resolved = new xs.core.Collection();

        storage.each(function (dependency) {
            if (dependency.has(removed)) {
                dependency.remove(removed);
                if (!dependency.size) {
                    resolved.add(dependency);
                }
            }
        });

        resolved.each(function (dependency) {
            if (dependency.handleReady) {
                xs.nextTick(dependency.handleReady);
            }
        });
    };

    var getDependency = function (contract) {
        var dependency = storage.find(function (dependency) {

            return dependency.contract === contract;
        });

        if (!dependency) {
            dependency = new Dependency(contract);

            storage.add(dependency);
        }

        return dependency;
    };

    var getDeadLock = function (dependency) {
        var deadLock = dependency.getLock();

        assert.not(deadLock, 'dead lock detected: ' + (deadLock ? showDeadLock(deadLock) : ''));

        return false;
    };

    var showDeadLock = function (deadLock) {
        //self lock
        if (deadLock.size === 2) {
            return 'Contract `' + deadLock[0].contract.label + '` depends on itself';
        }

        //chain lock
        var locked = deadLock.shift().contract.label;
        deadLock.pop();

        var names = deadLock.values().map(function (dependency) {
            return dependency.contract.label;
        });
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