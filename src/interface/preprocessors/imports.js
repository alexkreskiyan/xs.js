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

    var log = new xs.log.Logger('xs.interface.preprocessors.imports');

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
    }, function (Interface, descriptor, dependencies, ready) {

        log.trace(Interface.label ? Interface.label : 'undefined');

        //init
        //init requires list
        var requires = new xs.core.Collection();


        //process imports list
        //namespace shortcut
        var resolveName = Interface.descriptor.resolveName;
        //fill imports
        descriptor.imports.each(function (imported) {
            var name;

            //simply interfaceName without alias, added only to loads list
            name = resolveName(imported);

            if (!requires.has(name)) {
                requires.add(name);
            }
        });

        //filter loads to find out already loaded ones
        var loads = requires.find(function (name) {
            return !xs.ContractsManager.has(name);
        }, xs.core.Collection.All);

        if (loads.length) {
            //load imported interfaces
            log.trace((Interface.label ? Interface.label : 'undefined') + '. Loading', {
                loads: loads.values()
            });
            //require async
            xs.require(loads.values(), processImports);
        } else {
            //nothing to load
            log.trace((Interface.label ? Interface.label : 'undefined') + '. Nothing to load');
            processImports();
        }

        //define process function
        function processImports() {

            var waiting = requires.map(function (name) {
                return xs.ContractsManager.get(name);
            });

            log.trace((Interface.label ? Interface.label : 'undefined') + '. Imports loaded, applying dependency', {
                loads: loads.values()
            });
            //create new dependency
            dependencies.add(Interface, waiting, function () {

                log.trace((Interface.label ? Interface.label : 'undefined') + '. Imports processed', {
                    loads: loads.values()
                });

                //call ready to notify processor stack, that import succeed
                ready();
            });
        }

        //return false to sign async processor
        return false;
    });

})(window, 'xs');