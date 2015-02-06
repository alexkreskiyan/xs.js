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

    var logger = new xs.log.Logger('xs.core.DependenciesManager');

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

        /**
         * Store of all registered dependencies
         *
         * @private
         *
         * @property storage
         *
         * @type {xs.core.Collection}
         */
        var storage = new xs.core.Collection();

        /**
         * Adds dependency from dependent Class to array of processed Classes.
         * When all processed Classes will be done, handler is called
         *
         * @method add
         *
         * @param {Object} dependent dependent Class
         * @param {xs.core.Collection} waiting collection of processed classes, dependent class is waiting for
         * @param {Function} handleReady callback, called when all waited classes were processed
         */
        me.add = function (dependent, waiting, handleReady) {

            logger.trace('add. Adding dependency for ' + dependent.label + ' from classes', {
                classes: waiting.values().map(function (Class) {
                    return Class.label;
                })
            });

            //filter waiting classes to exclude processed ones
            filterWaitingDependencies(waiting);

            //if empty waiting list - apply handleReady immediately
            if (!waiting.length) {
                logger.trace('add. Filtered list is empty. Handling');
                handleReady();

                return;
            }

            //add dependency to chains
            chains.add(dependent, waiting);

            logger.trace('add. Try to find lock');
            //try to find dead lock
            waiting.each(function (Class) {
                var deadLock = chains.getLock(Class);

                //assert that no deadlock found
                xs.assert.not(deadLock, 'dead lock detected: ' + (deadLock ? showDeadLock(deadLock) : ''), DependenciesManagerError);
            });

            logger.trace('add. No lock found. Adding dependency');
            //save dependency
            storage.add({
                waiting: waiting,
                handleReady: handleReady
            });
        };

        /**
         * Cleans up dependencies and chains after class was processed
         *
         * @method remove
         *
         * @param {Object} processed processed class
         */
        me.remove = function (processed) {
            logger.trace('remove. Resolving dependencies, because ' + processed.label + ' has been processed');
            //remove processed from chains
            chains.remove(processed);

            //get resolved dependencies list
            var resolved = storage.find(function (dependency) {
                if (!dependency.waiting.has(processed)) {
                    return false;
                }

                //remove processed from dependency waiting
                dependency.waiting.remove(processed);

                //dependency is resolved, if waiting is empty
                return !dependency.waiting.length;
            }, xs.core.Collection.All);

            logger.trace('remove. Resolved dependencies', {
                dependencies: resolved.toSource()
            });
            //process resolved dependencies to remove them from stack
            resolved.each(function (dependency) {
                storage.remove(dependency);
                dependency.handleReady();
            });
        };

        /**
         * Filter waiting classes to exclude those ones which are already processed
         *
         * @method filterWaitingDependencies
         *
         * @param {xs.core.Collection} waiting array of waiting classes
         */
        var filterWaitingDependencies = function (waiting) {
            var Class, i = 0;

            logger.trace('filterWaiting. Filtering waiting list', {
                waiting: waiting.values().map(function (Class) {
                    return Class.label;
                })
            });

            //iterate over waiting
            while (i < waiting.length) {

                //get Class reference at i position
                Class = waiting.at(i);

                //if class is processing - go to next
                if (Class.isProcessing) {
                    i++;
                    continue;
                }

                //Class is processed - remove it class from waiting
                logger.trace('filterWaiting. Class ' + Class.label + ' is already processed, removing it from waiting');
                waiting.removeAt(i);
            }
            logger.trace('filterWaiting. Filtered list', {
                filtered: waiting.values().map(function (Class) {
                    return Class.label;
                })
            });
        };

        /**
         * Return deadLock string representation
         *
         * @method showDeadLock
         *
         * @param {xs.core.Collection} deadLock dead lock
         *
         * @return {String} deadLock string representation
         */
        var showDeadLock = function (deadLock) {
            //self lock
            if (deadLock.length === 1) {
                return 'Class "' + deadLock[0].label + '" imports itself';
            }

            //chain lock
            var first = deadLock.shift();
            var names = deadLock.values().map(function (Class) {
                return Class.label;
            });
            return 'Class "' + first.label + '" imports "' + names.join('", which imports "') + '", which, in it\'s turn, imports "' + first.label + '"';
        };

        /**
         * Private dependencies chains manager
         *
         * It's aim is storing of cross-classes dependencies chains
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @private
         *
         * @class DependenciesManager.chains
         */
        var chains = (function () {
            var me = {};

            /**
             * Store of all registered dependencies
             *
             * @private
             *
             * @property storage
             *
             * @type {xs.core.Collection}
             */
            var storage = new xs.core.Collection();

            /**
             * Adds dependent class with it waiting list to manager
             *
             * @method add
             *
             * @param {Object} dependent dependent class
             * @param {xs.core.Collection} waiting waiting classes list
             */
            me.add = function (dependent, waiting) {

                logger.trace('chains::add. Adding dependency chain for ' + dependent.label + ' from classes', {
                    classes: waiting.values().map(function (Class) {
                        return Class.label;
                    })
                });
                //get existing chains, where dependent class was in waiting list
                var chains = getChains(dependent, true);

                logger.trace('chains::add. Work chains:');
                chains.each(function (chain) {
                    logger.trace('chains::add.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });

                //if working chains found - split each to include waiting
                if (chains.length) {
                    logger.trace('chains::add. Work chains exist. Updating...');
                    //init updated chains list
                    var updated = new xs.core.Collection();

                    //get updated chains
                    chains.each(function (chain) {
                        updateChains(chain, waiting).each(function (chain) {
                            updated.add(chain);
                        });
                    });

                    //add updated chains to storage
                    updated.each(function (chain) {
                        storage.add(chain);
                    });

                    //else - create chain for each waiting
                } else {
                    logger.trace('chains::add. No work chains found. Creating...');

                    //add created chains to storage
                    createChains(dependent, waiting).each(function (chain) {
                        storage.add(chain);
                    });
                }

                logger.trace('chains::add. Chains after add:');
                storage.each(function (chain) {
                    logger.trace('chains::add.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });
            };

            /**
             * Deletes processed class from all chains
             *
             * @method remove
             *
             * @param {Object} processed processed class
             */
            me.remove = function (processed) {

                logger.trace('chains::remove. ' + processed.label + ' resolved');

                //get work chains, that contain processed class
                var chains = getChains(processed);
                logger.trace('chains::remove. Work chains:');
                chains.each(function (chain) {
                    logger.trace('chains::remove.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });

                //remove processed class from each work chain
                chains.each(function (chain) {
                    //if chain is more than 2 items long - remove item from it
                    if (chain.length > 2) {
                        chain.remove(processed);

                        //else - remove chain from storage
                    } else {
                        storage.remove(chain);
                    }
                });
                logger.trace('chains::remove. Chains left:');
                storage.each(function (chain) {
                    logger.trace('chains::remove.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });
            };

            /**
             * Tries to find dead locks, that may occur if added dependency from dependent class to waiting one
             *
             * @method getLock
             *
             * @param {Object} dependent dependent class
             *
             * @return {Object[]} first found dead lock
             */
            me.getLock = function (dependent) {
                logger.trace('chains::getLock. Get lock for ' + dependent.label);
                //first and last dependent occurrences indexes
                var first = 0, last = 0;

                //try to find locked chain
                var lockedChain = storage.find(function (chain) {

                    //first occurrence key
                    first = chain.keyOf(dependent);

                    //last occurrence key
                    last = chain.keyOf(dependent, xs.core.Collection.Reverse);

                    return first !== last;
                });

                //if locked chain found - return locked subset
                return lockedChain ? new xs.core.Collection(lockedChain.values().slice(first, last)) : undefined;
            };

            /**
             * Gets working chains list
             *
             * @method getChains
             *
             * @param {Object} dependent dependent class
             * @param {Boolean} [lastOnly] whether to look for dependent class at the chain last entry only
             *
             * @return {Array} found working chains
             */
            var getChains = function (dependent, lastOnly) {
                if (lastOnly) {

                    return storage.find(function (chain) {
                        return chain.last() === dependent;
                    }, xs.core.Collection.All);
                }

                return storage.find(function (chain) {
                    return chain.has(dependent);
                }, xs.core.Collection.All);
            };

            /**
             * Creates chains with given dependent and waiting classes
             *
             * @method createChains
             *
             * @param {Object} dependent dependent class
             * @param {xs.core.Collection} waiting waiting classes
             *
             * @return {xs.core.Collection} created chains
             */
            var createChains = function (dependent, waiting) {
                //init created chains list
                var created = new xs.core.Collection();

                //create chain for each waiting
                waiting.each(function (Class) {
                    //init empty chain
                    var chain = new xs.core.Collection([
                        dependent,
                        Class
                    ]);

                    logger.trace('chains::createChains. Try to find merges for:');
                    logger.trace('chains::createChains. [' + dependent.label + ']->' + Class.label);
                    //get merged chains
                    var merged = getMergedChains(chain);

                    //if any merged chains - add them to storage
                    if (merged.length) {
                        logger.trace('chains::createChains. Adding merged:');
                        merged.each(function (chain) {
                            logger.trace('chains::createChains.', {
                                chain: chain.values().map(function (Class) {
                                    return Class.label;
                                })
                            });
                        });
                        merged.each(function (chain) {
                            created.add(chain);
                        });

                        //else - add chain
                    } else {
                        logger.trace('chains::createChains. Adding single:');
                        logger.trace('chains::createChains.', {
                            chain: chain.values().map(function (Class) {
                                return Class.label;
                            })
                        });
                        created.add(chain);
                    }
                });

                logger.trace('chains::createChains. ' + dependent.label + ' created chains:');
                created.each(function (chain) {
                    logger.trace('chains::createChains.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });

                //return created chains array
                return created;
            };

            /**
             * Updates chain with each class in waiting
             *
             * @method updateChains
             *
             * @param {xs.core.Collection} chain
             * @param {xs.core.Collection} waiting
             */
            var updateChains = function (chain, waiting) {
                //init updated chains list
                var updated = new xs.core.Collection();

                //remove chain from storage
                storage.remove(chain);

                //for each waiting class add it chain copy
                waiting.each(function (Class) {

                    //create copy of chain
                    var copy = chain.clone();

                    //add Class to chain
                    copy.add(Class);

                    logger.trace('chains::updateChains. Try to find merges for:');
                    logger.trace('chains::updateChains.chains->' + Class.label, {
                        chains: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                    //get merged chains
                    var merged = getMergedChains(copy);

                    //if any merged chains - add them to storage
                    if (merged.length) {
                        logger.trace('chains::updateChains. Adding merged:');
                        merged.each(function (chain) {
                            logger.trace('chains::updateChains.', {
                                chain: chain.values().map(function (Class) {
                                    return Class.label;
                                })
                            });
                        });
                        merged.each(function (chain) {
                            updated.add(chain);
                        });

                        //else - add chain
                    } else {
                        logger.trace('chains::updateChains. Adding single:');
                        logger.trace('chains::updateChains.', {
                            chain: copy.values().map(function (Class) {
                                return Class.label;
                            })
                        });
                        updated.add(copy);
                    }
                });

                //get junction
                var junction = chain.last();
                logger.trace('chains::updateChains. ' + junction.label + ' updated chains:');
                updated.each(function (chain) {
                    logger.trace('chains::updateChains.', {
                        chain: chain.values().map(function (Class) {
                            return Class.label;
                        })
                    });
                });

                //return updated chains array
                return updated;
            };

            /**
             * Returns copies of given chains, merged with tail of each chain in storage, where last item of given chain exists
             *
             * @method getMergedChains
             *
             * @param {xs.core.Collection} chain raw merged chain
             *
             * @return {xs.core.Collection} merged chains array
             */
            var getMergedChains = function (chain) {

                logger.trace('chains::getMergedChains. For chain', {
                    chain: chain.values().map(function (Class) {
                        return Class.label;
                    })
                });
                //init merged array
                var merged = new xs.core.Collection();

                //get junction
                var junction = chain.last();
                logger.trace('chains::getMergedChains. Junction ' + junction.label);

                //get work chains for junction
                var chains = getChains(junction);

                //merge if any chains found
                if (chains.length) {
                    logger.trace('chains::getMergedChains. Merging...');
                    //fill merged list
                    chains.each(function (source) {
                        //get sliced part
                        var items = source.values();
                        var slice = new xs.core.Collection(items.slice(items.indexOf(junction) + 1));

                        //get merge
                        var merge = source.clone();
                        slice.each(function (item) {
                            merge.add(item);
                        });

                        logger.trace('chains::getMergedChains. Source', {
                            source: source.values().map(function (Class) {
                                return Class.label;
                            })
                        });

                        logger.trace('chains::getMergedChains. Slice', {
                            slice: slice.values().map(function (Class) {
                                return Class.label;
                            })
                        });

                        logger.trace('chains::getMergedChains. Merge', {
                            merge: merge.values().map(function (Class) {
                                return Class.label;
                            })
                        });

                        //push merged to list
                        merged.add(merge);
                    });
                } else {
                    logger.trace('chains::getMergedChains. Nothing to merge with');
                }

                return merged;
            };

            return me;
        })();

        /**
         * Private onReady manager with simplified public interface
         *
         * It's aim is storing of cross-classes processing dependencies.
         * Using dependencies manager allows to prevent dead locks and regulate classes processing
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @private
         *
         * @class DependenciesManager.queue
         */
        var queue = (function () {
            var me = {};

            /**
             * Store of all registered dependencies
             *
             * @private
             *
             * @property storage
             *
             * @type {xs.core.Collection}
             */
            var storage = new xs.core.Collection();

            /**
             * Adds handler for event when classes' with given names will be loaded
             *
             * @method add
             *
             * @param {String[]} [waiting] waiting list. If empty - handler will be called when all pending classes will be loaded
             * @param {Function} handleReady onReady handler
             */
            me.add = function (waiting, handleReady) {

                //assert, that correct params given
                xs.assert.ok(xs.isFunction(waiting) || (xs.isArray(waiting) && xs.isFunction(handleReady)), 'incorrect onReady parameters', DependenciesManagerError);

                //if waiting is function - it's handleReady and empty waiting
                if (xs.isFunction(waiting)) {
                    handleReady = waiting;
                    waiting = null;

                    //else - waiting must be array, handleReady - function
                } else {
                    waiting = new xs.core.Collection(waiting);
                }

                logger.trace('queue::add. Waiting', {
                    waiting: waiting ? waiting.values() : waiting
                });
                //waiting: null means, that all classes must be loaded
                if (!waiting) {

                    logger.trace('queue::add. Waiting is empty. Wait for all');
                    //add item to storage
                    storage.add({
                        waiting: null,
                        handleReady: handleReady
                    });

                    return;
                }

                logger.trace('queue::add. Waiting is not empty - filter');
                //filter waiting classes
                filterWaitingClasses(waiting);

                logger.trace('queue::add. Wait for filtered:', {
                    waiting: waiting.values()
                });
                //add item to storage
                storage.add({
                    waiting: waiting,
                    handleReady: handleReady
                });
            };

            /**
             * Deletes given class name from all waiting lists. If processed is null - all pending classes are loaded. Call specific all ready handler
             *
             * @method remove
             *
             * @param {String|Null} processed name of processed class or null if all classes processed
             */
            me.remove = function (processed) {
                logger.trace('queue::remove. Resolve ' + processed);
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
                        return !item.waiting.length;
                    }, xs.core.Collection.All);
                }

                logger.trace('queue::remove. Resolved', {
                    resolved: resolved.toSource()
                });
                //process resolved dependencies to remove them from stack
                resolved.each(function (item) {
                    storage.remove(item);
                    item.handleReady();
                });
            };

            /**
             * Filter waiting classes to exclude those ones which are already processed
             *
             * @method filterWaitingClasses
             *
             * @param {xs.core.Collection} waiting collection of waiting classes' names
             */
            var filterWaitingClasses = function (waiting) {
                var i = 0, Class, name;

                //iterate over waiting
                while (i < waiting.length) {
                    name = waiting.at(i);

                    //go to next if class is not registered
                    if (!xs.ContractsManager.has(name)) {
                        i++;
                        continue;
                    }

                    //get class
                    Class = xs.ContractsManager.get(name);

                    //if class is processing - go to next
                    if (Class.isProcessing) {
                        i++;
                        continue;
                    }

                    //Class exists and is processed - remove class from waiting
                    waiting.removeAt(i);
                }
            };

            return me;
        })();

        me.onReady = queue.add;
        me.ready = queue.remove;

        return me;
    })();

    //save DependenciesManager.onReady to xs.onReady
    xs.onReady = DependenciesManager.onReady;

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
})(window, 'xs');