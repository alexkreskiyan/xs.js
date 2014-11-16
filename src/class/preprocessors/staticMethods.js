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
     * PreProcessor staticMethods
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('staticMethods', function () {
        return true;
    }, function (Class, descriptor) {

        //init methods as empty hash
        var methods = {};


        //inherited
        //get inherited static methods from parent descriptor
        var inherited = xs.isObject(Class.parent.descriptor.static) ? Class.parent.descriptor.static.methods : undefined;

        //extend static methods with inherited
        xs.isObject(inherited) && xs.extend(methods, inherited);


        //own
        //get own static methods from raw descriptor
        var own = xs.isObject(descriptor.static) ? descriptor.static.methods : undefined;

        //apply if any
        if (xs.isObject(own)) {
            //prepare them
            xs.each(own, function (value, name, list) {
                list[name] = xs.Attribute.method.prepare(value);
            });

            //extend methods with own ones
            xs.extend(methods, own);
        }


        //apply
        //save static methods to Class.descriptor
        xs.isObject(Class.descriptor.static) || (Class.descriptor.static = {});
        Class.descriptor.static.methods = methods;

        //apply all constants
        xs.each(methods, function (value, name) {
            xs.Attribute.method.define(Class, name, value);
        });
    });
})(window, 'xs');