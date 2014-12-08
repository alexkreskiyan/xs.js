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
    }, function ( Class, descriptor, ns, dependencies, ready ) {

        //if imports are specified not as object - throw respective error
        if ( !xs.isObject(descriptor.imports) ) {
            throw new ImportsError('incorrect imports list');
        }

        //init
        //get imports list
        var imports = descriptor.imports;

        //init loads list
        var loads = [];

        //init unprocessed list
        var unprocessed = [];


        //check imports to find not loaded ones
        xs.log('xs.class.preprocessor.imports. Imports:', imports);
        xs.each(imports, function ( alias, name ) {

            //resolve name with namespace
            name = Class.descriptor.namespace.resolve(name);

            xs.log('xs.class.preprocessor.imports. Importing:', name, 'as', alias);
            //if imported class is already loaded - continue to next item
            if (xs.ClassManager.has(name)) {

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

        xs.log('xs.class.preprocessor.imports. Loading', loads);
        //require async
        xs.require(loads, function ( classes ) {

            xs.log('xs.class.preprocessor.imports. Imports', loads, 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, xs.values(classes), function () {

                xs.log('xs.class.preprocessor.imports. Imports', loads, 'processed, applying imports');
                //apply imports
                _applyImports(Class, imports);

                //call ready to notify processor stack, that import succeed
                ready();
            });
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
            if ( xs.isString(alias) && alias ) {
                target.imports[alias] = xs.ClassManager.get(name);
            } else if ( alias !== null ) {
                throw new ImportsError('incorrect alias');
            }
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
    function ImportsError ( message ) {
        this.message = 'xs.class.preprocessors.imports :: ' + message;
    }

    ImportsError.prototype = new Error();
})(window, 'xs');