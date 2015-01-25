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
     * Directive imports
     *
     * Is used to process class imports
     * Allows to declare and preload all classes, used by current class, including specific ones:
     *
     * - extended class name
     * - class mixins' names
     * - implemented interfaces' names
     *
     * Syntax rules:
     *
     * - imports list is an Array
     * - anonymously imported contract is declared with absolute/relative string name
     * - alias-basing used imported contract is declared with object of single property,
     * which names means alias and value - name of imported contract
     *
     * Actually, extended, mixed and implemented contracts (classes & interfaces) are automatically added to imports list, so
     * developer has no reason to duplicate them explicitly.
     *
     * Imported classes are saved into second param of descriptor constructor.
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login';
     *
     *         this.imports = [
     *             {'store.Users': 'ns.store.Users'}, //Some used store. Resolved for usage as imports.store.Users
     *             {'store.Groups': 'ns.store.Groups'}, //Some used store. Resolved for usage as imports.store.Groups
     *             {'view.Users': 'ns.view.Users'},  //Some used view. Resolved for usage as imports.view.Users
     *             {'Auth': 'ns.model.Auth'}, //Used Auth model. Is resolved as imports.Auth
     *             'SomeClass' //Is not resolved into any reference in imports object. Is required and imported anonymously
     *         ];
     *
     *
     *         this.extends = 'ns.User'; //Extended base model class. Is automatically anonymously imported
     *
     *         this.mixins.CanBuy = 'ns.mixins.CanBuy'; //Name of some used mixin. Perhaps, mixin 'app.start.login.mixins.CanBuy'
     *                                                  //allows Customer to buy something
     *
     *         this.implements = ['ns.IUser'];   //Name of implemented interface. Is automatically anonymously imported
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property imports
     */
    xs.class.preprocessors.add('imports', function () {

        return true;
    }, function (Class, descriptor, ns, dependencies, ready) {

        xs.log('xs.class.preprocessors.imports[', Class.label, ']');

        //init
        //init requires list
        var requires = new xs.core.Collection();
        //init imports list
        var imports = new xs.core.Collection();


        //process imports list
        //namespace shortcut
        var resolveName = Class.descriptor.resolveName;
        //fill imports
        descriptor.imports.each(function (imported) {
            var name;

            //assert that imported is either string or key=>value single pair
            xs.assert.ok(xs.isString(imported) || (xs.isObject(imported) && Object.keys(imported).length === 1), '[$Class]: imported value $imported is incorrect', {
                $Class: Class.label,
                $imported: imported
            }, ImportsError);

            //handle imported string - it's simply className without alias, added only to loads list
            if (xs.isString(imported)) {
                name = resolveName(imported);
                if (!requires.has(name)) {
                    requires.add(name);
                }

                //handle imported key=>value pair
            } else {

                //get name and alias
                var alias = Object.keys(imported)[0];
                name = imported[alias];

                //if name is non-empty string - add it to both loads and imports
                xs.assert.ok(xs.isString(name) && name, '[$Class]: imported class "$name" has incorrect alias - $alias', {
                    $Class: Class.label,
                    $name: name,
                    $alias: alias
                }, ImportsError);
                name = resolveName(name);

                if (!requires.has(name)) {
                    requires.add(name);
                }

                imports.add(name, alias);
            }
        });

        //filter loads to find out already loaded ones
        var loads = requires.find(function (name) {
            return !xs.ContractsManager.has(name);
        }, xs.core.Collection.ALL);

        if (loads.length) {
            //load imported classes
            xs.log('xs.class.preprocessors.imports[', Class.label, ']. Loading', loads.values());
            //require async
            xs.require(loads.values(), _process);
        } else {
            //nothing to load
            xs.log('xs.class.preprocessors.imports[', Class.label, ']. Nothing to load');
            _process();
        }

        //define process function
        function _process() {

            var waiting = requires.map(function (name) {
                return xs.ContractsManager.get(name);
            });

            xs.log('xs.class.preprocessors.imports[', Class.label, ']. Imports', loads.values(), 'loaded, applying dependency');
            //create new dependency
            dependencies.add(Class, waiting, function () {

                xs.log('xs.class.preprocessors.imports[', Class.label, ']. Imports', loads.values(), 'processed, applying imports:', imports.toSource());
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
        this.message = 'xs.class.preprocessors.imports::' + message;
    }

    ImportsError.prototype = new Error();
})(window, 'xs');