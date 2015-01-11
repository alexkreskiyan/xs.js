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

    //define xs.class
    if (!xs.class) {
        xs.class = {};
    }

    /**
     * xs.class.Class is core class, that is used for class generation.
     *
     * xs.class.Class provides 2 stacks to register processors:
     *
     * - {@link xs.class.preprocessors preprocessors}
     * - {@link xs.class.postprocessors postprocessors}
     *
     * Usage example:
     *
     *     //create simple Class
     *     var Class = xs.Class(function (Class) {
     *         //here Class descriptor is described:
     *         var me = this;
     *         me.imports = [];
     *         me.constant.a = 1;
     *     });
     *
     * xs.class.Class has 2 params:
     *
     * 1 Descriptor (Function) -  descriptor constructor. Creates raw descriptor instance. Is called with 3 params:
     *
     * - self. Created class instance
     * - ns. namespace object, where namespace references are placed
     * - imports. namespace object, where namespace references are placed
     *
     * 2 createdFn ([Function]) - optional class creation callback. Is called after
     * {@link xs.class.preprocessors preprocessors} stack is processed. When called, created class is passed as param.
     *
     * Errors are thrown, when:
     *
     * - descFn is given not as function
     * - descFn doesn't return object
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.class.Class
     *
     * @alternateClassName xs.Class
     *
     * @singleton
     */
    xs.Class = xs.class.Class = (function (dependencies) {

        /**
         * Currently processing classes' list
         *
         * @ignore
         *
         * @property processing
         *
         * @type {xs.core.Collection}
         */
        var processing = new xs.core.Collection();

        /**
         * Creates class sample and starts processors applying
         *
         * @ignore
         */
        var Contractor = function (Descriptor, createdFn) {

            //Descriptor must be function
            xs.assert.fn(Descriptor, 'given class descriptor "$descriptor" is not a function', {
                $descriptor: Descriptor
            }, ClassError);

            if (!xs.isFunction(createdFn)) {
                createdFn = xs.emptyFn;
            }

            //create class
            var Class = _createSample();

            //save contract type
            xs.constant(Class, 'contractor', Contractor);

            //get namespace for Class
            var namespace = Class.namespace = {};

            //get imports for Class
            var imports = Class.imports = {};

            //Fill descriptor prototype
            Descriptor.prototype = _createPrototypeDescriptor();

            //get descriptor instance
            var descriptor = new Descriptor(Class, namespace, imports);
            //convert descriptor
            _convertDescriptor(descriptor);

            //save Class descriptor
            xs.constant(Class, 'descriptor', _createEmptyDescriptor());

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

                //create factory for class
                Class.factory = _createFactory(Class);

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
        Contractor.label = 'xs.Class';

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
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.class.preprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var preprocessors = xs.class.preprocessors = new xs.ProcessorsStack.Class();

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
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.class.postprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var postprocessors = xs.class.postprocessors = new xs.ProcessorsStack.Class();

        /**
         * Returns new xClass sample
         *
         * @ignore
         *
         * @method create
         *
         * @return {Function} new xClass
         */
        var _createSample = function () {
            var Class = function xClass() {
                var me = this;

                //define class constructor
                var descriptor = Class.descriptor;

                //get constructor shortcut
                var constructor = descriptor.constructor !== Object ? descriptor.constructor : undefined;

                //if parent constructor - just call it
                if (me.self && me.self !== Class) {
                    if (constructor) {
                        constructor.apply(me, arguments);
                    }

                    return;
                }


                //abstract processing

                //assert Class is not abstract
                xs.assert.not(descriptor.abstract, 'can not create instance of abstract class "$label"', {
                    $label: Class.label
                }, ClassError);


                //save call arguments
                me.initArguments = arguments;

                //properties processing

                //init privates storage
                me.private = {};

                //assign values
                var properties = descriptor.property.items; //xs.core.Collection
                var i, length = properties.length, item;

                for (i = 0; i < length; i++) {
                    item = properties[i];
                    if (item.value.hasOwnProperty('value')) {
                        me[item.key] = item.value.value;
                    }
                }

                //native constructor call

                //save class reference
                me.self = Class;

                //apply constructor
                if (constructor) {
                    constructor.apply(me, arguments);
                }
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

            //return factory
            return function () {
                var instance;
                eval('instance = new Class(' + _getArgumentsList(arguments.length) + ')');

                return instance;
            };
        };

        /**
         * Returns arguments list (used in factory)
         *
         * @ignore
         *
         * @method
         *
         * @param {Number} count arguments count
         *
         * @return {String} arguments list for given count of arguments
         */
        var _getArgumentsList = function (count) {
            var list = [];
            for (var i = 0; i < count; i++) {
                list.push('arguments[' + i + ']');
            }

            return list.join(', ');
        };

        /**
         * Returns prototype for descriptor function
         *
         * @ignore
         *
         * @method _createPrototypeDescriptor
         *
         * @return {Object} prototype of new descriptor
         */
        var _createPrototypeDescriptor = function () {
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

                //class abstract flag
                abstract: undefined,

                //class constants list
                constant: {},

                //class statics list
                static: {
                    //class static properties list
                    property: {},

                    //class static methods list
                    method: {}
                },

                //class constructor
                constructor: undefined,

                //class properties list
                property: {},

                //class methods list
                method: {}
            };
        };

        /**
         * Returns class empty descriptor
         *
         * @ignore
         *
         * @method _createEmptyDescriptor
         *
         * @return {Object} new empty descriptor
         */
        var _createEmptyDescriptor = function () {
            return {

                //class namespace
                namespace: undefined,

                //class parent
                extends: undefined,

                //class mixins list
                mixins: new xs.core.Collection(),

                //class implements list
                implements: new xs.core.Collection(),

                //class abstract flag
                abstract: undefined,

                //class constants list
                constant: new xs.core.Collection(),

                //class statics list
                static: {
                    //class static properties list
                    property: new xs.core.Collection(),

                    //class static methods list
                    method: new xs.core.Collection()
                },

                //class constructor
                constructor: undefined,

                //class properties list
                property: new xs.core.Collection(),

                //class methods list
                method: new xs.core.Collection()
            };
        };

        /**
         * Converts prototype descriptor to use xs.core.Collection
         *
         * @ignore
         *
         * @method convertDescriptor
         */
        var _convertDescriptor = function (descriptor) {
            descriptor.imports = new xs.core.Collection(descriptor.imports);
            descriptor.mixins = new xs.core.Collection(descriptor.mixins);
            descriptor.implements = new xs.core.Collection(descriptor.implements);
            descriptor.constant = new xs.core.Collection(descriptor.constant);
            descriptor.static.property = new xs.core.Collection(descriptor.static.property);
            descriptor.static.method = new xs.core.Collection(descriptor.static.method);
            descriptor.property = new xs.core.Collection(descriptor.property);
            descriptor.method = new xs.core.Collection(descriptor.method);
        };

        return Contractor;
    })(xs.DependenciesManager.Class);


    //clean up ProcessorsStack
    //remove ProcessorsStack reference
    delete xs.ProcessorsStack.Class;
    //complete if ready
    if (!Object.keys(xs.ProcessorsStack).length) {
        delete xs.ProcessorsStack;
    }


    //clean up DependenciesManager
    //remove DependenciesManager reference
    delete xs.DependenciesManager.Class;
    //complete if ready
    if (!Object.keys(xs.DependenciesManager).length) {
        delete xs.DependenciesManager;
    }


    //define prototype of xs.class.Base
    xs.class.Base = xs.Class(function () {
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
        this.message = 'xs.class.Class::' + message;
    }

    ClassError.prototype = new Error();
})(window, 'xs');