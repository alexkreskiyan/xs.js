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

        //get imports list
        var imports = descriptor.imports;

        //init loads list
        var loads = [];


        xs.log('xs.class.preprocessor.imports. Imports:', imports);
        xs.each(imports, function ( alias, name ) {

            //resolve name with namespace
            name = Class.descriptor.namespace.resolve(name);

            //try to get imported class from ClassManager
            var imported = xs.ClassManager.get(name);

            xs.log('xs.class.preprocessor.imports. Importing:', name, 'as', alias);
            //if imported class is already loaded
            if ( imported ) {
                //if alias given -  save it in imports with alias
                if ( alias !== null ) {
                    xs.log('xs.class.preprocessor.imports. Imported', name, 'already loaded, saving as', alias, 'in imports');
                    Class.imports[alias] = imported;
                }

                return;
            }

            xs.log('xs.class.preprocessor.imports. Imported', name, 'not loaded yet, loading');
            //add class to load list
            loads.push(name);
        });

        //return if no loads required
        if ( !xs.size(loads) ) {
            //remove imports from Class
            delete Class.imports;

            return;
        }

        //require async
        xs.require(loads, function () {

            //assign imports
            xs.each(loads, function ( name ) {
                var alias = imports[name];
                //if alias given -  save it in imports with alias
                if ( alias !== null ) {
                    Class.imports[alias] = xs.ClassManager.get(name);
                }
            });

            //remove imports from Class
            delete Class.imports;

            //call ready to notify processor stack, that import succeed
            ready();
        });

        //return false to sign async processor
        return false;
    }, 'after', 'namespace');
})(window, 'xs');