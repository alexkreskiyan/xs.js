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
        Reporter: 'ns.Reporter',
        UserInfo: 'ns.UserInfo',
        uri: {
            HTTP: 'xs.uri.HTTP',
            QueryString: 'xs.uri.query.QueryString'
        }
    };

    Class.extends = 'xs.app.Module';

    Class.implements = [ 'xs.app.IApp' ];

    Class.method.run = function () {
        var me = this;

        //authenticate
        imports.UserInfo.authenticate();

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Container(document.body);

        //create websocket connection
        var connection = new imports.websocket.Connection();
        var url = new imports.websocket.Url(imports.uri.QueryString);
        url.scheme = 'ws';
        url.host = location.host;
        url.port = 3903;
        connection.url = url;

        //get location url to evaluate used test suite
        var suite = (new imports.uri.HTTP(location.href, imports.uri.QueryString)).query.params.suite;

        var databases = {
            dom: 'domEventsTests',
            xs: 'xsEventsTests'
        };

        //validate suite name
        self.assert.ok(databases.hasOwnProperty(suite), 'unknown suite name `$suite`', {
            $suite: suite
        });

        //create reporter
        var reporter = new imports.Reporter(connection, databases[ suite ]);

        //open connection
        connection.open().then(function () {
            //create suite module
            var suite = new imports.suite.Module(connection, reporter);
            viewport.items.add(suite.container);

            suite.on(imports.suite.event.NewTest, function (event) {
                viewport.items.add(event.test.container);
            });
        });

        //reconnect on close FIXME
        //connection.on(imports.websocket.event.Close, connection.open.bind(connection));
    };

});