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
    xs.Class = new (function (dependencies) {
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
         * @type {xs.core.ProcessorsStack}
         */
        var preprocessors = me.preprocessors = new xs.ProcessorsStack.Class();

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
         * @type {.core.ProcessorsStack}
         */
        var postprocessors = me.postprocessors = new xs.ProcessorsStack.Class();

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

                //notify, that class is ready
                dependencies.ready(Class.label);

                //if dependencies empty - all classes processed
                if (!processing.length) {

                    //notify, that all ready
                    dependencies.ready(null);
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
    })(xs.DependenciesManager.Class);


    //clean up ProcessorsStack
    //remove ProcessorsStack reference
    delete xs.ProcessorsStack.Class;
    //complete if ready
    Object.keys(xs.ProcessorsStack).length || delete xs.ProcessorsStack;


    //clean up DependenciesManager
    //remove DependenciesManager reference
    delete xs.DependenciesManager.Class;
    //complete if ready
    Object.keys(xs.DependenciesManager).length || delete xs.DependenciesManager;

    //define prototype of xs.Base
    xs.Base = xs.Class.create(function () {
    }, xs.emptyFn);

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