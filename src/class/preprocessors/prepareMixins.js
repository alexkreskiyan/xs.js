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
     * Preprocessor prepareMixins
     * Is used to prepare mixins and add them to imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareMixins', function () {

        return true;
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessors.prepareMixins[', Class.label, ']');

        //init
        //init mixins list with own values
        var mixins = descriptor.mixins;


        //process
        //get imports reference
        var imports = descriptor.imports;

        //process mixins list
        xs.log('xs.class.preprocessors.prepareMixins[', Class.label, ']. Mixins:', mixins.toSource());
        mixins.each(function (name, alias) {
            //verify mixed class name
            xs.assert.ok(name && xs.isString(name), '[$Class]: given mixed class name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, PrepareMixinsError);

            //verify mixed class alias
            xs.assert.ok(alias, '[$Class]: given empty mixed class alias', {
                $Class: Class.label
            }, PrepareMixinsError);

            imports.add(name);
        });
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareMixinsError
     */
    function PrepareMixinsError(message) {
        this.message = 'xs.class.preprocessors.prepareMixins::' + message;
    }

    PrepareMixinsError.prototype = new Error();
})(window, 'xs');