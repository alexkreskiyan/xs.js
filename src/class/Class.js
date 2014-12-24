/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.Class is core class, that is used for class generation.
     *
     * xs.Class provides 2 stacks to register processors:
     *
     * - {@link xs.Class#preprocessors preprocessors}
     * - {@link xs.Class#postprocessors postprocessors}
     *
     * Usage example:
     *
     *     //create simple Class
     *     var Class = xs.Class.create(function (Class) {
     *         //here is Class descriptor returned
     *         return {
     *         };
     *     });
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.Class
     *
     * @singleton
     */
    xs.Class = new (function (dependencies, queue) {
        var me = this;

        /**
         * Stack of processors, processing class before it's considered to be created (before createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * For handler:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * @property preprocessors
         *
         * @type {xs.Class.Stack}
         */
        var preprocessors = me.preprocessors = new Stack();

        /**
         * Stack of processors, processing class after it's considered to be created (after createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * For handler:
         *
         *  - Class
         *  - descriptor
         *  - namespace
         *
         * @property postprocessors
         *
         * @type {xs.Class.Stack}
         */
        var postprocessors = me.postprocessors = new Stack();

        /**
         * Currently processing classes' list
         *
         * @ignore
         *
         * @property processing
         *
         * @type {xs.core.Collection}
         */
        var processing = new xs.core.Collection;

        //save queue add method as xs.Class.onReady
        me.onReady = queue.add;

        /**
         * Creates class sample and starts processors applying
         *
         * For example:
         *
         *     //create simple Class
         *     var Class = xs.Class.create(function (self, ns) {
         *         //here is Class descriptor returned
         *         return {
         *         };
         *     }, function(Class) {
         *         console.log('class', Class, 'created');
         *     );
         *
         * @method create
         *
         * @param {Function} Descriptor descriptor constructor. Creates raw descriptor instance. Is called with 3 params:
         *
         * - self. Created class instance
         * - ns. namespace object, where namespace references are placed
         * - imports. namespace object, where namespace references are placed
         *
         * @param {Function} [createdFn] class creation callback. Is called after
         * {@link xs.Class#preprocessors preprocessors} stack is processed. When called, created class is passed as param
         *
         * @return {Function} created Class
         *
         * @throws {Error} Error is thrown, when:
         *
         * - descFn is given not as function
         * - descFn doesn't return object
         */
        me.create = function (Descriptor, createdFn) {

            //Descriptor must be function
            if (!xs.isFunction(Descriptor)) {
                throw new ClassError('descriptor must be evaluated function');
            }

            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create class
            var Class = _create();

            //assign factory for class
            Class.factory = _createFactory(Class);

            //get namespace for Class
            var namespace = Class.namespace = {};

            //get imports for Class
            var imports = Class.imports = {};

            //Fill descriptor prototype
            Descriptor.prototype = _createDescriptorPrototype();

            //get descriptor instance
            var descriptor = new Descriptor(Class, namespace, imports);
            //convert descriptor
            _convertDescriptor(descriptor);

            //save Class descriptor
            var emptyDescriptor = _createDescriptorPrototype();
            _convertDescriptor(emptyDescriptor);
            xs.constant(Class, 'descriptor', emptyDescriptor);

            //mark class as not ready yet (until preprocessors done)
            Class.isProcessing = true;

            //push class to processed list
            processing.add(Class);

            //process preprocessors stack before createdFn called.
            //Normally, only namespace is processed on this tick - imports is unambiguously async
            preprocessors.process([
                Class,
                descriptor,
                namespace
            ], [
                Class,
                descriptor,
                namespace,
                dependencies
            ], function () {
                //remove isProcessing mark
                delete Class.isProcessing;

                //remove class from processing list
                processing.remove(Class);

                //remove from dependencies
                dependencies.remove(Class);

                //remove from queue
                queue.remove(Class.label);

                //if dependencies empty - all classes processed
                if (!processing.length) {

                    //remove from queue
                    queue.remove(null);
                }

                //call createdFn
                createdFn(Class);

                //process postprocessors stack after createdFn called
                postprocessors.process([
                    Class,
                    descriptor,
                    namespace
                ], [
                    Class,
                    descriptor,
                    namespace
                ]);
            });

            return Class;
        };

        /**
         * Returns new xClass sample
         *
         * @ignore
         *
         * @method create
         *
         * @return {Function} new xClass
         */
        var _create = function () {
            var Class = function xClass() {
                var me = this;

                //define class constructor
                var descriptor = Class.descriptor;


                //singleton processing

                //throw exception if Class is singleton
                if (descriptor.singleton) {
                    throw new ClassError('can not create instance of singleton class');
                }

                //get constructor shortcut
                var constructor = descriptor.constructor != Object ? descriptor.constructor : undefined;

                //if parent constructor - just call it
                if (me.self && me.self !== Class) {
                    constructor && constructor.apply(me, arguments);

                    return;
                }


                //save call arguments
                me.initArguments = arguments;

                //properties processing

                //init privates storage
                me.privates = {};

                //assign values
                var properties = descriptor.properties.items; //xs.core.Collection
                var i, length = properties.length, item;

                for (i = 0; i < length; i++) {
                    item = properties[i];
                    item.value.hasOwnProperty('value') && (me[item.key] = item.value.value);
                }

                //native constructor call

                //save class reference
                me.self = Class;

                //apply constructor
                constructor && constructor.apply(me, arguments);
            };

            return Class;
        };

        /**
         * Returns factory for given Class
         *
         * @ignore
         *
         * @method createFactory
         *
         * @param {Function} Class
         *
         * @return {Function} factory for given Class
         */
        var _createFactory = function (Class) {
            //this - current class
            //arguments - new instance arguments

            //create wrapper
            var xClass = function (args) {
                return Class.apply(this, args);
            };

            //assign prototype
            xClass.prototype = Class.prototype;

            //return factory
            return function () {

                //return instance
                return new xClass(arguments);
            };
        };

        /**
         * Returns prototype for descriptor function
         *
         * @ignore
         *
         * @method createDescriptorPrototype
         *
         * @return {Object} new descriptor prototype
         */
        var _createDescriptorPrototype = function () {
            return {

                //class namespace
                namespace: undefined,

                //class imports list
                imports: [],

                //class parent
                extends: undefined,

                //class mixins list
                mixins: {},

                //class implements list
                implements: {},

                //class singleton flag
                singleton: undefined,

                //class interface flag
                interface: undefined,

                //class constants list
                constants: {},

                //class statics list
                static: {
                    //class static methods list
                    methods: {},

                    //class static properties list
                    properties: {}
                },

                //class constructor
                constructor: undefined,

                //class methods list
                methods: {},

                //class properties list
                properties: {}
            };
        };

        /**
         * Converts prototype to use xs.core.Collection
         *
         * @ignore
         *
         * @method convertDescriptor
         *
         * @return {Object} convert descriptor
         */
        var _convertDescriptor = function (descriptor) {
            descriptor.imports = new xs.core.Collection(descriptor.imports);
            descriptor.mixins = new xs.core.Collection(descriptor.mixins);
            descriptor.implements = new xs.core.Collection(descriptor.implements);
            descriptor.constants = new xs.core.Collection(descriptor.constants);
            descriptor.static.methods = new xs.core.Collection(descriptor.static.methods);
            descriptor.static.properties = new xs.core.Collection(descriptor.static.properties);
            descriptor.methods = new xs.core.Collection(descriptor.methods);
            descriptor.properties = new xs.core.Collection(descriptor.properties);
        };

        /**
         * Private dependencies manager
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
         * @class dependencies
         */
    })(new (function () {
        var me = this;

        /**
         * Store of all registered dependencies
         *
         * @private
         *
         * @property storage
         *
         * @type {xs.core.Collection}
         */
        var storage = new xs.core.Collection;

        /**
         * Adds dependency from dependent Class to array of processed Classes.
         * When all processed Classes will be done, handler is called
         *
         * @method add
         *
         * @param {Object} dependent dependent Class
         * @param {xs.core.Collection} waiting collection of processed classes, dependent class is waiting for
         * @param {Function} handleReady callback, called when all waited classes were processed
         *
         * @throws {Error} Error is thrown, when:
         *
         * - deadLock is detected
         */
        me.add = function (dependent, waiting, handleReady) {

            xs.log('xs.Class::dependencies::add. Adding dependency for', dependent.label, 'from', waiting.values().map(function (Class) {
                return Class.label;
            }));
            //filter waiting classes to exclude processed ones
            _filterWaiting(waiting);

            //if empty waiting list - apply handleReady immediately
            if (!waiting.length) {
                xs.log('xs.Class::dependencies::add. Filtered list is empty. Handling');
                handleReady();

                return;
            }

            //add dependency to chains
            chains.add(dependent, waiting);

            xs.log('xs.Class::dependencies::add. Try to find lock');
            //try to find dead lock
            waiting.each(function (Class) {
                var deadLock = chains.getLock(Class);

                //throw respective ClassError if dead lock found
                if (deadLock) {
                    xs.log('xs.Class::dependencies::add. Lock detected');
                    throw new ClassError('dead lock detected: ' + _showDeadLock(deadLock));
                }
            });

            xs.log('xs.Class::dependencies::add. No lock found. Adding dependency');
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
            xs.log('xs.Class::dependencies::remove. Resolving dependencies, because', processed.label, 'has been processed');
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
            }, xs.core.Collection.ALL);

            xs.log('xs.Class::dependencies::remove. Resolved dependencies', resolved.toSource());
            //process resolved dependencies to remove them from stack
            resolved.each(function (dependency) {
                storage.remove(dependency);
                dependency.handleReady();
            });
        };

        /**
         * Filter waiting classes to exclude those ones which are already processed
         *
         * @method filterWaiting
         *
         * @param {xs.core.Collection} waiting array of waiting classes
         */
        var _filterWaiting = function (waiting) {
            var Class, i = 0;

            xs.log('xs.Class::dependencies::filterWaiting. Filtering list:', waiting.values().map(function (Class) {
                return Class.label;
            }));

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
                xs.log('xs.Class::dependencies::filterWaiting. Class:', Class.label, 'is already processed, removing it from waiting');
                waiting.removeAt(i);
            }
            xs.log('xs.Class::dependencies::filterWaiting. Filtered list:', waiting.values().map(function (Class) {
                return Class.label;
            }));
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
        var _showDeadLock = function (deadLock) {
            //self lock
            if (deadLock.length == 1) {
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
         * @class dependencies.chains
         */
        var chains = new (function () {
            var me = this;

            /**
             * Store of all registered dependencies
             *
             * @private
             *
             * @property storage
             *
             * @type {xs.core.Collection}
             */
            var storage = new xs.core.Collection;

            /**
             * Adds dependent class with it waiting list to manager
             *
             * @method add
             *
             * @param {Object} dependent dependent class
             * @param {xs.core.Collection} waiting waiting classes list
             */
            me.add = function (dependent, waiting) {

                xs.log('xs.Class::dependencies::chains::add. Adding dependency chain for', dependent.label, 'from', waiting.values().map(function (Class) {
                    return Class.label;
                }));
                //get existing chains, where dependent class was in waiting list
                var chains = _getChains(dependent, true);

                xs.log('xs.Class::dependencies::chains::add. Work chains:');
                chains.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::add.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
                });

                //if working chains found - split each to include waiting
                if (chains.length) {
                    xs.log('xs.Class::dependencies::chains::add. Work chains exist. Updating...');
                    //init updated chains list
                    var updated = new xs.core.Collection;

                    //get updated chains
                    chains.each(function (chain) {
                        _updateChains(chain, waiting).each(function (chain) {
                            updated.add(chain);
                        });
                    });

                    //add updated chains to storage
                    updated.each(function (chain) {
                        storage.add(chain);
                    });

                    //else - create chain for each waiting
                } else {
                    xs.log('xs.Class::dependencies::chains::add. No work chains found. Creating...');

                    //add created chains to storage
                    _createChains(dependent, waiting).each(function (chain) {
                        storage.add(chain);
                    });
                }

                xs.log('xs.Class::dependencies::chains::add. Chains after add:');
                storage.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::add.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
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

                xs.log('xs.Class::dependencies::chains::remove.', processed.label, 'resolved');

                //get work chains, that contain processed class
                var chains = _getChains(processed);
                xs.log('xs.Class::dependencies::chains::remove. Work chains:');
                chains.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::remove.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
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
                xs.log('xs.Class::dependencies::chains::remove. Chains left:');
                storage.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::remove.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
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
                xs.log('xs.Class::dependencies::chains::getLock. Get lock for', dependent.label);
                //first and last dependent occurrences indexes
                var first = 0, last = 0;

                //try to find locked chain
                var lockedChain = storage.find(function (chain) {

                    //first occurrence key
                    first = chain.keyOf(dependent);

                    //last occurrence key
                    last = chain.keyOf(dependent, xs.core.Collection.REVERSE);

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
            var _getChains = function (dependent, lastOnly) {
                if (lastOnly) {

                    return storage.find(function (chain) {
                        return chain.last() === dependent;
                    }, xs.core.Collection.ALL);
                }

                return storage.find(function (chain) {
                    return chain.has(dependent);
                }, xs.core.Collection.ALL);
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
            var _createChains = function (dependent, waiting) {
                //init created chains list
                var created = new xs.core.Collection;

                //create chain for each waiting
                waiting.each(function (Class) {
                    //init empty chain
                    var chain = new xs.core.Collection([
                        dependent,
                        Class
                    ]);

                    xs.log('xs.Class::dependencies::chains::createChains. Try to find merges for:');
                    xs.log('xs.Class::dependencies::chains::createChains.', [dependent.label], '->', Class.label);
                    //get merged chains
                    var merged = _getMergedChains(chain);

                    //if any merged chains - add them to storage
                    if (merged.length) {
                        xs.log('xs.Class::dependencies::chains::createChains. Adding merged:');
                        merged.each(function (chain) {
                            xs.log('xs.Class::dependencies::chains::createChains.', chain.values().map(function (Class) {
                                return Class.label;
                            }));
                        });
                        merged.each(function (chain) {
                            created.add(chain);
                        });

                        //else - add chain
                    } else {
                        xs.log('xs.Class::dependencies::chains::createChains. Adding single:');
                        xs.log('xs.Class::dependencies::chains::createChains.', chain.values().map(function (Class) {
                            return Class.label;
                        }));
                        created.add(chain);
                    }
                });

                xs.log('xs.Class::dependencies::chains::createChains. ', dependent.label, ' created chains:');
                created.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::createChains.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
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
            var _updateChains = function (chain, waiting) {
                //init updated chains list
                var updated = new xs.core.Collection;

                //remove chain from storage
                storage.remove(chain);

                //for each waiting class add it chain copy
                waiting.each(function (Class) {

                    //create copy of chain
                    var copy = chain.clone();

                    //add Class to chain
                    copy.add(Class);

                    xs.log('xs.Class::dependencies::chains::updateChains. Try to find merges for:');
                    xs.log('xs.Class::dependencies::chains::updateChains.', chain.values().map(function (Class) {
                        return Class.label;
                    }), '->', Class.label);
                    //get merged chains
                    var merged = _getMergedChains(copy);

                    //if any merged chains - add them to storage
                    if (merged.length) {
                        xs.log('xs.Class::dependencies::chains::updateChains. Adding merged:');
                        merged.each(function (chain) {
                            xs.log('xs.Class::dependencies::chains::updateChains.', chain.values().map(function (Class) {
                                return Class.label;
                            }));
                        });
                        merged.each(function (chain) {
                            updated.add(chain);
                        });

                        //else - add chain
                    } else {
                        xs.log('xs.Class::dependencies::chains::updateChains. Adding single:');
                        xs.log('xs.Class::dependencies::chains::updateChains.', copy.values().map(function (Class) {
                            return Class.label;
                        }));
                        updated.add(copy);
                    }
                });

                //get junction
                var junction = chain.last();
                xs.log('xs.Class::dependencies::chains::updateChains. ', junction.label, ' updated chains:');
                updated.each(function (chain) {
                    xs.log('xs.Class::dependencies::chains::updateChains.', chain.values().map(function (Class) {
                        return Class.label;
                    }));
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
            var _getMergedChains = function (chain) {

                xs.log('xs.Class::dependencies::chains::getMergedChains. For ', chain.values().map(function (Class) {
                    return Class.label;
                }));
                //init merged array
                var merged = new xs.core.Collection;

                //get junction
                var junction = chain.last();
                xs.log('xs.Class::dependencies::chains::getMergedChains. Junction: ', junction.label);

                //get work chains for junction
                var chains = _getChains(junction);

                //merge if any chains found
                if (chains.length) {
                    xs.log('xs.Class::dependencies::chains::getMergedChains. Merging...');
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

                        xs.log('xs.Class::dependencies::chains::getMergedChains. Source:', source.values().map(function (Class) {
                            return Class.label;
                        }));

                        xs.log('xs.Class::dependencies::chains::getMergedChains. Slice:', slice.values().map(function (Class) {
                            return Class.label;
                        }));

                        xs.log('xs.Class::dependencies::chains::getMergedChains. Merge:', merge.values().map(function (Class) {
                            return Class.label;
                        }));

                        //push merged to list
                        merged.add(merge);
                    });
                } else {
                    xs.log('xs.Class::dependencies::chains::getMergedChains. Nothing to merge with');
                }

                return merged;
            };
        });

        /**
         * Public onReady manager
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
         * @class dependencies
         */
    }), new (function () {
        var me = this;

        /**
         * Store of all registered dependencies
         *
         * @private
         *
         * @property storage
         *
         * @type {xs.core.Collection}
         */
        var storage = new xs.core.Collection;

        /**
         * Adds handler for event when classes' with given names will be loaded
         *
         * @method add
         *
         * @param {String[]} [waiting] waiting list. If empty - handler will be called when all pending classes will be loaded
         * @param {Function} handleReady onReady handler
         *
         * @throws {Error} Error is thrown, when:
         *
         * - incorrect params given
         */
        me.add = function (waiting, handleReady) {
            //if waiting if function - it's handleReady and empty waiting
            if (xs.isFunction(waiting)) {
                handleReady = waiting;
                waiting = null;

                //else - waiting must be array, handleReady - function
            } else if (xs.isArray(waiting) && xs.isFunction(handleReady)) {
                waiting = new xs.core.Collection(waiting);
                //otherwise - it's error
            } else {
                throw new ClassError('incorrect onReady parameters');
            }

            xs.log('xs.Class::queue::add. Waiting', waiting.values());
            //waiting: null means, that all classes must be loaded
            if (!waiting) {

                xs.log('xs.Class::queue::add. Waiting is empty. Wait for all');
                //add item to storage
                storage.add({
                    waiting: null,
                    handleReady: handleReady
                });

                return;
            }

            xs.log('xs.Class::queue::add. Waiting is not empty - filter');
            //filter waiting classes
            _filterWaiting(waiting);

            xs.log('xs.Class::queue::add. Wait for filtered:', waiting.values());
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
            xs.log('xs.Class::queue::remove. Resolve:', processed);
            //get resolved queue lists. If processed given - with non-null waiting list. If no processed given - with null lists only
            var resolved;
            if (processed === null) {
                resolved = storage.find(function (item) {
                    //item is resolved, if waiting list is null

                    return item.waiting === null;
                }, xs.core.Collection.ALL);
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
                }, xs.core.Collection.ALL);
            }

            xs.log('xs.Class::queue::remove. Resolved items', resolved.toSource());
            //process resolved dependencies to remove them from stack
            resolved.each(function (item) {
                storage.remove(item);
                item.handleReady();
            });
        };

        /**
         * Filter waiting classes to exclude those ones which are already processed
         *
         * @method filterWaiting
         *
         * @param {xs.core.Collection} waiting collection of waiting classes' names
         */
        var _filterWaiting = function (waiting) {
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
    }));

    //move xs.Class.onReady as xs.onReady
    xs.onReady = xs.Class.onReady;
    delete xs.Class.onReady;

    //define prototype of xs.Base
    xs.Base = xs.SuperBase = xs.Class.create(function () {
    }, xs.emptyFn);

    /**
     * Private internal stack class
     *
     * Stack is used to store ordered list of processors
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.Class.Stack
     */
    function Stack() {
        var me = this;

        //items hash
        var items = new xs.core.Collection;

        /**
         * Returns stack items copy
         *
         * @method get
         *
         * @return {xs.core.Collection} stack items clone
         */
        me.get = function () {

            return items.clone();
        };

        /**
         * Adds new processor to stack
         *
         * For example:
         *
         *     stack.add('addY', function() {
         *         return true;
         *     }, function() {
         *        this.x = 0;
         *     }, 'after', 'addY')
         *
         * @method add
         *
         * @param {String} name processor name
         * @param {Function} verifier processor verifier.
         * Returns boolean whether processor should be applied to Class. Accepts class descriptor as param
         * @param {Function} handler processor body
         * @param {String} [position] position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * By default, last is used
         * @param {String} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         *
         * @throws {Error} Error is thrown, when:
         *
         * - processor with given name is already in stack
         */
        me.add = function (name, verifier, handler, position, relativeTo) {
            //position defaults to last
            position || (position = 'last');

            if (items.hasKey(name)) {
                throw new ClassError('processor "' + name + '" already in stack');
            }

            items.add(name, {
                verifier: verifier,
                handler: handler
            });

            _apply(name, position, relativeTo);
        };

        /**
         * Reorders processor at stack
         *
         * For example:
         *
         *     stack.reorder('addY','before','addX');
         *
         * @method reorder
         *
         * @param {String} name processor name
         * @param {String} position position, class processor is inserted at. Valid values are:
         *
         *  - first,
         *  - last,
         *  - before, (relativeTo is required)
         *  - after (relativeTo is required)
         *
         * @param {String} [relativeTo] name of processor, presented in stack, relative to which new item's position is evaluated
         */
        me.reorder = function (name, position, relativeTo) {
            _apply(name, position, relativeTo);
        };

        /**
         * Deletes processor from stack. If processor not found, error is thrown
         *
         * For example:
         *
         *     stack.remove('addY');
         *
         * @method remove
         *
         * @param {String} name processor name
         *
         * @throws {Error} Error is thrown, when:
         *
         * - processor with given name is not found in stack
         */
        me.remove = function (name) {
            if (items.hasKey(name)) {
                items.removeAt(name);
            } else {
                throw new ClassError('processor "' + name + '" not found in stack');
            }
        };

        /**
         * Starts stack processing chain with given arguments
         *
         * For example:
         *
         *     stack.process([1, 2], [2, 3], function() {
         *         console.log('ready');
         *     });
         *
         * @method process
         *
         * @param {Array} verifierArgs arguments, passed to each stack item's verifier
         * @param {Array} handlerArgs arguments, passed to each stack item's handler
         * @param {Function} [callback] optional executed callback
         */
        me.process = function (verifierArgs, handlerArgs, callback) {
            _process(items.clone(), verifierArgs, handlerArgs, xs.isFunction(callback) ? callback : xs.emptyFn);
        };

        /**
         * Internal process function
         *
         * @ignore
         *
         * @method process
         *
         * @param {xs.core.Collection} items items stack
         * @param {Array} verifierArgs arguments for items' verifiers
         * @param {Array} handlerArgs arguments for items' handlers
         * @param {Function} callback stack ready callback
         */
        var _process = function (items, verifierArgs, handlerArgs, callback) {
            var me = this;
            if (!items.length) {
                callback();

                return;
            }
            var item = items.shift();

            //if item.verifier allows handler execution, process next
            if (item.verifier.apply(me, verifierArgs)) {

                var ready = function () {
                    _process(items, verifierArgs, handlerArgs, callback);
                };

                //if item.handler returns false, processing is async, stop processing, awaiting ready call
                if (item.handler.apply(me, handlerArgs.concat(ready)) === false) {

                    return;
                }
            }

            _process(items, verifierArgs, handlerArgs, callback);
        };


        /**
         * Applies item in stack relative to item with given name
         *
         * @ignore
         *
         * @param {String} name name of repositioned item
         * @param {String} position new item position
         * @param {*} relativeTo name of relativeTo positioned item
         *
         * @throws {Error} Error is thrown:
         *
         * - if incorrect position given
         * - relativeTo item is missing in stack
         */
        var _apply = function (name, position, relativeTo) {
            if ([
                'first',
                'last',
                'before',
                'after'
            ].indexOf(position) < 0) {
                throw new ClassError('incorrect position given');
            }

            //get item from items
            var item = items.at(name);

            //remove item from items
            items.removeAt(name);

            //insert to specified position
            if (position == 'first' || position == 'last') {
                position == 'first' ? items.insert(0, name, item) : items.add(name, item);
            } else {
                var relativeKey = new xs.core.Collection(items.keys()).keyOf(relativeTo);

                if (!xs.isDefined(relativeKey)) {
                    throw new ClassError('relative item "' + relativeTo + '" missing in stack');
                }
                position == 'after' && relativeKey++;
                items.insert(relativeKey, name, item);
            }
        };
    }

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ClassError
     */
    function ClassError(message) {
        this.message = 'xs.Class :: ' + message;
    }

    ClassError.prototype = new Error();
})(window, 'xs');