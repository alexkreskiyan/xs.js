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
                WebSocket: 'ns.data.proxy.WebSocket'
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
        tests: {
            dom: {
                pointer: 'ns.tests.dom.pointer.Test'
            },
            xs: {
                Tap: 'ns.tests.xs.tap.Test'
            }
        },
        test: {
            event: {
                Progress: 'ns.module.test.event.Progress',
                Done: 'ns.module.test.event.Done'
            }
        },
        view: {
            Container: 'tests.view.Container',
            Launcher: 'ns.view.Launcher'
        },
        uri: {
            HTTP: 'xs.uri.HTTP',
            QueryString: 'xs.uri.query.QueryString'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (connection, reporter) {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        me.private.reporter = reporter;

        //create container
        var container = me.private.container = new imports.view.Container();
        container.attributes.set('id', 'suite');

        //get location url to evaluate used test suite
        var url = new imports.uri.HTTP(location.href, imports.uri.QueryString);
        var suite = url.query.params.suite;

        var suites = {
            dom: 'domEventsTests',
            xs: 'xsEventsTests'
        };

        //validate suite name
        self.assert.ok(suites.hasOwnProperty(suite), 'unknown suite name `$suite`', {
            $suite: suite
        });

        var source = me.private.source = new imports.data.source.Tests({
            proxy: new imports.data.proxy.WebSocket({
                connection: connection,
                dbName: suites[ suite ],
                reader: new imports.data.reader.JSON(),
                writer: new imports.data.writer.JSON()
            })
        });

        source.readAll().then(function () {
            (new xs.core.Collection(imports.tests[ suite ])).map(createTest, me);
        });
    };

    Class.property.container = {
        set: xs.noop
    };

    var createTest = function (Test, name) {
        var me = this;

        var source = me.private.source;
        var reporter = me.private.reporter;
        var test;

        getTestModel(source, name).then(function (model) {

            //create test
            test = new Test(model, reporter);

            //prepare test
            prepareTest.call(me, test, name);

            //return create or update
            return source.hasKey(name) ? source.update(model) : source.create(model);
        }).then(function () {

            //notify about new test
            me.events.emitter.send(new imports.event.NewTest(test));
        });
    };

    var getTestModel = function (source, name) {
        var promise = new xs.core.Promise();

        //if model exists - use it
        if (source.hasKey(name)) {
            promise.resolve(source.at(name));

            //else - create and add to source
        } else {
            var model = new imports.data.model.Test({
                test: name,
                stages: {}
            });

            //resolve with promise
            promise.resolve(model);
        }

        return promise;
    };

    var prepareTest = function (test, name) {
        var me = this;

        var source = me.private.source;
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
        test.on(imports.test.event.Progress, function () {
            if (!launcher.classes.has('progress')) {
                launcher.classes.add('progress');
            }
            source.update(test.model);
        });
        test.on(imports.test.event.Done, function () {
            launcher.classes.remove('progress');
            launcher.classes.add('complete');
        });

        //add launcher to container items
        container.items.add(name, launcher);
    };

});