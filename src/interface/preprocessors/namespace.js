'use strict';

var log = new xs.log.Logger('xs.interface.preprocessors.namespace');

var assert = new xs.core.Asserter(log, XsInterfacePreprocessorsNamespaceError);

/**
 * Preprocessor namespace
 * Is used to work with interface namespace
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.interface.preprocessors.add('namespace', function () {

    return true;
}, function (Interface, descriptor, dependencies, ready) {

    log.trace('');
    var namespace;

    //if namespace specified, it must be valid
    if (xs.isDefined(descriptor.namespace)) {
        assert.fullName(descriptor.namespace, 'given namespace `$namespace` is not a valid name', {
            $namespace: descriptor.namespace
        });

        namespace = descriptor.namespace;
    }

    //save namespace
    Interface.descriptor.resolveName = function (path) {

        //simply return path, if namespace is empty
        if (!namespace) {

            return path;
        }

        //if name starts from namespace - resolve it
        if (path.substring(0, 3) === 'ns.') {

            return namespace + path.substring(2);
        }

        //else - simply return path
        return path;
    };

    //continue on next tick to allow ContractsManager check interface name
    xs.nextTick(ready);

    //return false to sign async processor
    return false;
});

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsInterfacePreprocessorsNamespaceError
 */
function XsInterfacePreprocessorsNamespaceError(message) {
    this.message = 'xs.interface.preprocessors.namespace::' + message;
}

XsInterfacePreprocessorsNamespaceError.prototype = new Error();