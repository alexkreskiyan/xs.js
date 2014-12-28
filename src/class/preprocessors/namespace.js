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
     * Is used to work with class namespace
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('namespace', function () {

        return true;
    }, function (Class, descriptor, ns, dependencies, ready) {

        xs.log('xs.class.preprocessors.namespace');
        var namespace = (xs.isString(descriptor.namespace) && descriptor.namespace.length) ? descriptor.namespace : undefined;
        //save namespace
        Class.descriptor.resolveName = function (path) {

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

        //continue on next tick to allow ContractsManager check class name
        xs.nextTick(ready);

        //return false to sign async processor
        return false;
    });
})(window, 'xs');