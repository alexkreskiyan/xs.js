'use strict';

var log = new xs.log.Logger('xs.class.preprocessors.resources');

var assert = new xs.core.Asserter(log, XsClassPreprocessorsResourcesError);

/**
 * Directive resources
 *
 * Is used to process class resources
 * Allows to declare and preload some resources, used by current class statically, and, therefore, shared between all class instances
 *
 * @member xs.class.preprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property resources
 */
xs.class.preprocessors.add('resources', function (Class, descriptor) {

    //preprocessor is executed only when resources defined
    return descriptor.hasOwnProperty('resources');
}, function (Class, descriptor, dependencies, ready) {

    //init
    //init resources list
    var resources = new xs.core.Collection(descriptor.resources);

    //assert, that xs.resource.IResource base resource interface is loaded
    assert.ok(xs.ContractsManager.has('xs.resource.IResource'), '$Class: base resource interface xs.resource.IResource is not loaded', {
        $Class: Class
    });

    //assert, that all resources are identified with a valid short name and are resources
    assert.ok(resources.all(function (resource, name) {

        assert.shortName(name, '$Class: given resource name `$name` is not a valid short name', {
            $Class: Class,
            $name: name
        });

        assert.implements(resource, xs.resource.IResource, '$Class: given resource `$resource` does not implement xs.resource.IResource', {
            $Class: Class,
            $resource: resource
        });

        return true;
    }));

    xs.core.Promise.all(resources.map(function (resource) {

        return resource.load();
    }).values()).then(function () {

        //save resources hash to Class
        Class.resources = resources.toSource();
    }).then(ready);

    //return false to sign async processor
    return false;
});

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsClassPreprocessorsResourcesError
 */
function XsClassPreprocessorsResourcesError(message) {
    this.message = 'xs.class.preprocessors.resources::' + message;
}

XsClassPreprocessorsResourcesError.prototype = new Error();