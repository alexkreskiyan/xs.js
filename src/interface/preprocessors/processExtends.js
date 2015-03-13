'use strict';

var log = new xs.log.Logger('xs.interface.preprocessors.processExtends');

var assert = new xs.core.Asserter(log, ProcessExtendsError);

/**
 * Preprocessor processExtends
 * Is used to extend child interface from parent interface
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.interface.preprocessors.add('processExtends', function () {

    return true;
}, function (Interface, descriptor) {
    var extended = descriptor.extends;

    log.trace(Interface + '. Extended ' + extended);
    //if no parent given - extend from xs.interface.Base
    if (!xs.isDefined(extended)) {
        log.trace(Interface + '. Extending xs.interface.Base');
        extend(Interface, xs.interface.Base);

        return;

        //else - extended is specified
    } else {

        //resolve parent name
        extended = Interface.descriptor.resolveName(extended);
    }

    //assert, that parent is defined
    assert.ok(xs.ContractsManager.has(extended), '$Interface: parent interface `$extended` is not defined. Move it to imports section, please', {
        $Interface: Interface,
        $extended: extended
    });

    //get parent reference
    var Parent = xs.ContractsManager.get(extended);

    //check that parent is interface
    assert.Interface(Parent, '$Interface: contract `$Parent` is not an interface', {
        $Interface: Interface,
        $Parent: Parent
    });

    //check that interface is ready
    assert.not(Parent.isProcessing, '$Interface: parent interface `$Parent` is not processed yet. Move it to imports section, please', {
        $Interface: Interface,
        $Parent: Parent
    });

    log.trace(Interface + '. Extending ' + Parent);
    //apply extends
    applyExtends(Interface, Parent);
});

/**
 * Core extends function. Saves imported interfaces by aliases
 *
 * @ignore
 *
 * @method applyImports
 *
 * @param {Function} target target interface
 * @param {Function} parent extended interface
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
 * @param {Function} child child interface
 * @param {Function} parent parent interface
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

    //add inherits method
    xs.constant(child, 'inherits', function (parent) {
        return this.prototype instanceof parent;
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class ProcessExtendsError
 */
function ProcessExtendsError(message) {
    this.message = 'xs.interface.preprocessors.processExtends::' + message;
}

ProcessExtendsError.prototype = new Error();