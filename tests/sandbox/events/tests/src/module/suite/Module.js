xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        view: {
            Container: 'tests.view.Container',
            Test: 'ns.view.Test'
        },
        tests: {
            Tap: 'ns.tests.Tap'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        //create container
        var container = me.container = new imports.view.Container();
        container.attributes.set('id', 'suite');

        //create tests
        var tests = (new xs.core.Collection(imports.tests)).map(function (Test) {
            return new Test();
        });

        //add tests to container
        tests.each(function (test) {
            var testLauncher = new imports.view.Test({
                name: test.self.name,
                label: test.self.label
            });
            container.items.add(testLauncher);
        });
    };

});