/*
*
*   env.js
*
*   Environment configurations
*
* */

// CORS Core jQuery Setting
$.support.cors = true;

// Remove click delay
$(function() {
    FastClick.attach(document.body);
});

// Module   --  Main Angular App 'nightcrew-app'
var app = angular.module('nightcrew-app', []);

// Session ID
var nightcrew_token = window.localStorage.getItem("nightcrew_token");
