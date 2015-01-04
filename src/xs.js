/*!
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
(function (root, ns) {

    'use strict';

    /**
     * Framework entry point
     *
     * @class xs
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @singleton
     */
    root[ns] = new function () {
        var me = this;

        /**
         * Returns unique id
         *
         * @method uid
         *
         * @return {Number} unique id
         */
        me.uid = function () {
            return Math.round(Math.random() * 10e10);
        };

        /**
         * @method define
         * @inheritdoc xs.core.ContractsManager#define
         */
        /**
         * @method log
         * @inheritdoc xs.core.Debug#log
         */
        /**
         * Adds handler for event when classes' with given names will be loaded
         *
         * @method onReady
         *
         * @param {String[]} [waiting] waiting list. If empty - handler will be called when all pending classes will be loaded
         * @param {Function} handleReady onReady handler
         */
        /**
         * @method require
         * @inheritdoc xs.core.Loader#require
         */
        /**
         * @method constant
         * @inheritdoc xs.lang.Attribute#constant
         */
        /**
         * @method bind
         * @inheritdoc xs.lang.Function#bind
         */
        /**
         * @method memorize
         * @inheritdoc xs.lang.Function#memorize
         */
        /**
         * @method wrap
         * @inheritdoc xs.lang.Function#wrap
         */
        /**
         * @method nextTick
         * @inheritdoc xs.lang.Function#nextTick
         */
        /**
         * @method emptyFn
         * @inheritdoc xs.lang.Function#emptyFn
         */
        /**
         * @method clone
         * @inheritdoc xs.lang.List#clone
         */
        /**
         * @method extend
         * @inheritdoc xs.lang.Object#extend
         */
        /**
         * @method translate
         * @inheritdoc xs.lang.String#translate
         */
        /**
         * @method isObject
         * @inheritdoc xs.lang.Type#isObject
         */
        /**
         * @method isArray
         * @inheritdoc xs.lang.Type#isArray
         */
        /**
         * @method isFunction
         * @inheritdoc xs.lang.Type#isFunction
         */
        /**
         * @method isString
         * @inheritdoc xs.lang.Type#isString
         */
        /**
         * @method isNumber
         * @inheritdoc xs.lang.Type#isNumber
         */
        /**
         * @method isBoolean
         * @inheritdoc xs.lang.Type#isBoolean
         */
        /**
         * @method isRegExp
         * @inheritdoc xs.lang.Type#isRegExp
         */
        /**
         * @method isError
         * @inheritdoc xs.lang.Type#isError
         */
        /**
         * @method isNull
         * @inheritdoc xs.lang.Type#isNull
         */
        /**
         * @method isIterable
         * @inheritdoc xs.lang.Type#isIterable
         */
        /**
         * @method isPrimitive
         * @inheritdoc xs.lang.Type#isPrimitive
         */
        /**
         * @method isNumeric
         * @inheritdoc xs.lang.Type#isNumeric
         */
        /**
         * @method isDefined
         * @inheritdoc xs.lang.Type#isDefined
         */
        /**
         * @method isEmpty
         * @inheritdoc xs.lang.Type#isEmpty
         */
    };
})(window, 'xs');