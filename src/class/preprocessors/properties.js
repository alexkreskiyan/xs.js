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
     * Preprocessor properties
     * Is used to extend child class from parent class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('properties', function () {
        return true;
    }, function (Class, descriptor) {

        //init properties as empty hash
        var properties = {
            accessed: {},
            assigned: {}
        };


        //inherited
        //get inherited properties from parent descriptor
        var inherited = Class.parent.descriptor.properties;

        //extend properties with inherited
        if (xs.isObject(inherited)) {
            xs.extend(properties.accessed, inherited.accessed);
            xs.extend(properties.assigned, inherited.assigned);
        }


        //own
        //get own properties from raw descriptor and apply
        if (xs.isObject(descriptor.properties)) {
            var own = {
                accessed: {},
                assigned: {}
            };

            //prepare them
            xs.each(descriptor.properties, function (value, name) {
                var descriptor = xs.Attribute.property.prepare(name, value);

                //save depending on property type
                if (descriptor.get) {
                    own.accessed[name] = descriptor;
                } else {
                    own.assigned[name] = descriptor;
                }
            });

            //extend properties with own ones
            xs.extend(properties, own);
        }


        //apply
        //save properties to Class.descriptor
        Class.descriptor.properties = properties;

        //apply all accessed properties
        xs.each(properties.accessed, function (value, name) {
            xs.Attribute.property.define(Class.prototype, name, value);
        });
    });
})(window, 'xs');