xs.define(xs.Class, 'ns.data.proxy.Xhr', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = {
        Request: 'xs.transport.xhr.Request',
        Method: 'xs.transport.xhr.Method',
        Url: 'xs.uri.Http',
        QueryString: 'xs.uri.query.QueryString'
    };

    Class.extends = 'xs.data.Proxy';

    Class.implements = [
        'xs.data.operation.source.IReadAll'
    ];

    Class.constructor = function (dbName) {
        var me = this;

        self.assert.string(dbName, 'constructor - given `$dbName` is not a string', {
            $dbName: dbName
        });

        me.private.dbName = dbName;
    };

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.reader, 'readAll - proxy has no reader');

        var xhr = new imports.Request();
        xhr.method = imports.Method.GET;
        var url = xhr.url = new imports.Url(imports.QueryString);
        url.scheme = 'http';
        url.host = location.host;
        url.port = 3901;
        url.path = '/stats';
        url.query.params.db = me.private.dbName;

        return xhr.send().then(function (response) {
            return me.reader.read(response.body);
        });
    };

});