'use strict';

var log = new xs.log.Logger('xs.interface.Interface');

var assert = new xs.core.Asserter(log, XsLangObjectError);

/**
 * xs.lang.List is private singleton, defining basic Object operations.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.lang.Object
 *
 * @singleton
 */
xs.Object = (function () {
    var me = {};

    /**
     * Copies all properties from objects, passed as arguments to given obj
     *
     * For example:
     *
     *     var list = {
     *         x: 1
     *     };
     *     xs.apply(list, {
     *         x: 2,
     *         c: 1
     *     }, {
     *         c: 2,
     *         x: 3,
     *         a: 4
     *     });
     *     console.log(list);
     *     //outputs:
     *     //{
     *     //    x: 3,
     *     //    c: 2,
     *     //    a: 4
     *     //}
     *
     * @method apply
     *
     * @param {Object} object extended object
     */
    me.apply = function (object) {

        //assert that object given
        assert.object(object, 'apply - given `$object` is not object', {
            $object: object
        });

        var length = arguments.length;

        //iterate over add-ons
        for (var i = 1; i < length; i++) {
            var source = arguments[ i ];

            //continue if source is not object
            if (!xs.isObject(source)) {
                continue;
            }

            var sourceKeys = Object.keys(source);
            var sourceLength = sourceKeys.length;

            for (var j = 0; j < sourceLength; j++) {
                var key = sourceKeys[ j ];
                object[ key ] = source[ key ];
            }
        }

        return object;
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
 * @class XsLangObjectError
 */
function XsLangObjectError(message) {
    this.message = 'xs.lang.Object::' + message;
}

XsLangObjectError.prototype = new Error();

//extend xs with object
Object.keys(xs.Object).forEach(function (key) {
    xs[ key ] = xs.Object[ key ];
});