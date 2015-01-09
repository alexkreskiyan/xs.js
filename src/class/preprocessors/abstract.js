/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * Preprocessor abstract
     * Is used to mark class as abstract
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('abstract', function () {

        return true;
    }, function (Class, descriptor) {
        xs.log('xs.class.preprocessors.abstract[', Class.label, ']');
        Class.descriptor.abstract = Boolean(descriptor.abstract);
    });
})(window, 'xs');