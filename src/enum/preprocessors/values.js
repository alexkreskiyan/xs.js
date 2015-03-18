'use strict';

var log = new xs.log.Logger('xs.enum.preprocessors.values');

var assert = new xs.core.Asserter(log, XsEnumPreprocessorsValuesError);

/**
 * Preprocessor values
 * Is used to process enum constants
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.enum.preprocessors.add('values', function () {

    return true;
}, function (Enum, values) {

    //values

    //assert, that values list is an object
    assert.object(values, '$Enum: values list `$values` is not an object', {
        $Enum: Enum,
        $value: values
    });

    //convert to xs.core.Collection
    values = new xs.core.Collection(values);

    //get reference to descriptor
    var own = Enum.descriptor.value;

    //add values from raw descriptor and save to Enum.descriptor, define values as constants
    values.each(function (value, name) {
        assert.ok(name && xs.isString(name), '$Enum: given value name `$name` is incorrect', {
            $Enum: Enum,
            $name: name
        });

        //add value to collection
        own.add(name);

        //define value as constant
        xs.constant(Enum, name, value);
    });

    //define values as constant
    xs.constant(Enum, 'values', values.toSource());
});

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsEnumPreprocessorsValuesError
 */
function XsEnumPreprocessorsValuesError(message) {
    this.message = 'xs.enum.preprocessors.values::' + message;
}

XsEnumPreprocessorsValuesError.prototype = new Error();