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

    /*!
     * Register singleton preprocessor
     */
    xs.Class.registerPreprocessor('singleton', function (Class, desc, hooks, ready) {
        if (desc.singleton) {
            ready.call(this, new Class, desc, hooks);
            return false;
        }
    }, 'singleton');
})(window, 'xs');