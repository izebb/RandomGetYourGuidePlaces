(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fetch = require('../utils/fetch');
var CONSTANTS = require('../constants/actionConstants');

function requestCustomers() {
    return {
        type: CONSTANTS.REQUEST_CUSTOMER,
        isFetching: true
    }
}

function receiveCustomer(data) {
    return {
        type: CONSTANTS.RECEIVE_CUSTOMER,
        customer: data,
        isFetching: false

    }
}

function getCustomerError(data) {
    return {
        type: CONSTANTS.FETCH_CUSTOMER_ERROR,
        error: data,
        isFetching: false
    }
}

function fetchCustomer(customer) {
    customer.dispatch('change', requestCustomers())
    fetch({
        method: "GET",
        url: "https://www.getyourguide.com/touring.json?key=2Gr0p7z96D"
    }, function(response) {
        customer.dispatch('change', receiveCustomer(response));

    }, function(error) {
        customer.dispatch('change', getCustomerError(error));
    });
}
var customerActions = {
    fetchCustomer: fetchCustomer
}


module.exports = customerActions;

},{"../constants/actionConstants":3,"../utils/fetch":6}],2:[function(require,module,exports){
var EventEmitter =  require('./utils/eventEmitter');
var customerReducers =  require('./reducers/customerReducers');
var customerAction =  require('./actions/customer');

var customer  = new EventEmitter(customerReducers);
customer.on('change', function(state){
	console.log(state);
});

customerAction.fetchCustomer(customer);
customer.getState();
},{"./actions/customer":1,"./reducers/customerReducers":4,"./utils/eventEmitter":5}],3:[function(require,module,exports){
module.exports = {
    REQUEST_CUSTOMER: "REQUEST_CUSTOMER",
    RECEIVE_CUSTOMER: "RECEIVE_CUSTOMER",
    FETCH_CUSTOMER_ERROR: "FETCH_CUSTOMER_ERROR"
}

},{}],4:[function(require,module,exports){
var CONSTANTS = require('../constants/actionConstants');


module.exports = function(state, action) {
    var state = state || {};
        	console.log(action);
    switch (action.type) {
        case CONSTANTS.REQUEST_CUSTOMER:
            return {
            	 customer: action.customer,
        		isFetching: action.isFetching
            };
        case CONSTANTS.RECEIVE_CUSTOMER:
            return  {
            	 customer: action.customer,
        		isFetching: action.isFetching
            };
        case CONSTANTS.FETCH_CUSTOMER_ERROR:
            return  {
            	 error: action.error,
        		isFetching: action.isFetching
            };

        default:
            return state;
    }
}

},{"../constants/actionConstants":3}],5:[function(require,module,exports){
function EventEmitter(reducer) {
    this.emitters = {};
    this.reducer = reducer;
    this.state = this.reducer(null, {type: null});
}


EventEmitter.prototype.getState = function() {
   return this.state;
}


EventEmitter.prototype.dispatch = function(evtType, action) {
    if (!this.emitters[evtType]) {
        return false;
    }

    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        var index = this.emitters[evtType].indexOf(_emit);
        if (index > -1) {
            this.emitters[evtType].splice(index, 1);
        }
        this.state = this.reducer(this.getState(), action)
        _emit(this.state);
    }
}

EventEmitter.prototype.on = function(evt) {
    this.emitters[evt] = this.emitters[evt] || [];
    for (var i = 1; i < arguments.length; i++) {
        this.emitters[evt].push(arguments[i]);
    }
}

module.exports = EventEmitter;
},{}],6:[function(require,module,exports){
function fetch(options, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", processRequest, false);
    xhr.open(options.method, options.url, true);
    xhr.send();

    function processRequest(e) {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status <= 399) {
                var response = JSON.parse(xhr.responseText);
                success(response, xhr)
            } else {
                console.log(xhr.responseText)
                error(xhr.responseText, xhr)
            }
        }
    }
}

module.exports = fetch;

},{}]},{},[2]);
