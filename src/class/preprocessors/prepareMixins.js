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
    xs.Class.preprocessors.add('prepareMixins', function (Class, descriptor) {

        //is executed only if imports is given correctly
        return xs.isArray(descriptor.imports);
    }, function (Class, descriptor) {

        xs.log('xs.class.preprocessor.mixins[', Class.label, ']');
        //if mixins are specified not as object - throw respective error
        if (!xs.isObject(descriptor.mixins)) {
            throw new PrepareMixinsError('[' + Class.label + ']: incorrect mixins list');
        }


        //init
        //init mixins list with own values
        var mixins = Class.descriptor.mixins = descriptor.mixins;


        //process
        //get imports reference
        var imports = descriptor.imports;

        //process mixins list
        xs.log('xs.class.preprocessor.mixins[', Class.label, ']. Mixins:', mixins);
        xs.each(mixins, function (name, alias) {
            //verify mixed class name
            if (!xs.isString(name) || !name) {
                throw new PrepareMixinsError('[' + Class.label + ']: incorrect mixed class name');
            }

            //verify mixed class alias
            if (!alias) {
                throw new PrepareMixinsError('[' + Class.label + ']: incorrect mixed class alias');
            }

            imports.push(name);
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
        this.message = 'xs.class.preprocessors.mixin :: ' + message;
    }

    PrepareMixinsError.prototype = new Error();
})(window, 'xs');