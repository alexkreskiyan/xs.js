/*!
 This file is core of xs.js

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
 * Registers extend pre-processor.
 * Is used to extend child class from parent class
 *
 * @ignore
 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Core extend function
     *
     * @ignore
     *
     * @param {Function} child child class
     * @param {Function} parent parent class
     */
    var extend = function (child, parent) {
        //create fake constructor
        var fn = function () {
        };
        //assign fake constructor prototype
        fn.prototype = parent.prototype;
        //assign new fake constructor's instance as child prototype, establishing correct prototype chain
        child.prototype = new fn();
        //assign correct constructor instead fake constructor
        child.prototype.constructor = child;
        //save reference to parent
        xs.const(child, 'parent', parent);
    };

    /**
     * Registers extend pre-processor.
     *
     * @ignore
     */
    xs.Class.registerPreprocessor('extend', function (Class, desc, hooks, ready) {
        //if incorrect parent given - extend from Base
        if (!xs.isString(desc.extend)) {
            extend(Class, xs.Base);
            return;
        }

        //if parent class exists - extend from it
        //TODO namespaces workaround
        var Parent = xs.ClassManager.get(desc.extend);
        if (Parent) {
            extend(Class, Parent);
            return;
        }

        //check require is available
        if (!xs.require) {
            xs.Error.raise('xs.Loader not loaded. Class ' + desc.extend + ' load fails');
        }

        var me = this;
        //require async
        xs.require(desc.extend, function () {
            extend(Class, xs.ClassManager.get(desc.extend));
            ready.call(me, Class, desc, hooks);
        });

        //return false to sign async processor
        return false;
    }, function () {
        return true;
    });
})(window, 'xs');