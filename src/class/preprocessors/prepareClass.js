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

    var logger = new xs.log.Logger('xs.class.preprocessors.prepareClass');

    /**
     * Preprocessor prepareClass
     * Implements basic class prepare operation
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.class.preprocessors.add('prepareClass', function () {

        return true;
    }, function (Class, descriptor) {

        logger.trace(Class.label ? Class.label : 'undefined');

        //prepare imports
        _processImports(Class, descriptor);

        //prepare extends
        _processExtends(Class, descriptor);

        //prepare mixins
        _processMixins(Class, descriptor);

        //prepare implements
        _processImplements(Class, descriptor);
    });

    var _processImports = function (Class, descriptor) {

        //assert that imports are an array
        xs.assert.array(descriptor.imports, '[$Class]: given imports list "$imports" is not an array', {
            $Class: Class.label,
            $imports: descriptor.imports
        }, PrepareClassError);

        //convert to xs.core.Collection and save reference
        descriptor.imports = new xs.core.Collection(descriptor.imports);

        //verify imports (tester is useless here - collection is temporary)
        xs.assert.not(descriptor.imports.find(function (imported) {

            //assert that imported is either string or key=>value single pair
            xs.assert.ok(xs.isString(imported) || (xs.isObject(imported) && Object.keys(imported).length === 1), '[$Class]: imported value $imported is incorrect', {
                $Class: Class.label,
                $imported: imported
            }, PrepareClassError);

            if (xs.isString(imported)) {
                //verify imported name
                xs.assert.ok(xs.ContractsManager.isName(imported), '[$Class]: given imported name "$name" is not correct', {
                    $Class: Class.label,
                    $name: imported
                }, PrepareClassError);

                return;
            }

            //get name and alias
            var alias = Object.keys(imported)[0];
            var name = imported[alias];

            //verify imported name
            xs.assert.ok(xs.ContractsManager.isName(name), '[$Class]: given imported name "$name" is not correct', {
                $Class: Class.label,
                $name: name
            }, PrepareClassError);

            //verify imported alias
            xs.assert.ok(xs.ContractsManager.isName(alias), '[$Class]: given imported alias "$alias" is not correct', {
                $Class: Class.label,
                $alias: alias
            }, PrepareClassError);
        }));
    };

    var _processExtends = function (Class, descriptor) {

        var extended = descriptor.extends;
        logger.trace((Class.label ? Class.label : 'undefined') + '. Extended:' + extended);

        //assert that either extended is not defined or is defined as non-empty string
        xs.assert.ok(!xs.isDefined(extended) || (xs.ContractsManager.isName(extended)), '[$Class]: given extended "$extended" is incorrect', {
            $Class: Class.label,
            $extended: extended
        }, PrepareClassError);

        //if extended is given - add it to imports
        if (extended) {
            descriptor.imports.add(extended);
        }
    };

    var _processMixins = function (Class, descriptor) {

        //assert that mixins are an object
        xs.assert.object(descriptor.mixins, '[$Class]: given mixins list "$mixins" is not an object', {
            $Class: Class.label,
            $mixins: descriptor.mixins
        }, PrepareClassError);

        //init mixins list with own values, converted to xs.core.Collection
        var mixins = descriptor.mixins = new xs.core.Collection(descriptor.mixins);

        //get imports reference
        var imports = descriptor.imports;

        //process mixins list
        logger.trace((Class.label ? Class.label : 'undefined') + '. Preparing to process mixins', {
            mixins: mixins.toSource()
        });
        mixins.each(function (name, alias) {
            //verify mixed class name
            xs.assert.ok(xs.ContractsManager.isName(name), '[$Class]: given mixed class name "$name" is not a string', {
                $Class: Class.label,
                $name: name
            }, PrepareClassError);

            //verify mixed class alias
            xs.assert.ok(xs.ContractsManager.isShortName(alias), '[$Class]: given mixed class alias "$alias" is not correct', {
                $Class: Class.label,
                $alias: alias
            }, PrepareClassError);

            imports.add(name);
        });
    };

    var _processImplements = function (Class, descriptor) {

        //assert that implements are an array
        xs.assert.array(descriptor.implements, '[$Class]: given interfaces list "$implements" is not an array', {
            $Class: Class.label,
            $implements: descriptor.implements
        }, PrepareClassError);

        //init interfaces list with own values, converted to xs.core.Collection
        var interfaces = descriptor.implements = new xs.core.Collection(descriptor.implements);

        //get imports reference
        var imports = descriptor.imports;

        //process interfaces list
        logger.trace((Class.label ? Class.label : 'undefined') + '. Preparing to process interfaces', {
            interfaces: interfaces.toSource()
        });
        interfaces.each(function (name) {
            //verify implemented interface name
            xs.assert.ok(xs.ContractsManager.isName(name), '[$Class]: given implemented interface name "$name" is incorrect', {
                $Class: Class.label,
                $name: name
            }, PrepareClassError);

            imports.add(name);
        });
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PrepareClassError
     */
    function PrepareClassError(message) {
        this.message = 'xs.class.preprocessors.prepareClass::' + message;
    }

    PrepareClassError.prototype = new Error();
})(window, 'xs');