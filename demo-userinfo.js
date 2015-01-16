/**
 *   This file is part of tariede, server-side rendering of web components.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

var when = when ? when : require ('when');
var XMLHttpRequest = XMLHttpRequest ? XMLHttpRequest : require ('xmlhttprequest').XMLHttpRequest;

(function () {
    'use strict';

    var createElement = function () {
        if (typeof HTMLElement === 'function') {
            return Object.create (HTMLElement.prototype);
        } else {
            return {};
        }
    };

    var proto = createElement ();

    proto.customElementName = 'demo-userinfo';

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

    proto.renderHtml = function (data) {
        return '<div style="border: 1px dashed #ccc; padding: 0.5em;">' +
            'id: ' + data.id + '<br />' +
            'username: <b>' + data.username + '</b><br />' +
            'name: ' + data.name + '<br />' +
            '<button type="button">next</button></div>';
    };

    proto.renderServerSide = function () {
        var deferred = when.defer();
        var self = this;

        self.load (function (data) {
            self.innerHTML = self.renderHtml (data);
            deferred.resolve ();
        });

        return deferred.promise;
    };

    proto.refresh = function () {
        var self = this;

        self.load (function (data) {
            self.innerHTML = self.renderHtml (data);

            self.getElementsByTagName ('button')[0].addEventListener ('click', function (event) {
                self.onNext (event);
            });
        });
    };

    proto.createdCallback = function () {
        this.refresh ();
    };

    if (typeof module === 'object') {
        module.exports = proto;
    } else {
        document.registerElement (proto.customElementName, { prototype: proto });
    }

})();
