/**
 *   This file is part of tariede, server-side rendering of web components.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

(function () {
    'use strict';

    var createElement = function () {
        if (typeof HTMLElement === 'function') {
            return Object.create (HTMLElement.prototype);
        } else {
            return {};
        }
    };

    var registerElement = function (name, options) {
        var constructor = function () { this.tagName = name; };
        constructor.prototype = Object.create (options.prototype);

        return constructor;
    };

    var proto = createElement ();

    proto.load = function (callback) {
        var self = this;

        var userId = this.getAttribute('user-id');
        var url = "http://jsonplaceholder.typicode.com/users/" + userId;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            callback (JSON.parse(this.responseText));
        };

        xhr.send();
    };

    proto.onNext = function (event) {
        var userId = parseInt (this.getAttribute('user-id'), 10);
        this.setAttribute('user-id', userId + 1);
        this.refresh ();
    };

    proto.serverSideString = function () {
        return "WUT WUT KOEK &lt;b>KOEK</b> KOEK";
    };

    proto.refresh = function () {
        var self = this;

        self.load (function (data) {
            self.innerHTML = '<div style="border: 1px dashed #ccc; padding: 0.5em;">' +
                'id: ' + data.id + '<br />' +
                'username: <b>' + data.username + '</b><br />' +
                'name: ' + data.name + '<br />' +
                '<button type="button">next</button></div>';

            self.getElementsByTagName ('button')[0].addEventListener ('click', function (event) {
                self.onNext (event);
            });
        });
    };

    proto.createdCallback = function () {
        this.refresh ();
    };

    if (typeof module === 'object') {
        module.exports = registerElement ('demo-userinfo', { prototype: proto });
    } else {
        document.registerElement ('demo-userinfo', { prototype: proto });
    }

})();
