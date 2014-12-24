/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Preprocessor singleton
     * Is used to mark class as singleton
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('singleton', function () {

        return true;
    }, function (Class, descriptor) {
        xs.log('xs.class.preprocessors.singleton[', Class.label, ']');
        Class.descriptor.singleton = Boolean(descriptor.singleton);
    });
})(window, 'xs');