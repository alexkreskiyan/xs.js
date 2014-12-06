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
    var string = xs.String = new (function () {
        var me = this;

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
         *
         * @method translate
         *
         * @param {String} string translated string
         * @param {Object} replaces replaces hash, where keys are replaced strings and values are respective replaces
         *
         * @return {String} translated string
         */
        me.translate = function (string, replaces) {
            xs.each(replaces, function (to, from) {
                string = string.split(from).join(to);
            });

            return string;
        };
    });

    //extend xs with string
    xs.extend(xs, string);
})(window, 'xs');