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
 * Registers mixin pre-processor.
 * Is used to extend child class from parent class
 *
 * @ignore
 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Registers mixin pre-processor.
     */
    xs.Class.registerPreprocessor('mixin', function (Class, desc) {
        var mixClasses = {};

        if (!xs.Object.size(desc.mixins)) {
            return;
        }

        //process mixins
        xs.Object.each(desc.mixins, function (mixin, alias) {
            mixClasses[alias] = xs.ClassManager.get(mixin);
        });

        //overriden mixed storage, that will be defaulted to descriptor
        var mixed = {
            const:      {},
            static:     {
                properties: {},
                methods:    {}
            },
            properties: {},
            methods:    {}
        };

        //iterate mixins and prepare
        var descriptor;
        xs.Object.each(mixClasses, function (mixClass) {
            descriptor = mixClass.descriptor;
            xs.extend(mixed.const, descriptor.const);
            xs.extend(mixed.static.properties, descriptor.static.properties);
            xs.extend(mixed.static.methods, descriptor.static.methods);
            xs.extend(mixed.properties, descriptor.properties);
            xs.extend(mixed.methods, descriptor.methods);
        });

        //const
        desc.const = xs.Object.defaults(desc.const, mixed.const);
        //static properties and methods
        desc.static.properties = xs.Object.defaults(desc.static.properties, mixed.static.properties);
        desc.static.methods = xs.Object.defaults(desc.static.methods, mixed.static.methods);
        //public properties and methods
        desc.properties = xs.Object.defaults(desc.properties, mixed.properties);
        desc.methods = xs.Object.defaults(desc.methods, mixed.methods);
    }, function (Class, descriptor) {
        return xs.has(descriptor, 'mixins');
    });
})(window, 'xs');