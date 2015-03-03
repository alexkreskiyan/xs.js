'use strict';

var log = new xs.log.Logger('xs.enum.preprocessors.namespace');

/**
 * Preprocessor namespace
 * Is used to work with enum namespace
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.enum.preprocessors.add('namespace', function () {

    return true;
}, function (Enum, values, ready) {

    log.trace('');

    //save namespace
    Enum.descriptor.resolveName = function (path) {

        //simply return path, namespace is empty
        return path;
    };

    //continue on next tick to allow ContractsManager check enum name
    xs.nextTick(ready);

    //return false to sign async processor
    return false;
});