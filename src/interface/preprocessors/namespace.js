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

        xs.log('xs.interface.preprocessors.namespace');
        var namespace;

        //if namespace specified, it must be valid
        if (xs.isDefined(descriptor.namespace)) {
            xs.assert.ok(xs.ContractsManager.isName(descriptor.namespace), 'given namespace "$namespace" is not a valid name', {
                $namespace: descriptor.namespace
            }, NamespaceError);

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
     * @class NamespaceError
     */
    function NamespaceError(message) {
        this.message = 'xs.interface.preprocessors.namespace::' + message;
    }

    NamespaceError.prototype = new Error();
})(window, 'xs');