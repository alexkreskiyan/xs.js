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
     * PreProcessor const
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('const', function () {
        return true;
    }, function (Class, descriptor) {

        //init constants as empty hash
        var constants = {};


        //inherited
        //get inherited constants from parent descriptor
        var inherited = Class.parent.descriptor.const;

        //extend constants with inherited
        xs.isObject(inherited) && xs.extend(constants, inherited);


        //own
        //get own constants from raw descriptor
        var own = descriptor.const;

        //extend constants with own
        xs.isObject(own) && xs.extend(constants, own);


        //apply
        //save constants to Class.descriptor
        Class.descriptor.const = constants;

        //apply all constants
        xs.each(constants, function (value, name) {
            xs.const(Class, name, value);
        });
    });
})(window, 'xs');