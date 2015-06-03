xs.define(xs.Class, 'ns.data.proxy.Xhr', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = [
        {
            Request: 'xs.transport.xhr.Request'
        },
        {
            Method: 'xs.transport.xhr.Method'
        },
        {
            Url: 'xs.uri.HTTP'
        },
        {
            QueryString: 'xs.uri.query.QueryString'
        }
    ];

    Class.extends = 'xs.data.Proxy';

    Class.implements = [
        'xs.data.operation.source.IReadAll'
    ];

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.reader, 'readAll - proxy has no reader');

        var xhr = new imports.Request();
        xhr.method = imports.Method.GET;
        xhr.url = new imports.Url(imports.QueryString);
        xhr.url.scheme = 'http';
        xhr.url.host = location.host;
        xhr.url.port = 3900;
        xhr.url.path = '/stats';

        return xhr.send().then(function (response) {
            return me.reader.read(response.body);
        });
    };

});