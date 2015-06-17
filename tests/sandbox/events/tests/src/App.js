xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        reader: {
            JSON: 'xs.data.reader.JSON'
        },
        Storage: 'xs.storage.Local',
        suite: {
            event: {
                NewTest: 'ns.module.suite.event.NewTest'
            },
            Module: 'ns.module.suite.Module'
        },
        view: {
            Container: 'ns.view.Container'
        },
        websocket: {
            event: {
                Close: 'xs.transport.websocket.event.Close'
            },
            Connection: 'xs.transport.websocket.Connection',
            Url: 'xs.uri.WebSocket'
        },
        QueryString: 'xs.uri.query.QueryString',
        UserInfo: 'ns.UserInfo'
    };

    Class.method.run = function () {
        var me = this;

        //authenticate
        imports.UserInfo.authenticate();

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Container(document.body);

        //create and open websocket connection
        var connection = new imports.websocket.Connection();
        var url = new imports.websocket.Url(imports.QueryString);
        url.scheme = 'ws';
        url.host = location.host;
        url.port = 3903;
        connection.url = url;

        //open connection
        connection.open().then(function () {
            //create suite module
            var suite = new imports.suite.Module(connection);
            viewport.items.add(suite.container);

            suite.on(imports.suite.event.NewTest, function (event) {
                viewport.items.add(event.test.container);
            });
        });

        //reconnect on close FIXME
        //connection.on(imports.websocket.event.Close, connection.open.bind(connection));
    };

});