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
    xs.Class = new (function () {
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
         * @param {Function} createdFn class creation callback. Is called after
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

            //save Class descriptor
            xs.constant(Class, 'descriptor', _createDescriptorPrototype());

            //mark class as not ready yet (until preprocessors done)
            Class.isProcessing = true;
            //process preprocessors stack before createdFn called
            xs.nextTick(function () {
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

                    dependencies.resolve(Class);
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
                if (xs.isObject(descriptor.properties)) {
                    var properties = descriptor.properties;
                    var keys = Object.keys(properties);
                    var i, length = keys.length, name, property;

                    for (i = 0; i < length; i++) {
                        name = keys[i];
                        property = properties[name];
                        property.hasOwnProperty('value') && (me[name] = property.value);
                    }
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
    });

    //define prototype of xs.Base
    xs.Base = xs.Class.create(function () {
    }, xs.emptyFn);

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
    var dependencies = xs.Class.dependencies = new (function () {
        var me = this;

        /**
         * Internal dependencies storage
         */
        var dependencies = [];

        /**
         * Adds dependency from dependent Class to array of processed Classes.
         * When all processed Classes will be done, handler is called
         *
         * @method add
         *
         * @param {Object} dependent dependent Class
         * @param {Object|Object[]} waiting array of processed classes, dependent class is waiting for
         * @param {Function} handleReady callback, called when all waited classes were processed
         */
        me.add = function (dependent, waiting, handleReady) {

            //convert waiting to array
            xs.isArray(waiting) || (waiting = [waiting]);

            xs.log('xs.Class::dependencies::add. Adding dependency for', dependent.label, 'from', xs.map(waiting, function (Class) {
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
            xs.each(waiting, function (Class) {
                var deadLock = chains.getLock(Class);

                //throw respective ClassError if dead lock found
                if (deadLock) {
                    xs.log('xs.Class::dependencies::add. Lock detected');
                    throw new ClassError('dead lock detected: ' + _showDeadLock(deadLock));
                }
            });

            xs.log('xs.Class::dependencies::add. No lock found. Adding dependency');
            //save dependency
            dependencies.push({
                waiting: waiting,
                handleReady: handleReady
            });
        };

        /**
         * Cleans up dependencies and chains after class was processed
         *
         * @param {Object} processed processed class
         */
        me.resolve = function (processed) {
            xs.log('xs.Class::dependencies::resolve. Resolving dependencies, because', processed.label, 'has been processed');
            //get resolved dependencies list
            var resolved = xs.findAll(dependencies, function (dependency) {
                //dependency is resolved, if processed delete succeeds (processed was deleted) and waiting is empty
                if (xs.delete(dependency.waiting, processed)) {

                    return !dependency.waiting.length;
                }

                return false;
            });

            xs.log('xs.Class::dependencies::resolve. Resolved dependencies', resolved);
            //process resolved dependencies to remove them from stack
            xs.each(resolved, function (dependency) {
                xs.delete(dependencies, dependency);
                dependency.handleReady();
            });
        };

        /**
         * Filter waiting classes to exclude those ones which are already processed
         *
         * @method filterWaiting
         *
         * @param {Object[]} waiting array of waiting classes
         */
        var _filterWaiting = function (waiting) {
            var Class, i = 0;

            xs.log('xs.Class::dependencies::filterWaiting. Filtering list:', xs.map(waiting, function (Class) {
                return Class.label;
            }));

            //iterate over waiting
            while (i < waiting.length) {

                //get Class reference at i position
                Class = waiting[i];

                //if class is processing - go to next
                if (Class.isProcessing) {
                    i++;

                    //else - delete class from waiting
                } else {
                    xs.log('xs.Class::dependencies::filterWaiting. Class:', Class.label, 'is already processed, removing it from waiting');
                    xs.deleteAt(waiting, i);
                }
            }
            xs.log('xs.Class::dependencies::filterWaiting. Filtered list:', xs.map(waiting, function (Class) {
                return Class.label;
            }));
        };

        var _showDeadLock = function (deadLock) {
            //self lock
            if (deadLock.length == 1) {
                return 'Class "' + deadLock[0].label + '" imports itself';
            }

            //chain lock
            var first = deadLock.shift();
            var names = xs.map(deadLock, function (Class) {
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
        var chains = me.chains = new (function () {
            var me = this;

            /**
             * Internal chains storage
             *
             * @type {Array}
             */
            var chains = me.chains = [];

            /**
             * Adds dependent class with it waiting list to manager
             *
             * @param {Object} dependent dependent class
             * @param {Object[]} waiting waiting classes list
             */
            me.add = function (dependent, waiting) {

                xs.log('xs.Class::dependencies::chains::add. Adding dependency chain for', dependent.label, 'from', xs.map(waiting, function (Class) {
                    return Class.label;
                }));
                //get existing chains, where dependent class was in waiting list
                var workChains = _getChains(dependent, true);

                xs.log('xs.Class::dependencies::chains::add. Work chains:');
                xs.each(workChains, function (chain) {
                    xs.log('xs.Class::dependencies::chains::add.', xs.map(chain, function (Class) {
                        return Class.label;
                    }));
                });

                //if working chains found - split each to include waiting
                if (workChains.length) {
                    xs.log('xs.Class::dependencies::chains::add. Work chains exist. Updating...');
                    xs.each(workChains, function (chain) {
                        _updateChains(chain, waiting);
                    });

                    //else - create chain for each waiting
                } else {
                    xs.log('xs.Class::dependencies::chains::add. No work chains found. Creating...');
                    _createChains(dependent, waiting);
                }

                xs.log('xs.Class::dependencies::chains::add. Chains after add:');
                xs.each(chains, function (chain) {
                    xs.log('xs.Class::dependencies::chains::add.', xs.map(chain, function (Class) {
                        return Class.label;
                    }));
                });
            };

            /**
             * Deletes processed class from all chains
             *
             * @param {Object} processed processed class
             */
            me.delete = function (processed) {

                xs.log('xs.Class::dependencies::chains::delete.', processed.label, 'resolved');

                //get work chains, that contain processed class
                var workChains = _getChains(processed);
                xs.log('xs.Class::dependencies::chains::delete. Work chains:');
                xs.each(workChains, function (chain) {
                    xs.log('xs.Class::dependencies::chains::delete.', xs.map(chain, function (Class) {
                        return Class.label;
                    }));
                });

                //remove processed class from each workChain
                xs.each(workChains, function (chain) {
                    //if chain is more than 2 items long - delete item from it
                    if (chain.length > 2) {
                        xs.delete(chain, processed);

                        //else - delete chain from chains
                    } else {
                        xs.delete(chains, chain);
                    }
                });
                xs.log('xs.Class::dependencies::chains::delete. Chains left:');
                xs.each(chains, function (chain) {
                    xs.log('xs.Class::dependencies::chains::delete.', xs.map(chain, function (Class) {
                        return Class.label;
                    }));
                });
            };

            /**
             * Tries to find dead locks, that may occur if added dependency from dependent class to waiting one
             *
             * @method add
             *
             * @param {String} dependent dependent class name
             *
             * @return {String} first found dead lock
             */
            me.getLock = function (dependent) {
                xs.log('xs.Class::dependencies::chains::getLock. Get lock for', dependent.label);
                //first and last dependent occurrences indices
                var first = 0, last = 0;

                //try to find locked chain
                var lockedChain = xs.find(chains, function (chain) {

                    //first occurrence key
                    first = xs.keyOf(chain, dependent);

                    //last occurrence key
                    last = xs.lastKeyOf(chain, dependent);

                    return first !== last;
                });

                //if locked chain found - return locked subset
                return lockedChain ? lockedChain.slice(first, last) : undefined;
            };

            /**
             * Gets working chains list
             *
             * @method getChains
             *
             * @param {Object} dependent dependent class
             * @param {Boolean} lastOnly whether to look for dependent class at the chain last entry only
             *
             * @returns {Array} found working chains
             */
            var _getChains = function (dependent, lastOnly) {
                if (lastOnly) {

                    return xs.findAll(chains, function (chain) {
                        return xs.last(chain) === dependent;
                    });
                }

                return xs.findAll(chains, function (chain) {
                    return xs.has(chain, dependent);
                });
            };

            /**
             * Creates chains with given dependent and waiting classes
             *
             * @param {Object} dependent dependent class
             * @param {Object[]} waiting waiting classes
             */
            var _createChains = function (dependent, waiting) {
                xs.each(waiting, function (Class) {
                    chains.push([
                        dependent,
                        Class
                    ]);
                });
            };

            /**
             * Updates chain with each class in waiting
             *
             * @param {Object[]} chain
             * @param {Object[]} waiting
             */
            var _updateChains = function (chain, waiting) {
                //remove chain from chains
                xs.delete(chains, chain);

                //for each waiting class add it chain copy
                xs.each(waiting, function (Class) {

                    //create copy of chain
                    var copy = xs.clone(chain);

                    //push Class to chain
                    copy.push(Class);

                    //add copy to chains
                    chains.push(copy);
                });
            };
        });
    });

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
        var items = {};

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
            if (!xs.has([
                'first',
                'last',
                'before',
                'after'
            ], position)) {
                throw new ClassError('incorrect position given');
            }

            //get current keys
            var keys = xs.keys(items);

            //remove name from keys
            xs.delete(keys, name);

            //insert to specified position
            if (position == 'first' || position == 'last') {
                position == 'first' ? keys.unshift(name) : keys.push(name);
            } else {
                var relativeKey = xs.keyOf(keys, relativeTo);

                if (!xs.isDefined(relativeKey)) {
                    throw new ClassError('relative item "' + relativeTo + '" missing in stack');
                }
                position == 'after' && relativeKey++;
                keys.splice(relativeKey, 0, name);
            }

            //pick items in new order
            items = xs.pick(items, keys);
        };

        /**
         * Returns stack items copy
         *
         * @method get
         *
         * @return {Object} stack items copy
         */
        me.get = function () {

            return xs.clone(items);
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

            if (xs.hasKey(items, name)) {
                throw new ClassError('processor "' + name + '" already in stack');
            }

            items[name] = {
                verifier: verifier,
                handler: handler
            };

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
         *     stack.delete('addY');
         *
         * @method delete
         *
         * @param {String} name processor name
         *
         * @throws {Error} Error is thrown, when:
         *
         * - processor with given name is not found in stack
         */
        me.delete = function (name) {
            if (xs.hasKey(items, name)) {
                xs.deleteAt(items, name);
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
            _process(xs.values(items), verifierArgs, handlerArgs, xs.isFunction(callback) ? callback : xs.emptyFn);
        };

        /**
         * Internal process function
         *
         * @ignore
         *
         * @method process
         *
         * @param {Array} items items stack
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
            var item = xs.shift(items);

            //if item.verifier allows handler execution, process next
            if (item.verifier.apply(me, verifierArgs)) {

                var ready = function () {
                    _process(items, verifierArgs, handlerArgs, callback);
                };

                //if item.handler returns false, processing is async, stop processing, awaiting ready call
                if (item.handler.apply(me, xs.union(handlerArgs, ready)) === false) {

                    return;
                }
            }

            _process(items, verifierArgs, handlerArgs, callback);
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