'use strict';

var log = new xs.log.Logger('xs.enum.preprocessors.values');

var assert = new xs.core.Asserter(log, XsEnumPreprocessorsMethodsError);

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

    //keyOf method
    xs.method.define(Enum, 'keyOf', xs.method.prepare('keyOf', function (value) {
        var values = this.values;
        var keys = Object.keys(values);

        var key = keys.filter(function (name) {

            return values[ name ] === value;
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

            return values[ name ] === value;
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
 * @class XsEnumPreprocessorsMethodsError
 */
function XsEnumPreprocessorsMethodsError(message) {
    this.message = 'xs.enum.preprocessors.methods::' + message;
}

XsEnumPreprocessorsMethodsError.prototype = new Error();