'use strict';
/**
 *   This file is part of tariede, server-side rendering of web components.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

var jsdom = require("jsdom");

var tariede = function (html, elements) {

    jsdom.env(
        html,
        function (errors, window) {
            elements.forEach (function (Element) {
                var tag = new Element();
                var nodes = window.document.getElementsByTagName(tag.tagName);

                for (var node in nodes) {
                    if (nodes.hasOwnProperty (node)) {
                        node.innerHTML = tag.serverSideString ();
                    }
                }
            });

            console.log (window.document.documentElement.outerHTML + "\n");
        }
    );

    return "please wait...\n";
}

module.exports = tariede;
