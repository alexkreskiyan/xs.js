'use strict';

var log = new xs.log.Logger('xs.app.Boot');

var assert = new xs.core.Asserter(log, XsAppBootError);

var isBooted = false;

//define boot method
xs.boot = function (configuration) {

    //assert, that configuration is an object
    assert.object(configuration, 'given boot configuration `$configuration` is not an object', {
        $configuration: configuration
    });

    //assert, that app is not booted yet
    assert.not(isBooted, 'app is already booted');

    //assert, that app class name is given
    assert.ok(configuration.hasOwnProperty('App'), 'application class name missing in configuration object');

    //assert, that class name is valid
    assert.fullName(configuration.App, 'given application class name `$App` is not a valid full name', {
        $App: configuration.App
    });

    //assert, that paths, if given, are an object
    assert.ok(!configuration.hasOwnProperty('paths') || xs.isObject(configuration.paths), 'given loader paths `$paths` are not an object', {
        $paths: configuration.paths
    });

    //assert, that options, if given, are an object
    assert.ok(!configuration.hasOwnProperty('options') || xs.isObject(configuration.options), 'given application options `$options` are not an object', {
        $options: configuration.options
    });

    //add paths, if given
    if (configuration.paths) {
        xs.Loader.paths.add(configuration.paths);
    }

    var loadList = [
        'xs.app.Module',
        'xs.app.IApp',
        configuration.App
    ];

    //require contracts on next tick
    xs.nextTick(function () {
        var requiredList = [ configuration.App ];

        //add app.Module to requiredList if needed
        if (!xs.ContractsManager.has('xs.app.Module')) {
            requiredList.push('xs.app.Module');
        }

        //add app.IApp to requiredList if needed
        if (!xs.ContractsManager.has('xs.app.IApp')) {
            requiredList.push('xs.app.IApp');
        }

        xs.require(requiredList, xs.noop, xs.noop);
    });

    xs.onReady(loadList, function () {
        var App = xs.ContractsManager.get(configuration.App);

        //assert, that App inherits from xs.app.Module
        assert.ok(App.inherits(xs.app.Module), 'given application class `$App` is not inherited from `$Module`', {
            $App: App,
            $Module: xs.app.Module
        });

        //assert, that App implements xs.app.IApp
        assert.ok(App.implements(xs.app.IApp), 'given application class `$App` does not implement `$IApp`', {
            $App: App,
            $IApp: xs.app.IApp
        });

        //run app
        var app = new App(configuration.options ? configuration.options : {});
        app.run();
    });
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsAppBootError
 */
function XsAppBootError(message) {
    this.message = 'xs.app.Boot::' + message;
}

XsAppBootError.prototype = new Error();