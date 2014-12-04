/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

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
        me.create = function ( Descriptor, createdFn ) {

            //Descriptor must be function
            if ( !xs.isFunction(Descriptor) ) {
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
            xs.const(Class, 'descriptor', _createDescriptorPrototype());

//            //set class not ready yet (until preprocessors done)
//            Class.isReady = false;
//TODO make more pretty
            //process preprocessors stack before createdFn called
            preprocessors.process([
                Class,
                descriptor,
                namespace
            ], [
                Class,
                descriptor,
                namespace
            ], function () {
//                //set class ready
//                Class.isReady = true;
//TODO make more pretty
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
            var Class = function xClass () {
                var me = this;

                //define class constructor
                var descriptor = Class.descriptor;


                //singleton processing

                //throw exception if Class is singleton
                if ( descriptor.singleton ) {
                    throw new ClassError('can not create instance of singleton class');
                }

                //get constructor shortcut
                var constructor = descriptor.constructor != Object ? descriptor.constructor : undefined;

                //if parent constructor - just call it
                if ( me.self && me.self !== Class ) {
                    constructor && constructor.apply(me, arguments);

                    return;
                }


                //save call arguments
                me.initArguments = arguments;

                //properties processing

                //init privates storage
                me.privates = {};

                //assign values
                if ( xs.isObject(descriptor.properties) ) {
                    var properties = descriptor.properties;
                    var keys = Object.keys(properties);
                    var i, length = keys.length, name, property;

                    for ( i = 0; i < length; i++ ) {
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
        var _createFactory = function ( Class ) {
            //this - current class
            //arguments - new instance arguments

            //create wrapper
            var xClass = function ( args ) {
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
                imports: {},

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
                const: {},

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
    function Stack () {
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
        var _apply = function ( name, position, relativeTo ) {
            if ( !xs.has([
                'first',
                'last',
                'before',
                'after'
            ], position) ) {
                throw new ClassError('incorrect position given');
            }

            //get current keys
            var keys = xs.keys(items);

            //remove name from keys
            xs.delete(keys, name);

            //insert to specified position
            if ( position == 'first' || position == 'last' ) {
                position == 'first' ? keys.unshift(name) : keys.push(name);
            } else {
                var relativeKey = xs.keyOf(keys, relativeTo);

                if ( !xs.isDefined(relativeKey) ) {
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
        me.add = function ( name, verifier, handler, position, relativeTo ) {
            //position defaults to last
            position || (position = 'last');

            if ( xs.hasKey(items, name) ) {
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
        me.reorder = function ( name, position, relativeTo ) {
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
        me.delete = function ( name ) {
            if ( xs.hasKey(items, name) ) {
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
        me.process = function ( verifierArgs, handlerArgs, callback ) {
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
        var _process = function ( items, verifierArgs, handlerArgs, callback ) {
            var me = this;
            if ( !items.length ) {
                callback();

                return;
            }
            var item = xs.shift(items);

            //if item.verifier allows handler execution, process next
            if ( item.verifier.apply(me, verifierArgs) ) {

                var ready = function () {
                    _process(items, verifierArgs, handlerArgs, callback);
                };

                //if item.handler returns false, processing is async, stop processing, awaiting ready call
                if ( item.handler.apply(me, xs.union(handlerArgs, ready)) === false ) {

                    return;
                }
            }

            _process(items, verifierArgs, handlerArgs, callback);
        };

        /**
         * Internal error class
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class ClassError
         */
        function ClassError ( message ) {
            this.message = 'xs.Class :: ' + message;
        }

        ClassError.prototype = new Error();
    }
})(window, 'xs');