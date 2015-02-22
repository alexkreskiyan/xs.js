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

    var assert = new xs.core.Asserter(log, MethodsError);

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

        //keyOf method
        xs.method.define(Enum, 'keyOf', xs.method.prepare('keyOf', function (value) {
            var values = this.values;
            var keys = Object.keys(values);

            var key = keys.filter(function (name) {

                return values[name] === value;
            }).shift();

            assert.defined(key, 'keyOf - given value `$value` is not a part of enum', {
                $value: value
            });

            return key;
        }));

        //has method
        xs.method.define(Enum, 'has', xs.method.prepare('has', function (value) {
            var values = this.values;
            var keys = Object.keys(values);

            return keys.some(function (name) {

                return values[name] === value;
            });
        }));
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class MethodsError
     */
    function MethodsError(message) {
        this.message = 'xs.enum.preprocessors.methods::' + message;
    }

    MethodsError.prototype = new Error();

})(window, 'xs');