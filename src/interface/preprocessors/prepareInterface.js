'use strict';

var log = new xs.log.Logger('xs.interface.preprocessors.prepareInterface');

var assert = new xs.core.Asserter(log, XsInterfacePreprocessorsPrepareInterfaceError);

/**
 * Preprocessor prepareInterface
 * Implements basic interface prepare operation
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.interface.preprocessors.add('prepareInterface', function () {

    return true;
}, function (Interface, descriptor) {

    //prepare imports

    //create new empty collection
    descriptor.imports = new xs.core.Collection();


    //prepare extends

    var extended = descriptor.extends;
    log.trace(Interface + '. Extended ', {
        extended: extended
    });

    //assert that either extended is not defined or is defined as non-empty string
    assert.ok(!xs.isDefined(extended) || (xs.ContractsManager.isName(extended)), '$Interface: given extended `$extended` is incorrect', {
        $Interface: Interface,
        $extended: extended
    });

    //if extended is given - add it to imports
    if (extended) {
        descriptor.imports.add(extended);
    }

});

/**
 * Internal error interface
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsInterfacePreprocessorsPrepareInterfaceError
 */
function XsInterfacePreprocessorsPrepareInterfaceError(message) {
    this.message = 'xs.interface.preprocessors.prepareInterface::' + message;
}

XsInterfacePreprocessorsPrepareInterfaceError.prototype = new Error();