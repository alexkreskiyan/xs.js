'use strict';

var log = new xs.log.Logger('xs.lang.Array');

var assert = new xs.core.Asserter(log, XsLangArrayError);

/**
 * xs.lang.Array is private singleton, defining basic Array operations.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.lang.Array
 *
 * @singleton
 */
xs.Array = (function () {
    var me = {};

    /**
     * Shuffles array items
     *
     * For example:
     *
     *     xs.shuffle([
     *         1,
     *         2,
     *         3
     *     ]);
     *
     * @method shuffle
     *
     * @param {Array} array shuffled array
     */
    me.shuffle = function (array) {
        assert.array(array, 'shuffle - given `$array` is not array', {
            $array: array
        });

        array.sort(function () {
            return Math.random() - 0.5;
        });
    };

    return me;
})();

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsLangArrayError
 */
function XsLangArrayError(message) {
    this.message = 'xs.lang.Array::' + message;
}

XsLangArrayError.prototype = new Error();