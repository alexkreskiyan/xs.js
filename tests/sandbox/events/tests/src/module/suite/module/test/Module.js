xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    //Class.imports = {
    //    data: {
    //        model: {
    //            Entry: 'ns.data.model.Entry'
    //        },
    //        proxy: {
    //            Xhr: 'ns.data.proxy.Xhr'
    //        },
    //        source: {
    //            Log: 'ns.data.source.Log'
    //        }
    //    }
    //};

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);
    };

});