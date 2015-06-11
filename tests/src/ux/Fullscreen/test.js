/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ux.Fullscreen', function () {

    'use strict';

    test('demo', function () {
        expect(0);
    });

     test('show', function() {
        var el = new xs.dom.Element(document.body);

        //fullscreen show
        xs.ux.Fullscreen.show(el);

        return false;
    });

    test('cancel', function() {
        //fullscreen cancel
        xs.ux.Fullscreen.cancel();

        return false;

    });

    test('showbuttons', function() {
        var button = document.createElement('button');

        button.innerHTML = 'Fullscreen1';
        button.setAttribute("width", "304");
        button.setAttribute("width", "228");
        document.body.appendChild(button);

        var button2 = document.createElement('button');
        button2.innerHTML = 'Fullscreen2';
        button2.setAttribute("width", "304");
        button2.setAttribute("width", "228");
        document.body.appendChild(button2);

        button.addEventListener('click', function () {
            //fullscreen show
            xs.ux.Fullscreen.show(button2);
        });

        button2.addEventListener('click', function () {
            //fullscreen show
            xs.ux.Fullscreen.show(button);
        });

        return false;
    });

    test('msdn_events', function() {
        document.addEventListener("fullscreenchange", function () {
            console.log("Fullscreen changed! IsActive=" + xs.ux.Fullscreen.isActive);
        }, false);

        document.addEventListener("mozfullscreenchange", function () {
            console.log("Fullscreen changed! IsActive=" + xs.ux.Fullscreen.isActive);
        }, false);

        document.addEventListener("webkitfullscreenchange", function () {
            console.log("Fullscreen changed! IsActive=" + xs.ux.Fullscreen.isActive);
        }, false);

        document.addEventListener("msfullscreenchange", function () {
            console.log("Fullscreen changed! IsActive=" + xs.ux.Fullscreen.isActive);
        }, false);

        var button = document.createElement('button');
        button.innerHTML = 'Fullscreen';
        button.setAttribute("width", "304");
        button.setAttribute("width", "228");
        document.body.appendChild(button);

        button.addEventListener('click', function () {
            //fullscreen show
            xs.ux.Fullscreen.show(document.body);
        });


        return false;
    });
});