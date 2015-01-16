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
var express = require("express");

var elementRegistry = [];
elementRegistry.push (require ('../demo-userinfo'));
var indexHtml = fs.readFileSync ('index.html');

var app = express()
app.get('/', function (req, res) {

    var renderBody = tariede (indexHtml.toString (), elementRegistry);
    renderBody.then (function (body) {
        res.send (body);
    });

})
app.use(express.static('.'));

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
})
