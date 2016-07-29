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
	console.log(state)
});

customerAction.fetchCustomer(customer);



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
    var _state = Object.create(state);
    switch (action.type) {
        case CONSTANTS.REQUEST_CUSTOMER:
            _state.customer = {};
            _state.isFetching = action.isFetching;
            return _state;
        case CONSTANTS.RECEIVE_CUSTOMER:
            _state.customer = action.customer;
            _state.isFetching = action.isFetching;
            return _state;
        case CONSTANTS.FETCH_CUSTOMER_ERROR:
            _state.error = action.error;
            _state.isFetching = action.isFetching;
            return _state;
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
    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        this.state = this.reducer(this.getState(), action);
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

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWN0aW9ucy9jdXN0b21lci5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY29uc3RhbnRzL2FjdGlvbkNvbnN0YW50cy5qcyIsInNyYy9qcy9yZWR1Y2Vycy9jdXN0b21lclJlZHVjZXJzLmpzIiwic3JjL2pzL3V0aWxzL2V2ZW50RW1pdHRlci5qcyIsInNyYy9qcy91dGlscy9mZXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZldGNoID0gcmVxdWlyZSgnLi4vdXRpbHMvZmV0Y2gnKTtcbnZhciBDT05TVEFOVFMgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvYWN0aW9uQ29uc3RhbnRzJyk7XG5cbmZ1bmN0aW9uIHJlcXVlc3RDdXN0b21lcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQ09OU1RBTlRTLlJFUVVFU1RfQ1VTVE9NRVIsXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWVcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlY2VpdmVDdXN0b21lcihkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQ09OU1RBTlRTLlJFQ0VJVkVfQ1VTVE9NRVIsXG4gICAgICAgIGN1c3RvbWVyOiBkYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuXG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRDdXN0b21lckVycm9yKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBDT05TVEFOVFMuRkVUQ0hfQ1VTVE9NRVJfRVJST1IsXG4gICAgICAgIGVycm9yOiBkYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmV0Y2hDdXN0b21lcihjdXN0b21lcikge1xuICAgIGN1c3RvbWVyLmRpc3BhdGNoKCdjaGFuZ2UnLCByZXF1ZXN0Q3VzdG9tZXJzKCkpXG4gICAgZmV0Y2goe1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVybDogXCJodHRwczovL3d3dy5nZXR5b3VyZ3VpZGUuY29tL3RvdXJpbmcuanNvbj9rZXk9MkdyMHA3ejk2RFwiXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY3VzdG9tZXIuZGlzcGF0Y2goJ2NoYW5nZScsIHJlY2VpdmVDdXN0b21lcihyZXNwb25zZSkpO1xuXG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY3VzdG9tZXIuZGlzcGF0Y2goJ2NoYW5nZScsIGdldEN1c3RvbWVyRXJyb3IoZXJyb3IpKTtcbiAgICB9KTtcbn1cbnZhciBjdXN0b21lckFjdGlvbnMgPSB7XG4gICAgZmV0Y2hDdXN0b21lcjogZmV0Y2hDdXN0b21lclxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gY3VzdG9tZXJBY3Rpb25zO1xuIiwidmFyIEV2ZW50RW1pdHRlciA9ICByZXF1aXJlKCcuL3V0aWxzL2V2ZW50RW1pdHRlcicpO1xudmFyIGN1c3RvbWVyUmVkdWNlcnMgPSAgcmVxdWlyZSgnLi9yZWR1Y2Vycy9jdXN0b21lclJlZHVjZXJzJyk7XG52YXIgY3VzdG9tZXJBY3Rpb24gPSAgcmVxdWlyZSgnLi9hY3Rpb25zL2N1c3RvbWVyJyk7XG5cbnZhciBjdXN0b21lciAgPSBuZXcgRXZlbnRFbWl0dGVyKGN1c3RvbWVyUmVkdWNlcnMpO1xuXG5jdXN0b21lci5vbignY2hhbmdlJywgZnVuY3Rpb24oc3RhdGUpe1xuXHRjb25zb2xlLmxvZyhzdGF0ZSlcbn0pO1xuXG5jdXN0b21lckFjdGlvbi5mZXRjaEN1c3RvbWVyKGN1c3RvbWVyKTtcblxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSRVFVRVNUX0NVU1RPTUVSOiBcIlJFUVVFU1RfQ1VTVE9NRVJcIixcbiAgICBSRUNFSVZFX0NVU1RPTUVSOiBcIlJFQ0VJVkVfQ1VTVE9NRVJcIixcbiAgICBGRVRDSF9DVVNUT01FUl9FUlJPUjogXCJGRVRDSF9DVVNUT01FUl9FUlJPUlwiXG59XG4iLCJ2YXIgQ09OU1RBTlRTID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2FjdGlvbkNvbnN0YW50cycpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc3RhdGUsIGFjdGlvbikge1xuICAgIHZhciBzdGF0ZSA9IHN0YXRlIHx8IHt9O1xuICAgIHZhciBfc3RhdGUgPSBPYmplY3QuY3JlYXRlKHN0YXRlKTtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgQ09OU1RBTlRTLlJFUVVFU1RfQ1VTVE9NRVI6XG4gICAgICAgICAgICBfc3RhdGUuY3VzdG9tZXIgPSB7fTtcbiAgICAgICAgICAgIF9zdGF0ZS5pc0ZldGNoaW5nID0gYWN0aW9uLmlzRmV0Y2hpbmc7XG4gICAgICAgICAgICByZXR1cm4gX3N0YXRlO1xuICAgICAgICBjYXNlIENPTlNUQU5UUy5SRUNFSVZFX0NVU1RPTUVSOlxuICAgICAgICAgICAgX3N0YXRlLmN1c3RvbWVyID0gYWN0aW9uLmN1c3RvbWVyO1xuICAgICAgICAgICAgX3N0YXRlLmlzRmV0Y2hpbmcgPSBhY3Rpb24uaXNGZXRjaGluZztcbiAgICAgICAgICAgIHJldHVybiBfc3RhdGU7XG4gICAgICAgIGNhc2UgQ09OU1RBTlRTLkZFVENIX0NVU1RPTUVSX0VSUk9SOlxuICAgICAgICAgICAgX3N0YXRlLmVycm9yID0gYWN0aW9uLmVycm9yO1xuICAgICAgICAgICAgX3N0YXRlLmlzRmV0Y2hpbmcgPSBhY3Rpb24uaXNGZXRjaGluZztcbiAgICAgICAgICAgIHJldHVybiBfc3RhdGU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufSAgIFxuIiwiZnVuY3Rpb24gRXZlbnRFbWl0dGVyKHJlZHVjZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzID0ge307XG4gICAgdGhpcy5yZWR1Y2VyID0gcmVkdWNlcjtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5yZWR1Y2VyKG51bGwsIHt0eXBlOiBudWxsfSk7XG59XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgcmV0dXJuIHRoaXMuc3RhdGU7XG59XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGV2dFR5cGUsIGFjdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVyc1tldnRUeXBlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgX2VtaXQgPSB0aGlzLmVtaXR0ZXJzW2V2dFR5cGVdW2ldO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5yZWR1Y2VyKHRoaXMuZ2V0U3RhdGUoKSwgYWN0aW9uKTtcbiAgICAgICAgX2VtaXQodGhpcy5zdGF0ZSk7XG4gICAgfVxufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oZXZ0KSB7XG4gICAgdGhpcy5lbWl0dGVyc1tldnRdID0gdGhpcy5lbWl0dGVyc1tldnRdIHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlcnNbZXZ0XS5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjsiLCJmdW5jdGlvbiBmZXRjaChvcHRpb25zLCBzdWNjZXNzLCBlcnJvcikge1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgcHJvY2Vzc1JlcXVlc3QsIGZhbHNlKTtcbiAgICB4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUpO1xuICAgIHhoci5zZW5kKCk7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzUmVxdWVzdChlKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8PSAzOTkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UsIHhocilcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeGhyLnJlc3BvbnNlVGV4dClcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIucmVzcG9uc2VUZXh0LCB4aHIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmV0Y2g7XG4iXX0=
