'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.imports');

/**
 * Directive imports
 *
 * Is used to process class imports
 * Allows to declare and preload all contracts, used by current class, including specific ones:
 *
 * - extended class name
 * - class mixins' names
 * - implemented interfaces' names
 *
 * Syntax rules:
 *
 * - requires list is an array
 * - imports list is an object
 *
 * Actually, extended, mixed and implemented contracts (classes & interfaces) are automatically added to imports list, so
 * developer has no reason to duplicate them explicitly.
 *
 * Imported contracts are saved into second param of descriptor constructor.
 *
 * For example:
 *
 *     xs.define(xs.Class, 'ns.Customer', function(self, imports) {
 *
 *         'use strict';
 *
 *         this.namespace = 'app.start.login';
 *
 *         this.requires = [
 *             'SomeClass' //Is not resolved into any reference in imports object. Is required and imported anonymously
 *         ];
 *
 *         this.imports = {
 *             store: {
 *                 Users: 'ns.store.Users', //Some used store. Resolved for usage as imports.store.Users
 *                 Groups: 'ns.store.Groups' //Some used store. Resolved for usage as imports.store.Groups
 *             },
 *             view: {
 *                 Users: 'ns.view.Users'  //Some used view. Resolved for usage as imports.view.Users
 *             },
 *             Auth: 'ns.model.Auth' //Used Auth model. Is resolved as imports.Auth
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
}, function (Class, descriptor, dependencies, ready) {

    //init
    //init requires list
    var requires = new xs.core.Collection();
    //init imports list
    var imports = new xs.core.Collection();

    //process imports list
    //namespace shortcut
    var resolveName = Class.descriptor.resolveName;

    //process requires list - add unique entries, resolving names on fly
    descriptor.requires.each(function (name) {

        //resolve name
        name = resolveName(name);

        if (!requires.has(name)) {
            requires.add(name);
        }
    });

    //fill imports
    var collectImports = function (branch, namespace) {
        var aliases = Object.keys(branch);

        for (var i = 0; i < aliases.length; i++) {
            var alias = aliases[ i ];

            var fullName = namespace ? [
                namespace,
                alias
            ].join('.') : alias;

            var name = branch[ alias ];

            if (xs.isObject(name)) {

                //handle branch
                collectImports(name, fullName);

                continue;
            }

            //resolve name
            name = resolveName(name);

            if (!requires.has(name)) {
                requires.add(name);
            }

            imports.add(name, fullName);
        }
    };

    collectImports(descriptor.imports, '');

    //filter loads to find out already loaded ones
    var loads = requires.find(function (name) {
        return !xs.ContractsManager.has(name);
    }, xs.core.Collection.All);

    if (loads.size) {
        //load imported classes
        log.trace(Class + '. Loading', {
            loads: loads.values()
        });
        //require async
        xs.require(loads.values(), processImport);
    } else {
        //nothing to load
        log.trace(Class + '. Nothing to load');
        processImport();
    }

    //define process function
    function processImport() {

        var waiting = requires.map(function (name) {
            return xs.ContractsManager.get(name);
        });

        log.trace(Class + '. Imports loaded, applying dependency', {
            loads: loads.values()
        });
        //create new dependency
        dependencies.add(Class, waiting, function () {

            log.trace(Class + '. Imports loads processed, applying imports', {
                loads: loads.values(),
                imports: imports.toSource()
            });
            //apply imports
            applyImports(Class, imports);

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
function applyImports(target, imports) {
    //assign imports
    imports.each(function (alias, name) {
        //get alias short part
        var shortAlias = xs.ContractsManager.getName(alias);

        //get namespace
        var namespace = xs.ContractsManager.getNamespace(target.imports, xs.ContractsManager.getPath(alias));

        //save class by alias in imports list
        namespace[ shortAlias ] = xs.ContractsManager.get(name);
    });

    //remove imports from Class
    delete target.imports;
}