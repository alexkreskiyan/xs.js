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

    var assert = new xs.core.Asserter(log, ValuesError);

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

        log.trace(Enum.label ? Enum.label : 'undefined');


        //values

        //assert, that values list is an object
        assert.object(values, '[$Enum]: values list `$values` is not an object', {
            $Enum: Enum.label,
            $value: values
        });

        //convert to xs.core.Collection
        values = new xs.core.Collection(values);

        //get reference to descriptor
        var own = Enum.descriptor.value;

        //add values from raw descriptor and save to Enum.descriptor, define values as constants
        values.each(function (value, name) {
            assert.ok(name && xs.isString(name), '[$Enum]: given value name `$name` is incorrect', {
                $Enum: Enum.label,
                $name: name
            });

            //add value to collection
            own.add(name);

            //define value as constant
            xs.constant(Enum, name, value);
        });

    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ValuesError
     */
    function ValuesError(message) {
        this.message = 'xs.enum.preprocessors.values::' + message;
    }

    ValuesError.prototype = new Error();

})(window, 'xs');