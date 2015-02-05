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

    //define xs.enum
    if (!xs.enum) {
        xs.enum = {};
    }

    /**
     * xs.enum.Enum is core class, that is used for enum generation.
     *
     * xs.enum.Enum provides 2 stacks to register processors:
     *
     * - {@link xs.enum.preprocessors preprocessors}
     * - {@link xs.enum.postprocessors postprocessors}
     *
     * Usage example:
     *
     *     //create simple Enum
     *     var Enum = xs.Enum(function () {
     *         //here Enum descriptor is described:
     *         var me = this;
     *         me.constant = ['a'];
     *     });
     *
     * xs.enum.Enum has 2 params:
     *
     * 1 Descriptor (Function) -  descriptor constructor. Creates raw descriptor instance. Is called without params
     *
     * 2 createdFn ([Function]) - optional enum creation callback. Is called after
     * {@link xs.enum.preprocessors preprocessors} stack is processed. When called, created enum is passed as param.
     *
     * Errors are thrown, when:
     *
     * - descFn is given not as function
     * - descFn doesn't return object
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.enum.Enum
     *
     * @alternateClassName xs.Enum
     *
     * @singleton
     */
    xs.Enum = xs.enum.Enum = (function (dependencies) {

        /**
         * Currently processing enums' list
         *
         * @ignore
         *
         * @property processing
         *
         * @type {xs.core.Collection}
         */
        var processing = new xs.core.Collection();

        /**
         * Creates enum sample and starts processors applying
         *
         * @ignore
         */
        var Contractor = function (Descriptor, createdFn) {

            //Descriptor must be function
            xs.assert.fn(Descriptor, 'given enum descriptor "$descriptor" is not a function', {
                $descriptor: Descriptor
            }, EnumError);

            if (!xs.isFunction(createdFn)) {
                createdFn = xs.emptyFn;
            }

            //create enum
            var Enum = _createSample();

            //save contract type
            xs.constant(Enum, 'contractor', Contractor);

            //Fill descriptor prototype
            Descriptor.prototype = _createPrototypeDescriptor();

            //get descriptor instance
            var descriptor = new Descriptor();

            //save Enum descriptor
            xs.constant(Enum, 'descriptor', _createEmptyDescriptor());

            //mark enum as not ready yet (until preprocessors done)
            Enum.isProcessing = true;

            //push enum to processed list
            processing.add(Enum);

            //process preprocessors stack before createdFn called.
            //Normally, only namespace is processed on this tick - imports is unambiguously async
            preprocessors.process([
                Enum,
                descriptor
            ], [
                Enum,
                descriptor,
                dependencies
            ], function () {
                //remove isProcessing mark
                delete Enum.isProcessing;

                //remove enum from processing list
                processing.remove(Enum);

                //remove from dependencies
                dependencies.remove(Enum);

                //notify, that enum is ready
                dependencies.ready(Enum.label);

                //if dependencies empty - all enums processed
                if (!processing.length) {

                    //notify, that all ready
                    dependencies.ready(null);
                }

                //call createdFn
                createdFn(Enum);

                //process postprocessors stack after createdFn called
                postprocessors.process([
                    Enum,
                    descriptor
                ], [
                    Enum,
                    descriptor
                ]);
            });

            return Enum;
        };
        Contractor.label = 'xs.Enum';

        /**
         * Stack of processors, processing enum before it's considered to be created (before createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Enum
         *  - descriptor
         *
         * For handler:
         *
         *  - Enum
         *  - descriptor
         *  - dependencies
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.enum.preprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var preprocessors = xs.enum.preprocessors = new xs.ProcessorsStack.Enum();

        /**
         * Stack of processors, processing enum after it's considered to be created (after createdFn is called)
         *
         * Provided arguments are:
         *
         * For verifier:
         *
         *  - Enum
         *  - descriptor
         *
         * For handler:
         *
         *  - Enum
         *  - descriptor
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.enum.postprocessors
         *
         * @extends xs.core.ProcessorsStack
         *
         * @singleton
         */
        var postprocessors = xs.enum.postprocessors = new xs.ProcessorsStack.Enum();

        /**
         * Returns new xEnum sample
         *
         * @ignore
         *
         * @method create
         *
         * @return {Function} new xEnum
         */
        var _createSample = function () {

            return function xEnum() {
                throw new EnumError('Enum must not be called');
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
        var _createPrototypeDescriptor = function () {
            return {

                //enum namespace
                namespace: undefined,

                //enum imports list
                imports: [],

                //enum parent
                extends: undefined,

                //enum constants list
                constant: [],

                //enum statics list
                static: {
                    //enum static properties list
                    property: {},

                    //enum static methods list
                    method: {}
                },

                //enum constructor
                constructor: undefined,

                //enum properties list
                property: {},

                //enum methods list
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

                //class constants list
                constant: new xs.core.Collection(),

                //class statics list
                static: {
                    //class static properties list
                    property: new xs.core.Collection(),

                    //class static methods list
                    method: new xs.core.Collection()
                },

                //enum constructor
                constructor: undefined,

                //class properties list
                property: new xs.core.Collection(),

                //class methods list
                method: new xs.core.Collection()
            };
        };

        return Contractor;
    })(xs.DependenciesManager.Enum);


    //clean up ProcessorsStack
    //remove ProcessorsStack reference
    delete xs.ProcessorsStack.Enum;
    //complete if ready
    if (!Object.keys(xs.ProcessorsStack).length) {
        delete xs.ProcessorsStack;
    }


    //clean up DependenciesManager
    //remove DependenciesManager reference
    delete xs.DependenciesManager.Enum;
    //complete if ready
    if (!Object.keys(xs.DependenciesManager).length) {
        delete xs.DependenciesManager;
    }


    //define prototype of xs.enum.Base
    xs.enum.Base = xs.Enum(function () {
    }, xs.emptyFn);


    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class EnumError
     */
    function EnumError(message) {
        this.message = 'xs.enum.Enum::' + message;
    }

    EnumError.prototype = new Error();
})(window, 'xs');