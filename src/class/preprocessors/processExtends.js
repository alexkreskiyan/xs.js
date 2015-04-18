'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.processExtends');

var assert = new xs.core.Asserter(log, XsClassPreprocessorsProcessExtendsError);

/**
 * Directive extends
 *
 * Is used to extend child class from parent class
 *
 * For example:
 *
 *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
 *
 *         'use strict';
 *
 *         this.namespace = 'app.start.login';
 *
 *         this.extends = 'ns.User'; //Extended base model class. If no extended specified {@link xs.class.Base} is extended
 *
 *     });
 *
 * @member xs.class.preprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property extends
 */
xs.class.preprocessors.add('processExtends', function () {

    return true;
}, function (Class, descriptor) {
    var extended = descriptor.extends;

    log.trace(Class + '. Preparing to extend', {
        extended: extended
    });
    //if no parent given - extend from xs.class.Base
    if (!xs.isDefined(extended)) {
        log.trace(Class + '. Extending xs.class.Base');
        extend(Class, xs.class.Base);

        return;

        //else - extended is specified
    } else {

        //resolve parent name
        extended = Class.descriptor.resolveName(extended);
    }

    //assert, that parent is defined
    assert.ok(xs.ContractsManager.has(extended), '$Class: parent class `$extended` is not defined. Move it to imports section, please', {
        $Class: Class,
        $extended: extended
    });

    //get parent reference
    var Parent = xs.ContractsManager.get(extended);

    //check that parent is class
    assert.class(Parent, '$Class: contract `$Parent` is not a class', {
        $Class: Class,
        $Parent: Parent
    });

    //check that class is ready
    assert.not(Parent.isProcessing, '$Class: parent class `$Parent` is not processed yet. Move it to imports section, please', {
        $Class: Class,
        $Parent: Parent
    });

    log.trace(Class + '. Extending ' + Parent);
    //apply extends
    applyExtends(Class, Parent);
});

/**
 * Core extends function. Saves imported classes by aliases
 *
 * @ignore
 *
 * @method applyImports
 *
 * @param {Function} target target class
 * @param {Function} parent extended class
 */
function applyExtends(target, parent) {
    //extend
    extend(target, parent);

    //save extends to descriptor
    target.descriptor.extends = parent;
}

/**
 * Core extend function
 *
 * @ignore
 *
 * @param {Function} child child class
 * @param {Function} parent parent class
 */
function extend(child, parent) {
    //create fake constructor
    var Fn = function () {
    };

    //assign prototype for fake constructor
    Fn.prototype = parent.prototype;

    //assign new fake constructor's instance as child prototype, establishing correct prototype chain
    child.prototype = new Fn();

    //assign correct constructor instead fake constructor
    child.prototype.constructor = child;

    //save reference to parent
    xs.constant(child, 'parent', parent);

    /**
     * Returns whether Class is inherited from given Parent
     *
     * @member xs.class.Base
     *
     * @static
     *
     * @method inherits
     *
     * @param {Function} Parent verified Parent class
     *
     * @return {Boolean} whether given Parent class is parent according to this Class
     */
    xs.constant(child, 'inherits', function (Parent) {
        //assert, that Parent is class
        assert.class(Parent, 'Given Parent `$Parent` is not a class', {
            $Parent: Parent
        });

        return this.prototype instanceof Parent;
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsClassPreprocessorsProcessExtendsError
 */
function XsClassPreprocessorsProcessExtendsError(message) {
    this.message = 'xs.class.preprocessors.processExtends::' + message;
}

XsClassPreprocessorsProcessExtendsError.prototype = new Error();