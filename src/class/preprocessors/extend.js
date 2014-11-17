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

        //assign prototype for fake constructor
        fn.prototype = parent.prototype;

        //assign new fake constructor's instance as child prototype, establishing correct prototype chain
        child.prototype = new fn();

        //assign correct constructor instead fake constructor
        child.prototype.constructor = child;

        //save reference to parent
        xs.const(child, 'parent', parent);
    };

    /**
     * Preprocessor extend
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('extend', function () {
        return true;
    }, function (Class, descriptor, ns, ready) {
        var extended = descriptor.extends;

        //if incorrect/no parent given - extend from xs.Base
        if (!xs.isString(extended)) {
            extend(Class, xs.Base);

            return;
        }

        //TODO namespaces workaround (here extend is replaced with real name through namespace)

        //try to get parent from ClassManager
        var parent = xs.ClassManager.get(extended);

        //extend from parent, if exists
        if (parent) {
            extend(Class, parent);

            //save extends to descriptor
            Class.descriptor.extends = extended;

            return;
        }

        //require async
        xs.require(extended, function () {
            extend(Class, xs.ClassManager.get(extended));

            //save extends to descriptor
            Class.descriptor.extends = extended;

            ready();
        });

        //return false to sign async processor
        return false;
    });
})(window, 'xs');