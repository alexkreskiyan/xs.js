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

    var log = new xs.log.Logger('xs.enum.preprocessors.values');

    /**
     * Preprocessor methods
     * Is used to assign internal methods to enum
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.enum.preprocessors.add('methods', function () {

        return true;
    }, function (Enum) {

        log.trace(Enum.label ? Enum.label : 'undefined');

        var hasDescriptor = xs.method.prepare('has', function (value) {
            var values = this.values;
            var keys = Object.keys(values);

            return keys.some(function (name) {

                return values[name] === value;
            });
        });

        xs.method.define(Enum, 'has', hasDescriptor);
    });

})(window, 'xs');