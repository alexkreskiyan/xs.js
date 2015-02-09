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

    var log = new xs.log.Logger('xs.interface.Interface');

    var assert = new xs.core.Asserter(log, StringError);

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
    var string = xs.String = (function () {
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
            assert.string(string, 'translate - given "$string" is not string', {
                $string: string
            });

            //assert that replaces are object
            assert.object(replaces, 'translate - given replaces "$replaces" are not object', {
                $replaces: replaces
            });

            Object.keys(replaces).forEach(function (from) {
                var to = replaces[from];
                string = string.split(from).join(to);
            });

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
     * @class StringError
     */
    function StringError(message) {
        this.message = 'xs.lang.String::' + message;
    }

    StringError.prototype = new Error();

    //extend xs with string
    Object.keys(string).forEach(function (key) {
        xs[key] = string[key];
    });
})(window, 'xs');