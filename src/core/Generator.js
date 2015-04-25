'use strict';

//define xs.core
xs.getNamespace(xs, 'core');

var log = new xs.log.Logger('xs.core.Generator');

var assert = new xs.core.Asserter(log, XsCoreGeneratorError);

/**
 * xs.core.Generator is key system element, that allows to specify per instance evaluated values
 *
 * xs.core.Generator is used to evaluate value of class instance property, when it is created
 *
 * Using xs.core.Generator, for example, allows to specify properties, that can not be specified with simple assignment
 *
 * xs.core.Generator is used via xs.generator helper, that returns xs.core.Generator instance. To get instance value use it's create method.
 *
 * For example:
 *
 *     //define some sample class
 *     xs.Class(function() {
 *
 *         var Class = this;
 *
 *         //define property via generator
 *         Class.property.items = xs.generator(function() {
 *             return [];
 *         });
 *
 *     });
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.core.Generator
 *
 *
 *
 * @constructor
 *
 * Generator constructor. Accepts single argument - evaluation function
 *
 * For example:
 *
 *     //create generator instance
 *     var generator = new xs.core.Generator(function() {
 *         return 'aaa';
 *     });
 *
 *     //get value of generator
 *     var value = generator.get();
 *
 * @param {Function} evaluation function, that returns generated value
 */
xs.core.Generator = function (evaluation) {
    var me = this;

    //assert, that  evaluation is function
    assert.fn(evaluation, 'constructor - given evaluation `$evaluation` is not a function', {
        $evaluation: evaluation
    });

    /**
     * Returns value of xs.core.Generator
     *
     * @method create
     *
     * @return {*} generator evaluated value
     */
    me.create = evaluation;
};

/**
 * Destroys generator
 *
 * @method destroy
 */
xs.core.Lazy.prototype.destroy = function () {
    //delete create function
    delete this.create;
};


/**
 * Returns instance of xs.core.Generator for given evaluation
 *
 * @member xs
 *
 * @method generator
 *
 * @return {xs.core.Generator} instance of xs.core.Generator for given evaluation
 */
xs.generator = function (evaluation) {
    return new xs.core.Generator(evaluation);
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreGeneratorError
 */
function XsCoreGeneratorError(message) {
    this.message = 'xs.core.Generator::' + message;
}

XsCoreGeneratorError.prototype = new Error();

xs.apply(xs, {
    define: xs.ContractsManager.define
});