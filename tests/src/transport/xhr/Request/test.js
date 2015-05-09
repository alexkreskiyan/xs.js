/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.transport.xhr.Request', function () {

    'use strict';

    test('demo', function () {
        expect(0);

        var length = 1e6;
        var data = '';

        for (var i = 0; i < length; i++) {
            data += 'abcdefghijklmntoprst';
        }

        window.request = function (method, url, upload, file) {
            var xhr = new XMLHttpRequest();

            //add upload event listeners
            xhr.upload.addEventListener('loadstart', console.log.bind(console, 'upload.loadstart'));
            xhr.upload.addEventListener('progress', console.log.bind(console, 'upload.progress'));
            xhr.upload.addEventListener('load', console.log.bind(console, 'upload.load'));
            xhr.upload.addEventListener('error', console.log.bind(console, 'upload.error'));
            xhr.upload.addEventListener('abort', console.log.bind(console, 'upload.abort'));

            //add event listeners
            xhr.addEventListener('progress', console.log.bind(console, 'progress'));
            xhr.addEventListener('load', console.log.bind(console, 'load'));
            xhr.addEventListener('error', console.log.bind(console, 'error'));
            xhr.addEventListener('abort', console.log.bind(console, 'abort'));

            xhr.open(method, url);

            if (upload) {

                if (file) {
                    xhr.send(file);
                } else {

                    //works if not set. is ok?
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


                    file = new File([ data ], {
                        type: 'text/plain'
                    });

                    var formData = new FormData();
                    formData.append('data', file);

                    xhr.send(file); //or formData
                }
            } else {
                xhr.send();
            }
        };

        window.upload = function () {
            window.request('post', 'http://localhost:3000/upload', true);
        };

        window.download = function () {
            window.request('get', 'http://localhost:3000/download');
        };

        window.revert = function () {
            window.request('post', 'http://localhost:3000/revert', true);
        };

    });
});