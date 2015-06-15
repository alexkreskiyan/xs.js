xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        data: {
            model: {
                Test: 'ns.data.model.Test'
            },
            proxy: {
                LocalStorage: 'ns.data.proxy.LocalStorage'
            },
            reader: {
                JSON: 'xs.data.reader.JSON'
            },
            source: {
                Tests: 'ns.data.source.Tests'
            },
            writer: {
                JSON: 'xs.data.writer.JSON'
            }
        },
        event: {
            Click: 'ns.event.Click',
            NewTest: 'ns.event.NewTest'
        },
        //tests: {
        //    Tap: 'ns.tests.Tap'
        //},
        test: {
            event: {
                Progress: 'ns.module.test.event.Progress',
                Done: 'ns.module.test.event.Done'
            }
        },
        view: {
            Container: 'tests.view.Container',
            Launcher: 'ns.view.Launcher'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        //create container
        var container = me.private.container = new imports.view.Container();
        container.attributes.set('id', 'suite');

        var source = me.private.source = new imports.data.source.Tests({
            proxy: new imports.data.proxy.LocalStorage({
                commonKey: 'tests.module.suite.',
                reader: new imports.data.reader.JSON(),
                writer: new imports.data.writer.JSON()
            })
        });

        source.readAll().then(function () {
            console.log('all tests restored to source');
            createTests.call(me);
        });
    };

    Class.property.container = {
        set: xs.noop
    };

    var createTests = function () {
        var me = this;

        var source = me.private.source;

        var tests = (new xs.core.Collection(imports.tests)).map(function (Test, name) {
            var model;

            //if model exists - use it
            if (source.hasKey(name)) {
                model = source.at(name);
            } else {
                model = new imports.data.model.Test(); //TODO
            }

            var test = new Test({});

            me.events.emitter.send(new imports.event.NewTest(test));

            return test;
        });

        //prepare tests
        tests.each(prepareTest, 0, me);
    };

    var prepareTest = function (test, name) {
        var me = this;
        var container = me.container;

        //create launcher
        var launcher = new imports.view.Launcher({
            name: test.self.testName,
            label: test.self.testLabel
        });

        //bind launcher events
        launcher.on(imports.event.Click, function () {
            test.show();
        });

        //bind test events
        //progress
        test.on(imports.test.event.Progress, function (event) {
            if (!launcher.classes.has('progress')) {
                launcher.classes.add('progress');
            }

            console.log('progress of test', name, ':', event.data);
        });
        test.on(imports.test.event.Done, function () {
            launcher.classes.add('complete');
            console.log('test', name, 'complete');
        });

        //add launcher to container items
        container.items.add(name, launcher);
    };

});