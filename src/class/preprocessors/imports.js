/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

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
    xs.Class.preprocessors.add('imports', function ( Class, descriptor ) {

        return xs.isObject(descriptor.imports);
    }, function ( Class, descriptor, ns, ready ) {

        //init
        //get imports list
        var imports = descriptor.imports;

        //init loads list
        var loads = [];


        //check imports to find not loaded ones
        xs.log('xs.class.preprocessor.imports. Imports:', imports);
        xs.each(imports, function ( alias, name ) {

            //resolve name with namespace
            name = Class.descriptor.namespace.resolve(name);

            xs.log('xs.class.preprocessor.imports. Importing:', name, 'as', alias);
            //if imported class is already loaded - continue to next item
            if ( xs.ClassManager.has(name) ) {

                return;
            }

            xs.log('xs.class.preprocessor.imports. Imported', name, 'not loaded yet, loading');
            //add class to load list
            loads.push(name);
        });

        //if no loads required - apply imports immediately and return
        if ( !xs.size(loads) ) {

            //apply imports
            _applyImports(Class, imports);

            return;
        }

        //require async
        xs.require(loads, function () {

            //apply imports
            _applyImports(Class, imports);

            //call ready to notify processor stack, that import succeed
            ready();
        });

        //return false to sign async processor
        return false;
    }, 'after', 'namespace');

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
    var _applyImports = function ( target, imports ) {
        //assign imports
        xs.each(imports, function ( alias, name ) {
            //if alias given -  save it in imports with alias
            if ( alias !== null ) {
                target.imports[alias] = xs.ClassManager.get(name);
            }
        });

        //remove imports from Class
        delete target.imports;
    };
})(window, 'xs');