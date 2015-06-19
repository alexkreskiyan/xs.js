'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.prepareClass');

var assert = new xs.core.Asserter(log, XsClassPreprocessorsPrepareClassError);

/**
 * Preprocessor prepareClass
 * Implements basic class prepare operation
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 */
xs.class.preprocessors.add('prepareClass', function () {

    return true;
}, function (Class, descriptor) {

    //prepare requires
    processRequires(Class, descriptor);

    //prepare imports
    processImports(Class, descriptor);

    //prepare extends
    processExtends(Class, descriptor);

    //prepare mixins
    processMixins(Class, descriptor);

    //prepare implements
    processImplements(Class, descriptor);
});

function processRequires(Class, descriptor) {

    //assert that requires are an array
    assert.array(descriptor.requires, '$Class: given requires list `$requires` is not an array', {
        $Class: Class,
        $requires: descriptor.requires
    });

    //convert to xs.core.Collection and save reference
    descriptor.requires = new xs.core.Collection(descriptor.requires);

    //verify requires (fn is useless here - collection is temporary)
    assert.not(descriptor.requires.find(function (required) {

        //assert that required is a string
        assert.string(required, '$Class: required value `$required` is not a string', {
            $Class: Class,
            $required: required
        });

        //verify required name
        assert.fullName(required, '$Class: given required name `$name` is not correct', {
            $Class: Class,
            $name: required
        });
    }), 'Requires verification failed');
}

function processImports(Class, descriptor) {

    //assert that imports are an object
    assert.object(descriptor.imports, '$Class: given imports list `$imports` is not an object', {
        $Class: Class,
        $imports: descriptor.imports
    });

    //verify imports (fn is useless here - collection is temporary)
    assert.ok(verifyImportsBranch(Class, '', descriptor.imports), 'Imports verification failed');
}

function verifyImportsBranch(Class, namespace, branch) {
    var aliases = Object.keys(branch);

    for (var i = 0; i < aliases.length; i++) {
        var alias = aliases[ i ];
        var name = branch[ alias ];

        //verify alias is a short name
        assert.shortName(alias, '$Class: given imports alias `$alias` is not a valid short name', {
            $Class: Class,
            $alias: alias
        });

        if (xs.isString(name)) {
            //verify imported name
            assert.fullName(name, '$Class: given imported name `$name` is not correct', {
                $Class: Class,
                $name: name
            });
        } else {
            //verify imports branch
            assert.ok(verifyImportsBranch(Class, [
                namespace,
                alias
            ].join(''), name), 'Imports verification failed');
        }
    }

    return true;
}

function processExtends(Class, descriptor) {

    var extended = descriptor.extends;
    log.trace(Class + '. Extended:' + extended);

    if (!xs.isDefined(extended)) {

        return;
    }

    //assert that either extended is not defined or is defined as non-empty string
    assert.fullName(extended, '$Class: given extended `$extended` is incorrect', {
        $Class: Class,
        $extended: extended
    });

    //if extended is given - add it to requires
    descriptor.requires.add(extended);
}

function processMixins(Class, descriptor) {

    //assert that mixins are an object
    assert.object(descriptor.mixins, '$Class: given mixins list `$mixins` is not an object', {
        $Class: Class,
        $mixins: descriptor.mixins
    });

    //init mixins list with own values, converted to xs.core.Collection
    var mixins = descriptor.mixins = new xs.core.Collection(descriptor.mixins);

    //get requires reference
    var requires = descriptor.requires;

    //process mixins list
    log.trace(Class + '. Preparing to process mixins', {
        mixins: mixins.toSource()
    });
    mixins.each(function (name, alias) {
        //verify mixed class name
        assert.fullName(name, '$Class: given mixed class name `$name` is not a string', {
            $Class: Class,
            $name: name
        });

        //verify mixed class alias
        assert.shortName(alias, '$Class: given mixed class alias `$alias` is not correct', {
            $Class: Class,
            $alias: alias
        });

        requires.add(name);
    });
}

function processImplements(Class, descriptor) {

    //assert that implements are an array
    assert.array(descriptor.implements, '$Class: given interfaces list `$implements` is not an array', {
        $Class: Class,
        $implements: descriptor.implements
    });

    //init interfaces list with own values, converted to xs.core.Collection
    var interfaces = descriptor.implements = new xs.core.Collection(descriptor.implements);

    //get requires reference
    var requires = descriptor.requires;

    //process interfaces list
    log.trace(Class + '. Preparing to process interfaces', {
        interfaces: interfaces.toSource()
    });
    interfaces.each(function (name) {
        //verify implemented interface name
        assert.fullName(name, '$Class: given implemented interface name `$name` is incorrect', {
            $Class: Class,
            $name: name
        });

        requires.add(name);
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsClassPreprocessorsPrepareClassError
 */
function XsClassPreprocessorsPrepareClassError(message) {
    this.message = 'xs.class.preprocessors.prepareClass::' + message;
}

XsClassPreprocessorsPrepareClassError.prototype = new Error();