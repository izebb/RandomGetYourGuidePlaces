(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Customer =  require('./models/customer');
var customer  = new Customer();

customer.on('change', function(value){


});

customer.fetch();
},{"./models/customer":2}],2:[function(require,module,exports){
var fetch = require('../utils/fetch');

function Customer() {
    this.emitters = {};
}

Customer.prototype.dispatch = function(evtType, value) {
    if (!this.emitters[evtType]) {
        return false;
    }
    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        var index = this.emitters[evtType].indexOf(_emit);
        if (index > -1) {
            this.emitters[evtType].splice(index, 1);
        }
        _emit(value);
    }
}

Customer.prototype.on = function(evt) {
    this.emitters[evt] = this.emitters[evt] || [];
    for (var i = 1; i < arguments.length; i++) {
        this.emitters[evt].push(arguments[i]);
    }
}


Customer.prototype.fetch = function() {
    var that = this;
    fetch({
        method: "GET",
        url: "https://www.getyourguide.com/touring.json?key=2Gr0p7z96D"
    }, function(response) {
        that.dispatch('change', response)

    }, function(error) {
        that.dispatch('error', error)
    });
};




module.exports = Customer;

},{"../utils/fetch":3}],3:[function(require,module,exports){
function fetch(options, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.open(options.method, options.url, true);
    xhr.send();

    function processRequest(e) {
        if (xhr.readyState == 4) {
            var response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status <= 399) {
                success(response, xhr)
            } else {
                error(response, xhr)
            }
        }
    }
}

module.exports = fetch;

},{}]},{},[1]);
