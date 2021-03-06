'use strict';

var log = new xs.log.Logger('xs.interface.Interface');

var assert = new xs.core.Asserter(log, XsLangStringError);

/**
 * xs.lang.String is private singleton, defining basic string operations.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.lang.String
 *
 * @singleton
 */
xs.String = (function () {
    var me = {};

    /**
     * Translates string with given replacements
     *
     * For example:
     *
     *     console.log(xs.translate('My fox is small and brown. I love my small brown fox', {
     *         small: 'big',
     *         brown: 'black',
     *         fox: 'bear'
     *     }));
     *     //outputs:
     *     //My bear is big and black. I love my big black bear
     *
     * @method translate
     *
     * @param {String} string translated string
     * @param {Object} replaces replaces hash, where keys are replaced strings and values are respective replaces
     *
     * @return {String} translated string
     */
    me.translate = function (string, replaces) {
        //assert that first argument is string
        assert.string(string, 'translate - given `$string` is not string', {
            $string: string
        });

        //assert that replaces are object
        assert.object(replaces, 'translate - given replaces `$replaces` are not object', {
            $replaces: replaces
        });

        var keys = Object.keys(replaces);
        var length = keys.length;

        for (var i = 0; i < length; i++) {
            var from = keys[ i ];
            var to = replaces[ from ];

            if (string.indexOf(from) >= 0) {
                string = string.split(from).join(to);
            }
        }

        return string;
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
 * @class XsLangStringError
 */
function XsLangStringError(message) {
    this.message = 'xs.lang.String::' + message;
}

XsLangStringError.prototype = new Error();

//extend xs with string
Object.keys(xs.String).forEach(function (key) {
    xs[ key ] = xs.String[ key ];
});