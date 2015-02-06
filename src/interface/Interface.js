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

    //define xs.interface
    if (!xs.interface) {
        xs.interface = {};
    }

    /**
     * xs.interface.Interface is core class, that is used for interface generation.
     *
     * xs.interface.Interface provides 2 stacks to register processors:
     *
     * - {@link xs.interface.preprocessors preprocessors}
     * - {@link xs.interface.postprocessors postprocessors}
     *
     * Usage example:
     *
     *     //create simple Interface
     *     var Interface = xs.Interface(function () {
     *         //here Interface descriptor is described:
     *         var me = this;
     *         me.constant = ['a'];
     *     });
     *
     * xs.interface.Interface has 2 params:
     *
     * 1 Descriptor (Function) -  descriptor constructor. Creates raw descriptor instance. Is called without params
     *
     * 2 createdFn ([Function]) - optional interface creation callback. Is called after
     * {@link xs.interface.preprocessors preprocessors} stack is processed. When called, created interface is passed as param.
     *
     * Errors are thrown, when:
     *
     * - descFn is given not as function
     * - descFn doesn't return object
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.interface.Interface
     *
     * @alternateClassName xs.Interface
     *
     * @singleton
     */
    xs.Interface = xs.interface.Interface = (function (dependencies) {

        /**
         * Currently processing interfaces' list
         *
         * @ignore
         *
         * @property processing
         *
         * @type {xs.core.Collection}
         */
        var processing = new xs.core.Collection();

        /**
         * Creates interface sample and starts processors applying
         *
         * @ignore
         */
        var Contractor = function (Descriptor, createdFn) {

            //Descriptor must be function
            xs.assert.fn(Descriptor, 'given interface descriptor "$descriptor" is not a function', {
                $descriptor: Descriptor
            }, InterfaceError);

            if (!xs.isFunction(createdFn)) {
                createdFn = xs.emptyFn;
            }

            //create interface
            var Interface = createSample();

            //save contract type
            xs.constant(Interface, 'contractor', Contractor);

            //Fill descriptor prototype
            Descriptor.prototype = createPrototypeDescriptor();

            //get descriptor instance
            var descriptor = new Descriptor();

            //save Interface descriptor
            xs.constant(Interface, 'descriptor', createEmptyDescriptor());

            //mark interface as not ready yet (until preprocessors done)
            Interface.isProcessing = true;

            //push interface to processed list
            processing.add(Interface);

            //process preprocessors stack before createdFn called.
            //Normally, only namespace is processed on this tick - imports is unambiguously async
            preprocessors.process([
                Interface,
                descriptor
            ], [
                Interface,
                descriptor,
                dependencies
            ], function () {
                //remove isProcessing mark
                delete Interface.isProcessing;

                //remove interface from processing list
                processing.remove(Interface);

                //remove from dependencies
                dependencies.remove(Interface);

                //notify, that interface is ready
                dependencies.ready(Interface.label);

                //if dependencies empty - all interfaces processed
                if (!processing.length) {

                    //notify, that all ready
                    dependencies.ready(null);
                }

                //call createdFn
                createdFn(Interface);

                //process postprocessors stack after createdFn called
                postprocessors.process([
                    Interface,
                    descriptor
                ], [
                    Interface,
                    descriptor
                ]);
            });

            return Interface;
        };
        Contractor.label = 'xs.Interface';

        /**
         * Stack of processors, processing interface before it's considered to be created (before createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Interface
         *  - descriptor
         *
         * For handler:
         *
         *  - Interface
         *  - descriptor
         *  - dependencies
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.interface.preprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var preprocessors = xs.interface.preprocessors = new xs.ProcessorsStack.Interface();

        /**
         * Stack of processors, processing interface after it's considered to be created (after createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Interface
         *  - descriptor
         *
         * For handler:
         *
         *  - Interface
         *  - descriptor
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.interface.postprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var postprocessors = xs.interface.postprocessors = new xs.ProcessorsStack.Interface();

        /**
         * Returns new xInterface sample
         *
         * @ignore
         *
         * @method create
         *
         * @return {Function} new xInterface
         */
        var createSample = function () {

            return function xInterface() {
                throw new InterfaceError('Interface must not be called');
            };
        };

        /**
         * Returns prototype for descriptor function
         *
         * @ignore
         *
         * @method createPrototypeDescriptor
         *
         * @return {Object} prototype of new descriptor
         */
        var createPrototypeDescriptor = function () {
            return {

                //interface namespace
                namespace: undefined,

                //interface imports list
                imports: [],

                //interface parent
                extends: undefined,

                //interface constants list
                constant: [],

                //interface statics list
                static: {
                    //interface static properties list
                    property: {},

                    //interface static methods list
                    method: {}
                },

                //interface constructor
                constructor: undefined,

                //interface properties list
                property: {},

                //interface methods list
                method: {}
            };
        };

        /**
         * Returns class empty descriptor
         *
         * @ignore
         *
         * @method createEmptyDescriptor
         *
         * @return {Object} new empty descriptor
         */
        var createEmptyDescriptor = function () {
            return {

                //class namespace
                namespace: undefined,

                //class parent
                extends: undefined,

                //class constants list
                constant: new xs.core.Collection(),

                //class statics list
                static: {
                    //class static properties list
                    property: new xs.core.Collection(),

                    //class static methods list
                    method: new xs.core.Collection()
                },

                //interface constructor
                constructor: undefined,

                //class properties list
                property: new xs.core.Collection(),

                //class methods list
                method: new xs.core.Collection()
            };
        };

        return Contractor;
    })(xs.DependenciesManager.Interface);


    //clean up ProcessorsStack
    //remove ProcessorsStack reference
    delete xs.ProcessorsStack.Interface;
    //complete if ready
    if (!Object.keys(xs.ProcessorsStack).length) {
        delete xs.ProcessorsStack;
    }


    //clean up DependenciesManager
    //remove DependenciesManager reference
    delete xs.DependenciesManager.Interface;
    //complete if ready
    if (!Object.keys(xs.DependenciesManager).length) {
        delete xs.DependenciesManager;
    }


    //define prototype of xs.interface.Base
    xs.interface.Base = xs.Interface(function () {
    }, xs.emptyFn);


    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class InterfaceError
     */
    function InterfaceError(message) {
        this.message = 'xs.interface.Interface::' + message;
    }

    InterfaceError.prototype = new Error();
})(window, 'xs');