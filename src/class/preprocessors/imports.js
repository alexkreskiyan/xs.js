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
     * Preprocessor imports
     * Is used to process class imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.Class.preprocessors.add('imports', function () {

        return true;
    }, function (Class, descriptor, ns, dependencies, ready) {

        xs.log('xs.class.preprocessor.imports[', Class.label, ']');

        //init
        //init requires list
        var requires = new xs.core.Collection;
        //init imports list
        var imports = new xs.core.Collection;


        //process imports list
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        //fill imports
        descriptor.imports.each(function (imported) {
            var name;

            //if imported is string - it's simply className without alias, added only to loads list
            if (xs.isString(imported)) {
                name = resolveName(imported);
                requires.has(name) || requires.add(name);

                //or imported my be used class - then it is specified as object
            } else if (xs.isObject(imported) && Object.keys(imported).length == 1) {

                //get name and alias
                var alias = Object.keys(imported)[0];
                name = imported[alias];

                //if name is non-empty string - add it to both loads and imports
                if (xs.isString(name) && name) {
                    name = resolveName(name);
                    requires.has(name) || requires.add(name);
                    imports.add(name, alias);

                    //otherwise - incorrect alias error
                } else {
                    throw new ImportsError('[' + Class.label + ']: imported class "' + name + '" has incorrect alias - ' + alias);
                }

                //otherwise - incorrect imported value
            } else {
                throw new ImportsError('[' + Class.label + ']: incorrect imported item - ' + imported);
            }
        });

        //filter loads to find out already loaded ones
        var loads = requires.find(function (name) {
            return !xs.ContractsManager.has(name);
        }, xs.core.Collection.ALL);

        if (loads.length) {
            //load imported classes
            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Loading', loads.values());
            //require async
            xs.require(loads.values(), _process);
        } else {
            //nothing to load
            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Nothing to load');
            _process();
        }

        //define process function
        function _process() {

            var waiting = requires.map(function (name) {
                return xs.ContractsManager.get(name);
            });

            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Imports', loads.values(), 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, waiting, function () {

                xs.log('xs.class.preprocessor.imports[', Class.label, ']. Imports', loads.values(), 'processed, applying imports:', imports.toSource());
                //apply imports
                _applyImports(Class, imports);

                //call ready to notify processor stack, that import succeed
                ready();
            });
        }

        //return false to sign async processor
        return false;
    });

    /**
     * Core imports function. Saves imported classes by aliases
     *
     * @ignore
     *
     * @method applyImports
     *
     * @param {Object} target target class
     * @param {Object} imports mixins imports
     */
    var _applyImports = function (target, imports) {
        //assign imports
        imports.each(function (alias, name) {
            //save class by alias in imports list
            target.imports[alias] = xs.ContractsManager.get(name);
        });

        //remove imports from Class
        delete target.imports;
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ImportsError
     */
    function ImportsError(message) {
        this.message = 'xs.class.preprocessors.imports :: ' + message;
    }

    ImportsError.prototype = new Error();
})(window, 'xs');