'use strict';

var log = new xs.log.Logger('xs.core.DependenciesManager');

var assert = new xs.core.Asserter(log, XsCoreDependenciesManagerError);

/**
 * Private internal core class.
 *
 * ReadyManager is used to manage external dependencies on contracts
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.core.ReadyManager
 *
 * @singleton
 */
var ReadyManager = (function () {
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
     * Adds new dependency from contracts with given names or simply when all contracts are processed
     *
     * @method add
     *
     * @param {String[]} [waiting] optional array with names of waited contracts
     * @param {Function} handleReady handler, being called as far as waiting dependencies are resolved
     */
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

            //assert, that name is correct
            assert.ok(xs.ContractsManager.isName(name), 'Given name `$name` is not a valid contract name', {
                $name: name
            });

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

    /**
     * Removes processed contract from ready manager
     *
     * @method remove
     *
     * @param {String|Null} contract removed contract label
     */
    me.remove = function (contract) {

        //get resolved queue lists. If processed given - with non-null waiting list. If no processed given - with null lists only
        var resolved;
        if (contract === null) {
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
                if (!item.waiting.has(contract)) {
                    return false;
                }

                //remove processed from item waiting
                item.waiting.remove(contract);

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

//save ReadyManager reference
module.ReadyManager = ReadyManager;

//save DependenciesManager.onReady to xs.onReady
xs.onReady = ReadyManager.add;

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreDependenciesManagerError
 */
function XsCoreDependenciesManagerError(message) {
    this.message = 'xs.DependenciesManager::' + message;
}

XsCoreDependenciesManagerError.prototype = new Error();