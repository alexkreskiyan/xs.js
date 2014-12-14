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
        //if imports are specified not as object - throw respective error
        if (!xs.isArray(descriptor.imports)) {
            throw new ImportsError('[' + Class.label + ']: incorrect imports list');
        }


        //init
        //init requires list
        var requires = [];
        //init imports list
        var imports = {};


        //process imports list
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        //fill imports
        xs.each(descriptor.imports, function (imported) {

            //if imported is string - it's simply className without alias, added only to loads list
            if (xs.isString(imported)) {
                requires.push(resolveName(imported));

                //or imported my be used class - then it is specified as object
            } else if (xs.isObject(imported) && xs.size(imported) == 1) {

                //get name and alias
                var alias = xs.keys(imported)[0];
                var name = imported[alias];

                //if name is non-empty string - add it to both loads and imports
                if (xs.isString(name) && name) {
                    name = resolveName(name);
                    requires.push(name);
                    imports[name] = alias;

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
        var loads = xs.findAll(requires, function (name) {
            return !xs.ClassManager.has(name);
        });

        if (loads.length) {
            //load imported classes
            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Loading', loads);
            //require async
            xs.require(loads, _process);
        } else {
            //nothing to load
            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Nothing to load');
            _process();
        }

        //define process function
        function _process() {

            var waiting = xs.map(requires, function (name) {
                return xs.ClassManager.get(name);
            });

            xs.log('xs.class.preprocessor.imports[', Class.label, ']. Imports', loads, 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, waiting, function () {

                xs.log('xs.class.preprocessor.imports[', Class.label, ']. Imports', loads, 'processed, applying imports:', imports);
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
        xs.each(imports, function (alias, name) {
            //save class by alias in imports list
            target.imports[alias] = xs.ClassManager.get(name);
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