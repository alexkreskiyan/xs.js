'use strict';

//define xs.enum
xs.getNamespace(xs, 'enum');

var log = new xs.log.Logger('xs.enum.Enum');

var assert = new xs.core.Asserter(log, XsEnumEnumError);

/**
 * xs.enum.Enum is core class, that is used for enum generation.
 *
 * xs.enum.Enum provides 1 stacks to register processors:
 *
 * - {@link xs.enum.preprocessors preprocessors}
 *
 * Usage example:
 *
 *     //create simple Enum
 *     var Enum = xs.Enum({
 *         Get: 1,
 *         Post: 2
 *     });
 *
 * xs.enum.Enum has 1 param:
 *
 * 1 Hash (Object) -  enum variables hash
 *
 * 2 createdFn ([Function]) - optional enum creation callback. Is called after
 * {@link xs.enum.preprocessors preprocessors} stack is processed. When called, created enum is passed as param.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.enum.Enum
 *
 * @alternateClassName xs.Enum
 *
 * @singleton
 */
xs.Enum = xs.enum.Enum = (function (ProcessorsStack, processing) {

    /**
     * Creates enum sample and starts processors applying
     *
     * @ignore
     */
    var Contractor = function (values, createdFn) {

        //Descriptor must be function
        assert.object(values, 'given values object `$values` is not an object', {
            $values: values
        });

        if (!xs.isFunction(createdFn)) {
            createdFn = xs.noop;
        }

        //create enum
        var Enum = {};

        //save contract type
        xs.constant(Enum, 'contractor', Contractor);

        //save Enum descriptor
        xs.constant(Enum, 'descriptor', createEmptyDescriptor());

        //push enum to processed list
        processing.add(Enum);

        //process preprocessors stack before createdFn called.
        //Normally, only namespace is processed on this tick - imports is unambiguously async
        preprocessors.process([
            Enum,
            values
        ], [
            Enum,
            values
        ], function () {

            //remove enum from processing list
            processing.remove(Enum);

            //call createdFn
            createdFn(Enum);
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
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.enum.preprocessors
     *
     * @extends xs.core.ProcessorsStack
     *
     * @singleton
     */
    var preprocessors = xs.enum.preprocessors = new ProcessorsStack();

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

            //enum namespace
            namespace: undefined,

            //enum values list
            value: new xs.core.Collection()
        };
    };

    return Contractor;
})(module.ProcessorsStack, module.ProcessingList);


//define prototype of xs.enum.Base
xs.enum.Base = xs.Enum({}, xs.noop);


/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsEnumEnumError
 */
function XsEnumEnumError(message) {
    this.message = 'xs.enum.Enum::' + message;
}

XsEnumEnumError.prototype = new Error();