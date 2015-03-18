'use strict';

/**
 * Private internal core class. Aggregates DependenciesManager and
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class ProcessingList
 *
 * @singleton
 */
module.ProcessingList = (function (dependencies, ready) {
    var me = {};

    /**
     * Internal processing contracts queue
     *
     * @property storage
     *
     * @type {xs.core.Collection}
     */
    var storage = new xs.core.Collection();

    /**
     * Adds new processing contract
     *
     * @method add
     *
     * @param {Object|Function} contract
     */
    me.add = function (contract) {

        //add contract to storage
        storage.add(contract);

        //add isProcessing mark
        contract.isProcessing = true;
    };

    /**
     * Removes contract from storage
     *
     * @method remove
     *
     * @param {Object|Function} contract removed contract
     */
    me.remove = function (contract) {

        //remove isProcessing mark
        delete contract.isProcessing;

        //remove contract from storage
        storage.remove(contract);

        //remove from dependencies
        dependencies.remove(contract);

        //notify, that contract is ready
        ready.remove(contract.label);

        //if storage empty - notify
        if (!storage.size) {

            //notify, that all ready
            ready.remove(null);
        }
    };

    return me;
})(module.DependenciesManager, module.ReadyManager);