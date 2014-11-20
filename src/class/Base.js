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
/**
 * xs.Base is base class for all classes, defined by {@link xs.ClassManager xs.ClassManager}.
 * All classes, defined that way, extend xs.Base
 *
 * @class xs.Base
 *
 * @author Alex Kreskiyan <brutalllord@gmail.com>
 *
 * @abstract
 */
xs.define('xs.Base', function (self) {
    return {
        static:  {
            methods: {

                /**
                 * Returns whether this is child of given parent
                 *
                 * For example:
                 *
                 *     Bird.inherits(Animal); //true
                 *     Bird.inherits(Transport); //false
                 *
                 * @static
                 *
                 * @method inherits
                 *
                 * @param {xs.Base} parent Class, being verified to be ancestor of this Class
                 *
                 * @return {Boolean} verification result
                 */
                inherits: function (parent) {
                    return this.prototype instanceof parent;
                }
            }
        },
        methods: {

            /**
             * Returns clone of this object. Basically clone is made by xs.clone
             *
             * @method clone
             *
             * @return {xs.Base} clone object
             */
            clone: function () {
                return xs.clone(this);
            },

            /**
             * Completes internal object destruction
             *
             * @method destroy
             */
            destroy: xs.emptyFn
        }
    };
});