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

        xs.logToConsole('xs.interface.preprocessors.imports[', Interface.label, ']');

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
            xs.logToConsole('xs.interface.preprocessors.imports[', Interface.label, ']. Loading', loads.values());
            //require async
            xs.require(loads.values(), _process);
        } else {
            //nothing to load
            xs.logToConsole('xs.interface.preprocessors.imports[', Interface.label, ']. Nothing to load');
            _process();
        }

        //define process function
        function _process() {

            var waiting = requires.map(function (name) {
                return xs.ContractsManager.get(name);
            });

            xs.logToConsole('xs.interface.preprocessors.imports[', Interface.label, ']. Imports', loads.values(), 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Interface, waiting, function () {

                xs.logToConsole('xs.interface.preprocessors.imports[', Interface.label, ']. Imports', loads.values(), 'processed');

                //call ready to notify processor stack, that import succeed
                ready();
            });
        }

        //return false to sign async processor
        return false;
    });

})(window, 'xs');