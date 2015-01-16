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

var resolveElement = function (node, elementPrototype) {
    // is there a better way to bolt a prototype onto an existing Object?
    for (var attribute in elementPrototype) {
        if (elementPrototype.hasOwnProperty (attribute)) {
            node[attribute] = elementPrototype[attribute];
        }
    }

    return node;
};

var tariede = function (html, elements) {
    var deferred = when.defer();

    jsdom.env(html, function (errors, window) {
        var waitFor = [];

        elements.forEach (function (elementPrototype) {
            var tagName = elementPrototype.customElementName;
            var nodes = window.document.getElementsByTagName(tagName);

            for (var idx in nodes) {
                if (nodes.hasOwnProperty (idx)) {
                    var tag = nodes[idx];
                    resolveElement(tag, elementPrototype);
                    waitFor.push (when(tag.renderServerSide ()));
                }
            }
        });

        when.settle(waitFor).then (function () {
            deferred.resolve (jsdom.serializeDocument(window.document));
        });
    });

    return deferred.promise;
};

module.exports = tariede;
