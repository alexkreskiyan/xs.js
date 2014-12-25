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
     * Is used to process interface imports
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     */
    xs.interface.preprocessors.add('imports', function () {

        return true;
    }, function (Interface, descriptor, ns, dependencies, ready) {

        xs.log('xs.interface.preprocessors.imports[', Interface.label, ']');

        //init
        //init requires list
        var requires = new xs.core.Collection;
        //init imports list
        var imports = new xs.core.Collection;


        //process imports list
        //namespace shortcut
        var resolveName = Interface.descriptor.resolveName;
        //fill imports
        descriptor.imports.each(function (imported) {
            var name;

            //if imported is string - it's simply interfaceName without alias, added only to loads list
            if (xs.isString(imported)) {
                name = resolveName(imported);
                requires.has(name) || requires.add(name);

                //or imported my be used interface - then it is specified as object
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
                    throw new ImportsError('[' + Interface.label + ']: imported interface "' + name + '" has incorrect alias - ' + alias);
                }

                //otherwise - incorrect imported value
            } else {
                throw new ImportsError('[' + Interface.label + ']: incorrect imported item - ' + imported);
            }
        });

        //filter loads to find out already loaded ones
        var loads = requires.find(function (name) {
            return !xs.ContractsManager.has(name);
        }, xs.core.Collection.ALL);

        if (loads.length) {
            //load imported interfacees
            xs.log('xs.interface.preprocessors.imports[', Interface.label, ']. Loading', loads.values());
            //require async
            xs.require(loads.values(), _process);
        } else {
            //nothing to load
            xs.log('xs.interface.preprocessors.imports[', Interface.label, ']. Nothing to load');
            _process();
        }

        //define process function
        function _process() {

            var waiting = requires.map(function (name) {
                return xs.ContractsManager.get(name);
            });

            xs.log('xs.interface.preprocessors.imports[', Interface.label, ']. Imports', loads.values(), 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Interface, waiting, function () {

                xs.log('xs.interface.preprocessors.imports[', Interface.label, ']. Imports', loads.values(), 'processed, applying imports:', imports.toSource());
                //apply imports
                _applyImports(Interface, imports);

                //call ready to notify processor stack, that import succeed
                ready();
            });
        }

        //return false to sign async processor
        return false;
    });

    /**
     * Core imports function. Saves imported interfacees by aliases
     *
     * @ignore
     *
     * @method applyImports
     *
     * @param {Object} target target interface
     * @param {Object} imports mixins imports
     */
    var _applyImports = function (target, imports) {
        //assign imports
        imports.each(function (alias, name) {
            //save interface by alias in imports list
            target.imports[alias] = xs.ContractsManager.get(name);
        });

        //remove imports from Interface
        delete target.imports;
    };

    /**
     * Internal error interface
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @interface ImportsError
     */
    function ImportsError(message) {
        this.message = 'xs.interface.preprocessors.imports::' + message;
    }

    ImportsError.prototype = new Error();
})(window, 'xs');