'use strict';
/**
 *   This file is part of tariede, server-side rendering of web components.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

var jsdom = require ('jsdom');
var when = require ('when');

var tariede = function (html, elements) {
    var deferred = when.defer();

    jsdom.env(html, function (errors, window) {
        var waitFor = [];

        elements.forEach (function (Element) {
            var tag = new Element();
            var nodes = window.document.getElementsByTagName(tag.tagName);

            for (var idx in nodes) {
                if (nodes.hasOwnProperty (idx)) {
                    waitFor.push (when(tag.renderServerSide (nodes[idx])));
                }
            }
        });

        when.settle(waitFor).then (function () {
            var body = window.document.documentElement.outerHTML;
            deferred.resolve ('<!DOCTYPE html>\n' + body + '\n');
        });
    });

    return deferred.promise;
};

module.exports = tariede;
