'use strict';

//define xs.class
if (!xs.class) {
    xs.class = {};
}

var log = new xs.log.Logger('xs.class.Class');

var assert = new xs.core.Asserter(log, XsClassClassError);

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
 * 1 Descriptor (Function) -  descriptor constructor. Creates raw descriptor instance. Is called with 2 params:
 *
 * - self. Created class instance
 * - imports. namespace object, where namespace references are placed
 *
 * Supported descriptor instance directives:
 *
 * - {@link xs.class.preprocessors#namespace namespace}
 * - {@link xs.class.preprocessors#imports imports}
 * - {@link xs.class.preprocessors#extends extends}
 * - {@link xs.class.preprocessors#mixins mixins}
 * - {@link xs.class.preprocessors#implements implements}
 * - {@link xs.class.preprocessors#abstract abstract}
 * - {@link xs.class.preprocessors#constant constant}
 * - {@link xs.class.preprocessors#staticProperty static.property}
 * - {@link xs.class.preprocessors#staticMethod static.method}
 * - {@link xs.class.preprocessors#constructor constructor}
 * - {@link xs.class.preprocessors#property property}
 * - {@link xs.class.preprocessors#method method}
 *
 * Important! Directives, specified above are recommended to be specified in class exactly in the above order.
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
xs.Class = xs.class.Class = (function (ProcessorsStack, processing, dependencies) {

    /**
     * Creates class sample and starts processors applying
     *
     * @ignore
     */
    var Contractor = function (Descriptor, createdFn) {

        //Descriptor must be function
        assert.fn(Descriptor, 'given class descriptor `$descriptor` is not a function', {
            $descriptor: Descriptor
        });

        if (!xs.isFunction(createdFn)) {
            createdFn = xs.noop;
        }

        //create class
        var Class = createSample();

        //save contract type
        xs.constant(Class, 'contractor', Contractor);

        //get imports for Class
        var imports = Class.imports = {};

        //Fill descriptor prototype
        Descriptor.prototype = createPrototypeDescriptor();

        //get descriptor instance
        var descriptor = new Descriptor(Class, imports);

        //save Class descriptor
        xs.constant(Class, 'descriptor', createEmptyDescriptor());

        //add class to processing list
        processing.add(Class);

        //process preprocessors stack before createdFn called.
        //Normally, only namespace is processed on this tick - imports is unambiguously async
        preprocessors.process([
            Class,
            descriptor
        ], [
            Class,
            descriptor,
            dependencies
        ], function () {

            //create factory for class
            Class.factory = createFactory(Class);

            //remove class from processing list
            processing.remove(Class);

            //call createdFn
            createdFn(Class, imports);

            //process postprocessors stack after createdFn called
            postprocessors.process([
                Class,
                descriptor
            ], [
                Class,
                descriptor
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
     *
     * For handler:
     *
     *  - Class
     *  - descriptor
     *  - dependencies
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.class.preprocessors
     *
     * @extends xs.core.ProcessorsStack
     *
     * @singleton
     */
    var preprocessors = xs.class.preprocessors = new ProcessorsStack();

    /**
     * Stack of processors, processing class after it's considered to be created (after createdFn is called)
     *
     * Provided arguments are:
     *
     * For verifier:
     *
     *  - Class
     *  - descriptor
     *
     * For handler:
     *
     *  - Class
     *  - descriptor
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.class.postprocessors
     *
     * @extends xs.core.ProcessorsStack
     *
     * @singleton
     */
    var postprocessors = xs.class.postprocessors = new ProcessorsStack();

    /**
     * Returns new xClass sample
     *
     * @ignore
     *
     * @method create
     *
     * @return {Function} new xClass
     */
    var createSample = function () {
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
            assert.not(descriptor.abstract, 'can not create instance of abstract class `$Class`', {
                $Class: Class
            });


            //save call arguments
            me.initArguments = arguments;

            //properties processing

            //init privates storage
            me.private = {};

            //assign values
            var properties = descriptor.property.private.items; //xs.core.Collection
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
    var createFactory = function (Class) {

        //return factory
        return function () {
            var instance;
            eval('instance = new Class(' + getArgumentsList(arguments.length) + ')');

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
    var getArgumentsList = function (count) {
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
     * @method createPrototypeDescriptor
     *
     * @return {Object} prototype of new descriptor
     */
    var createPrototypeDescriptor = function () {
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
            implements: [],

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
     * @method createEmptyDescriptor
     *
     * @return {Object} new empty descriptor
     */
    var createEmptyDescriptor = function () {
        //internal class collections are not testable as they are supposed to be protected
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

    return Contractor;
})(module.ProcessorsStack, module.ProcessingList, module.DependenciesManager);


//define prototype of xs.class.Base
xs.class.Base = xs.Class(function () {
}, xs.noop);


/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsClassClassError
 */
function XsClassClassError(message) {
    this.message = 'xs.class.Class::' + message;
}

XsClassClassError.prototype = new Error();