'use strict';
/**
 *   This file is part of tariede, server-side rendering of web components.
 *   Copyright (C) 2015  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.0.  See LICENSE.txt.
 */

var fs = require ('fs');
var http = require ("http");
var tariede = require ('./tariede');

var elementRegistry = [];
elementRegistry.push (require ('../demo-userinfo'));
var indexHtml = fs.readFileSync ('index.html');

var renderBody = tariede (indexHtml.toString (), elementRegistry);
renderBody.then (function (body) {
    console.log (body);
});
