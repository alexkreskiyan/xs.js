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

})(window, 'xs');