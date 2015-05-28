xs.define(xs.Class, 'log.Reporter', function (self, imports) {

    'use strict';

    var Class = this;

    Class.imports = [
        {
            Request: 'xs.transport.xhr.Request'
        },
        {
            Url: 'xs.uri.HTTP'
        },
        {
            QueryString: 'xs.uri.query.QueryString'
        },
        {
            'request.Method': 'xs.transport.xhr.Method'
        }
    ];

    Class.constant.ServerUrl = xs.lazy(function () {
        return new imports.Url('http://' + window.location.host + ':3900', imports.QueryString);
    });

    Class.static.method.report = function (category, name, event) {
        var user = localStorage.getItem('user');
        var device = localStorage.getItem('device');

        self.assert.ok(user, 'specify your username, please');
        self.assert.ok(device, 'specify your device, please');

        var request = new imports.Request();
        request.method = imports.request.Method.POST;
        request.url = self.ServerUrl;
        request.data = JSON.stringify({
            user: user,
            device: device,
            userAgent: xs.env.Context,
            category: category,
            name: name,
            event: serialize(event, 2)
        });
        request.send();
    };

    var serialize = function (item, depth) {
        if (typeof item !== 'object' || item === null) {

            return String(item);
        }

        var result = {};
        var keys = Object.keys(item).concat(Object.keys(item.constructor.prototype));
        var i, key;

        if (depth <= 1) {

            for (i = 0; i < keys.length; i++) {
                key = keys[ i ];
                result[ key ] = String(item[ key ]);
            }

        } else {

            for (i = 0; i < keys.length; i++) {
                key = keys[ i ];
                result[ key ] = serialize(item[ key ], depth - 1);
            }

        }

        return result;
    };

});