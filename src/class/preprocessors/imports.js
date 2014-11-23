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
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     */
    xs.Class.preprocessors.add('imports', function (Class, descriptor) {

        return xs.isObject(descriptor.imports);
    }, function (Class, descriptor, ns, ready) {

        //get imports list
        var imports = descriptor.imports;

        //init loads list
        var loads = {};


        //init imported variable
        var imported;
        xs.each(imports, function (alias, name) {

            //resolve name with namespace
            name = Class.descriptor.namespace.resolve(name);
            
            //try to get imported class from ClassManager
            imported = xs.ClassManager.get(name);

            //if imported class is already loaded - save it in imports with alias
            if (imported) {
                Class.imports[alias] = imported;

                return;
            }

            //mark incomplete load
            loads[name] = false;

            //require async
            xs.require(name, xs.prefill(function (alias, name) {

                //mark load complete
                loads[name] = true;

                //set imported class
                Class.imports[alias] = xs.ClassManager.get(name); //TODO async require

                //if all ready - continue
                xs.every(loads, function (result) {
                    return result;
                }) && ready();

            }, [
                alias,
                name
            ]));
        });

        //return false to mark async execution if load initiated
        if (xs.size(loads)) {
            return false;
        }
    });
})(window, 'xs');