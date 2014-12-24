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

        xs.log('xs.class.preprocessor.prepareMixins[', Class.label, ']');

        //init
        //init mixins list with own values
        var mixins = Class.descriptor.mixins = descriptor.mixins;


        //process
        //get imports reference
        var imports = descriptor.imports;

        //process mixins list
        xs.log('xs.class.preprocessor.prepareMixins[', Class.label, ']. Mixins:', mixins.toSource());
        mixins.each(function (name, alias) {
            //verify mixed class name
            if (!xs.isString(name) || !name) {
                throw new PrepareMixinsError('[' + Class.label + ']: incorrect mixed class name');
            }

            //verify mixed class alias
            if (!alias) {
                throw new PrepareMixinsError('[' + Class.label + ']: incorrect mixed class alias');
            }

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
        this.message = 'xs.class.preprocessors.prepareMixins :: ' + message;
    }

    PrepareMixinsError.prototype = new Error();
})(window, 'xs');