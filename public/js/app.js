(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Flux Action Objects
 *
 * 
 */



var fetch = require('../utils/fetch');
var CONSTANTS = require('../constants/actionConstants');
var URL = require('../constants/urls');

/**
 * Action Object  Request Customer data before ajax request 
 * @return object 
 */
function requestCustomers() {
    return {
        type: CONSTANTS.REQUEST_CUSTOMER,
        isFetching: true
    }
}

/**
 * Action Object from Customer data after ajax request 
 * @return object 
 */
function receiveCustomer(data) {
    return {
        type: CONSTANTS.RECEIVE_CUSTOMER,
        customer: data,
        isFetching: false

    }
}

/**
 * Action Object from Customer if error occurs
 * @return object 
 */
function getCustomerError(data) {
    return {
        type: CONSTANTS.FETCH_CUSTOMER_ERROR,
        error: data,
        isFetching: false
    }
}


/**
 *  Ajax call to server
 * @return object 
 */
function $httpFetch(url, customer) {
    fetch({
        method: "GET",
        url: url
    }, function(response) {
        customer.dispatch('change', receiveCustomer(response));

    }, function(error) {
        customer.dispatch('change', getCustomerError(error));
    });
}


/**
 *  Retrieve cutomer through ajax and dispatch an action upon response
 * @return null 
 */
function fetchCustomer(customer) {
    customer.dispatch('change', requestCustomers());
    $httpFetch(URL, customer);
    // refresh
    setInterval(function() {
        $httpFetch(URL, customer);
    }, CONSTANTS.INTERVAL)

}



module.exports = {
    fetchCustomer: fetchCustomer
};

},{"../constants/actionConstants":3,"../constants/urls":4,"../utils/fetch":7}],2:[function(require,module,exports){
var EventEmitter = require('./utils/eventEmitter');
var customerReducers = require('./reducers/customerReducers');
var customerAction = require('./actions/customer');
var RandomPlaces = require('./views/RandomPlaces');

// instantiate event emiter as store
var customer = new EventEmitter(customerReducers);

//listen for change 
customer.on('change', function(state) {
    RandomPlaces( state, document.getElementById('root'));
});

// Initially Fetch data
customerAction.fetchCustomer(customer);
},{"./actions/customer":1,"./reducers/customerReducers":5,"./utils/eventEmitter":6,"./views/RandomPlaces":12}],3:[function(require,module,exports){
module.exports = {
    REQUEST_CUSTOMER: "REQUEST_CUSTOMER",
    RECEIVE_CUSTOMER: "RECEIVE_CUSTOMER",
    FETCH_CUSTOMER_ERROR: "FETCH_CUSTOMER_ERROR",
    INTERVAL: 10000
}

},{}],4:[function(require,module,exports){
module.exports = "https://www.getyourguide.com/touring.json?key=2Gr0p7z96D";
},{}],5:[function(require,module,exports){
/**
 * Flux Reducer Objects
 * 
 */

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

},{"../constants/actionConstants":3}],6:[function(require,module,exports){

/**
 * Simple event emitter class
 * @param function reducer 
 */
function EventEmitter(reducer) {
    this.emitters = {};
    this.reducer = reducer;
    this.state = this.reducer(null, {type: null});
}


/**
 * Retrieve current state
 * @param function reducer 
 */
EventEmitter.prototype.getState = function() {
   return this.state;
}

/**
 * Display an action based on an event 
 * @param  String evtType 
 * @param  Object action 
 */
EventEmitter.prototype.dispatch = function(evtType, action) {
    for (var i = 0; i < this.emitters[evtType].length; i++) {
        var _emit = this.emitters[evtType][i];
        this.state = this.reducer(this.getState(), action);
        _emit(this.state);
    }
}
/**
 * Event Listeners
 * @param  String evt 
 * @params Function argument    
 */
EventEmitter.prototype.on = function(evt) {
    this.emitters[evt] = this.emitters[evt] || [];
    for (var i = 1; i < arguments.length; i++) {
        this.emitters[evt].push(arguments[i]);
    }
}

module.exports = EventEmitter;
},{}],7:[function(require,module,exports){

/**
 * Simple XMLHttpRequest Object
 * @param  object options 
 * {
 *  url: url,
 *  method: "POST", "GET"
 * }
 * @param  function success callback success function 
 * @param function error   callback error function 
 */
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
                error(xhr.responseText, xhr)
            }
        }
    }
}

module.exports = fetch;

},{}],8:[function(require,module,exports){
/**
 * Simple DOM miniplation Functions
 * @param  String tagName e.g "div", 'span'
 * @param  Function/String nested re function or simple textnode string 
 * @return function  DOMnode
 */
var re = function(tagName) {
    var _dom = _createDom(tagName);
    var args = arguments;
    for (var i = 1; i < arguments.length; i++) {
        if (typeof arguments[i] === 'string') {
            _dom.appendChild(_createTextNode(arguments[i]));
        } else if (typeof arguments[i] === 'function') {
            _dom.appendChild(arguments[i]());
        }
    }


    return function() {
        if (typeof args[args.length - 1] == 'object') {
        	var options = args[args.length - 1];
            options.style && setStyle(_dom, options.style);
            options.className && setClass(_dom, options.className);
            options.id && setID(_dom, options.id)
        }
        return _dom;
    }
}
/**
*  set html attribute class
 * @param Object domNode   
 */
function setClass(dom, className){
	dom.setAttribute('class',className );
}

/**
*  set html attribute id
 * @param Object domNode   
 */
function setID(dom, id){
	dom.setAttribute('id',id );
}


/**
*  set html attribute styles
 * @param Object domNode   
 */
function setStyle(dom, styles) {
    for (var j in styles) {
        dom.style[j] = styles[j];
    }
}


function _createDom(tagName) {
    return document.createElement(tagName);
}


function _createTextNode(text) {
    return document.createTextNode(text);
}
/**
 * render to a domnode item
 * @param  Object parent node 
 * @param  Object dom  
 * @return boolean/DOM  
 */
re.render = function(node, dom) {
    if (node) {
        return node.innerHTML = dom().innerHTML;
    }
    return false;
};


module.exports = re;

},{}],9:[function(require,module,exports){
var re = require('../utils/re')

/**
 * Backgroung View
 * @param String imageUrl image url
 */
function Background(imageUrl) {
	if(imageUrl)
	    var _backgroundView =
	        re('section', {
	                className: "bg-image",
	                style: {
	                    backgroundImage: 'url(' + imageUrl + ')'
	                }
	            });
    return _backgroundView;
}

module.exports = Background;

},{"../utils/re":8}],10:[function(require,module,exports){
/**
 * Label contain customer title, customer title
 * @param String name  
 * @param String  title
 * @return Function function that contains dom object
 */

var re = require('../utils/re');

function Labels(name, title) {
    var _label = re('section',
        re('h1', title, {
            className: 'customer-title'

        }),
        re('h3', name, {
            className: 'customer-name'
        }), {
            className: "customer-details"
        });
    return _label;
}


module.exports = Labels;

},{"../utils/re":8}],11:[function(require,module,exports){
var re = require('../utils/re')

function _Maps() {
    var lon, lat, node;

    function Maps(longitude, latitude) {
        lon = longitude;
        lat = latitude;
        return node = re('section', {
            className: "map",
            id: 'Map'

        });
    }
    Maps.onMounted = function(data) {
        google.load('maps', '3', {
            other_params: 'sensor=false',
            callback: function() {
                var map = new google.maps.Map(document.getElementById('Map'), {
                    center: { lat: lat, lng: lon },
                    zoom: 9
                });
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lon },
                    map: map,
                    title: 'Hello World!'
                });
                var infowindow = new google.maps.InfoWindow({
                    content: "<h5>"+data+"</h5>"
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
        });
    }
    return Maps
}


module.exports = _Maps();

},{"../utils/re":8}],12:[function(require,module,exports){
var re = require('../utils/re');
var Background = require('./Background');
var Labels = require('./Labels');
var Maps = require('./Maps');


/**
 * Collection View aggregate all the view object
 * 
 */
function RandomPlace(data, node) {
    var customer = data.customer;
    var _dom;
    if (!data.isFetching) {
        _dom = re('div',
            Labels(customer.customerFirstName, customer.activityTitle),
            Maps(customer.activityCoordinateLatitude, customer.activityCoordinateLongitude),
            Background(customer.activityPictureUrl), {
                className: 'customer'
            }
        )
    } else {
        _dom = re('div',
            re('div', 'Loading...', {
                className: 'loader'
            }), {
                className: 'customer'
            }
        )
    }
    re.render(node, _dom);
    if (!data.isFetching) {
        Maps.onMounted(customer.activityTitle);

    }

}

module.exports = RandomPlace;

},{"../utils/re":8,"./Background":9,"./Labels":10,"./Maps":11}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYWN0aW9ucy9jdXN0b21lci5qcyIsInNyYy9qcy9hcHAuanMiLCJzcmMvanMvY29uc3RhbnRzL2FjdGlvbkNvbnN0YW50cy5qcyIsInNyYy9qcy9jb25zdGFudHMvdXJscy5qcyIsInNyYy9qcy9yZWR1Y2Vycy9jdXN0b21lclJlZHVjZXJzLmpzIiwic3JjL2pzL3V0aWxzL2V2ZW50RW1pdHRlci5qcyIsInNyYy9qcy91dGlscy9mZXRjaC5qcyIsInNyYy9qcy91dGlscy9yZS5qcyIsInNyYy9qcy92aWV3cy9CYWNrZ3JvdW5kLmpzIiwic3JjL2pzL3ZpZXdzL0xhYmVscy5qcyIsInNyYy9qcy92aWV3cy9NYXBzLmpzIiwic3JjL2pzL3ZpZXdzL1JhbmRvbVBsYWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogRmx1eCBBY3Rpb24gT2JqZWN0c1xuICpcbiAqIFxuICovXG5cblxuXG52YXIgZmV0Y2ggPSByZXF1aXJlKCcuLi91dGlscy9mZXRjaCcpO1xudmFyIENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hY3Rpb25Db25zdGFudHMnKTtcbnZhciBVUkwgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvdXJscycpO1xuXG4vKipcbiAqIEFjdGlvbiBPYmplY3QgIFJlcXVlc3QgQ3VzdG9tZXIgZGF0YSBiZWZvcmUgYWpheCByZXF1ZXN0IFxuICogQHJldHVybiBvYmplY3QgXG4gKi9cbmZ1bmN0aW9uIHJlcXVlc3RDdXN0b21lcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQ09OU1RBTlRTLlJFUVVFU1RfQ1VTVE9NRVIsXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWVcbiAgICB9XG59XG5cbi8qKlxuICogQWN0aW9uIE9iamVjdCBmcm9tIEN1c3RvbWVyIGRhdGEgYWZ0ZXIgYWpheCByZXF1ZXN0IFxuICogQHJldHVybiBvYmplY3QgXG4gKi9cbmZ1bmN0aW9uIHJlY2VpdmVDdXN0b21lcihkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogQ09OU1RBTlRTLlJFQ0VJVkVfQ1VTVE9NRVIsXG4gICAgICAgIGN1c3RvbWVyOiBkYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuXG4gICAgfVxufVxuXG4vKipcbiAqIEFjdGlvbiBPYmplY3QgZnJvbSBDdXN0b21lciBpZiBlcnJvciBvY2N1cnNcbiAqIEByZXR1cm4gb2JqZWN0IFxuICovXG5mdW5jdGlvbiBnZXRDdXN0b21lckVycm9yKGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBDT05TVEFOVFMuRkVUQ0hfQ1VTVE9NRVJfRVJST1IsXG4gICAgICAgIGVycm9yOiBkYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZVxuICAgIH1cbn1cblxuXG4vKipcbiAqICBBamF4IGNhbGwgdG8gc2VydmVyXG4gKiBAcmV0dXJuIG9iamVjdCBcbiAqL1xuZnVuY3Rpb24gJGh0dHBGZXRjaCh1cmwsIGN1c3RvbWVyKSB7XG4gICAgZmV0Y2goe1xuICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICAgIHVybDogdXJsXG4gICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY3VzdG9tZXIuZGlzcGF0Y2goJ2NoYW5nZScsIHJlY2VpdmVDdXN0b21lcihyZXNwb25zZSkpO1xuXG4gICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY3VzdG9tZXIuZGlzcGF0Y2goJ2NoYW5nZScsIGdldEN1c3RvbWVyRXJyb3IoZXJyb3IpKTtcbiAgICB9KTtcbn1cblxuXG4vKipcbiAqICBSZXRyaWV2ZSBjdXRvbWVyIHRocm91Z2ggYWpheCBhbmQgZGlzcGF0Y2ggYW4gYWN0aW9uIHVwb24gcmVzcG9uc2VcbiAqIEByZXR1cm4gbnVsbCBcbiAqL1xuZnVuY3Rpb24gZmV0Y2hDdXN0b21lcihjdXN0b21lcikge1xuICAgIGN1c3RvbWVyLmRpc3BhdGNoKCdjaGFuZ2UnLCByZXF1ZXN0Q3VzdG9tZXJzKCkpO1xuICAgICRodHRwRmV0Y2goVVJMLCBjdXN0b21lcik7XG4gICAgLy8gcmVmcmVzaFxuICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cEZldGNoKFVSTCwgY3VzdG9tZXIpO1xuICAgIH0sIENPTlNUQU5UUy5JTlRFUlZBTClcblxufVxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZmV0Y2hDdXN0b21lcjogZmV0Y2hDdXN0b21lclxufTtcbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCcuL3V0aWxzL2V2ZW50RW1pdHRlcicpO1xudmFyIGN1c3RvbWVyUmVkdWNlcnMgPSByZXF1aXJlKCcuL3JlZHVjZXJzL2N1c3RvbWVyUmVkdWNlcnMnKTtcbnZhciBjdXN0b21lckFjdGlvbiA9IHJlcXVpcmUoJy4vYWN0aW9ucy9jdXN0b21lcicpO1xudmFyIFJhbmRvbVBsYWNlcyA9IHJlcXVpcmUoJy4vdmlld3MvUmFuZG9tUGxhY2VzJyk7XG5cbi8vIGluc3RhbnRpYXRlIGV2ZW50IGVtaXRlciBhcyBzdG9yZVxudmFyIGN1c3RvbWVyID0gbmV3IEV2ZW50RW1pdHRlcihjdXN0b21lclJlZHVjZXJzKTtcblxuLy9saXN0ZW4gZm9yIGNoYW5nZSBcbmN1c3RvbWVyLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihzdGF0ZSkge1xuICAgIFJhbmRvbVBsYWNlcyggc3RhdGUsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykpO1xufSk7XG5cbi8vIEluaXRpYWxseSBGZXRjaCBkYXRhXG5jdXN0b21lckFjdGlvbi5mZXRjaEN1c3RvbWVyKGN1c3RvbWVyKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSRVFVRVNUX0NVU1RPTUVSOiBcIlJFUVVFU1RfQ1VTVE9NRVJcIixcbiAgICBSRUNFSVZFX0NVU1RPTUVSOiBcIlJFQ0VJVkVfQ1VTVE9NRVJcIixcbiAgICBGRVRDSF9DVVNUT01FUl9FUlJPUjogXCJGRVRDSF9DVVNUT01FUl9FUlJPUlwiLFxuICAgIElOVEVSVkFMOiAxMDAwMFxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcImh0dHBzOi8vd3d3LmdldHlvdXJndWlkZS5jb20vdG91cmluZy5qc29uP2tleT0yR3IwcDd6OTZEXCI7IiwiLyoqXG4gKiBGbHV4IFJlZHVjZXIgT2JqZWN0c1xuICogXG4gKi9cblxudmFyIENPTlNUQU5UUyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hY3Rpb25Db25zdGFudHMnKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICB2YXIgc3RhdGUgPSBzdGF0ZSB8fCB7fTtcbiAgICB2YXIgX3N0YXRlID0gT2JqZWN0LmNyZWF0ZShzdGF0ZSk7XG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIENPTlNUQU5UUy5SRVFVRVNUX0NVU1RPTUVSOlxuICAgICAgICAgICAgX3N0YXRlLmN1c3RvbWVyID0ge307XG4gICAgICAgICAgICBfc3RhdGUuaXNGZXRjaGluZyA9IGFjdGlvbi5pc0ZldGNoaW5nO1xuICAgICAgICAgICAgcmV0dXJuIF9zdGF0ZTtcbiAgICAgICAgY2FzZSBDT05TVEFOVFMuUkVDRUlWRV9DVVNUT01FUjpcbiAgICAgICAgICAgIF9zdGF0ZS5jdXN0b21lciA9IGFjdGlvbi5jdXN0b21lcjtcbiAgICAgICAgICAgIF9zdGF0ZS5pc0ZldGNoaW5nID0gYWN0aW9uLmlzRmV0Y2hpbmc7XG4gICAgICAgICAgICByZXR1cm4gX3N0YXRlO1xuICAgICAgICBjYXNlIENPTlNUQU5UUy5GRVRDSF9DVVNUT01FUl9FUlJPUjpcbiAgICAgICAgICAgIF9zdGF0ZS5lcnJvciA9IGFjdGlvbi5lcnJvcjtcbiAgICAgICAgICAgIF9zdGF0ZS5pc0ZldGNoaW5nID0gYWN0aW9uLmlzRmV0Y2hpbmc7XG4gICAgICAgICAgICByZXR1cm4gX3N0YXRlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn0gICBcbiIsIlxuLyoqXG4gKiBTaW1wbGUgZXZlbnQgZW1pdHRlciBjbGFzc1xuICogQHBhcmFtIGZ1bmN0aW9uIHJlZHVjZXIgXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcihyZWR1Y2VyKSB7XG4gICAgdGhpcy5lbWl0dGVycyA9IHt9O1xuICAgIHRoaXMucmVkdWNlciA9IHJlZHVjZXI7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMucmVkdWNlcihudWxsLCB7dHlwZTogbnVsbH0pO1xufVxuXG5cbi8qKlxuICogUmV0cmlldmUgY3VycmVudCBzdGF0ZVxuICogQHBhcmFtIGZ1bmN0aW9uIHJlZHVjZXIgXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgIHJldHVybiB0aGlzLnN0YXRlO1xufVxuXG4vKipcbiAqIERpc3BsYXkgYW4gYWN0aW9uIGJhc2VkIG9uIGFuIGV2ZW50IFxuICogQHBhcmFtICBTdHJpbmcgZXZ0VHlwZSBcbiAqIEBwYXJhbSAgT2JqZWN0IGFjdGlvbiBcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKGV2dFR5cGUsIGFjdGlvbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbWl0dGVyc1tldnRUeXBlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgX2VtaXQgPSB0aGlzLmVtaXR0ZXJzW2V2dFR5cGVdW2ldO1xuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5yZWR1Y2VyKHRoaXMuZ2V0U3RhdGUoKSwgYWN0aW9uKTtcbiAgICAgICAgX2VtaXQodGhpcy5zdGF0ZSk7XG4gICAgfVxufVxuLyoqXG4gKiBFdmVudCBMaXN0ZW5lcnNcbiAqIEBwYXJhbSAgU3RyaW5nIGV2dCBcbiAqIEBwYXJhbXMgRnVuY3Rpb24gYXJndW1lbnQgICAgXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldnQpIHtcbiAgICB0aGlzLmVtaXR0ZXJzW2V2dF0gPSB0aGlzLmVtaXR0ZXJzW2V2dF0gfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyc1tldnRdLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyOyIsIlxuLyoqXG4gKiBTaW1wbGUgWE1MSHR0cFJlcXVlc3QgT2JqZWN0XG4gKiBAcGFyYW0gIG9iamVjdCBvcHRpb25zIFxuICoge1xuICogIHVybDogdXJsLFxuICogIG1ldGhvZDogXCJQT1NUXCIsIFwiR0VUXCJcbiAqIH1cbiAqIEBwYXJhbSAgZnVuY3Rpb24gc3VjY2VzcyBjYWxsYmFjayBzdWNjZXNzIGZ1bmN0aW9uIFxuICogQHBhcmFtIGZ1bmN0aW9uIGVycm9yICAgY2FsbGJhY2sgZXJyb3IgZnVuY3Rpb24gXG4gKi9cbmZ1bmN0aW9uIGZldGNoKG9wdGlvbnMsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwicmVhZHlzdGF0ZWNoYW5nZVwiLCBwcm9jZXNzUmVxdWVzdCwgZmFsc2UpO1xuICAgIHhoci5vcGVuKG9wdGlvbnMubWV0aG9kLCBvcHRpb25zLnVybCwgdHJ1ZSk7XG4gICAgeGhyLnNlbmQoKTtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NSZXF1ZXN0KGUpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDw9IDM5OSkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgc3VjY2VzcyhyZXNwb25zZSwgeGhyKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlcnJvcih4aHIucmVzcG9uc2VUZXh0LCB4aHIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmV0Y2g7XG4iLCIvKipcbiAqIFNpbXBsZSBET00gbWluaXBsYXRpb24gRnVuY3Rpb25zXG4gKiBAcGFyYW0gIFN0cmluZyB0YWdOYW1lIGUuZyBcImRpdlwiLCAnc3BhbidcbiAqIEBwYXJhbSAgRnVuY3Rpb24vU3RyaW5nIG5lc3RlZCByZSBmdW5jdGlvbiBvciBzaW1wbGUgdGV4dG5vZGUgc3RyaW5nIFxuICogQHJldHVybiBmdW5jdGlvbiAgRE9Nbm9kZVxuICovXG52YXIgcmUgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgdmFyIF9kb20gPSBfY3JlYXRlRG9tKHRhZ05hbWUpO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgX2RvbS5hcHBlbmRDaGlsZChfY3JlYXRlVGV4dE5vZGUoYXJndW1lbnRzW2ldKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX2RvbS5hcHBlbmRDaGlsZChhcmd1bWVudHNbaV0oKSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgXHR2YXIgb3B0aW9ucyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIG9wdGlvbnMuc3R5bGUgJiYgc2V0U3R5bGUoX2RvbSwgb3B0aW9ucy5zdHlsZSk7XG4gICAgICAgICAgICBvcHRpb25zLmNsYXNzTmFtZSAmJiBzZXRDbGFzcyhfZG9tLCBvcHRpb25zLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICBvcHRpb25zLmlkICYmIHNldElEKF9kb20sIG9wdGlvbnMuaWQpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9kb207XG4gICAgfVxufVxuLyoqXG4qICBzZXQgaHRtbCBhdHRyaWJ1dGUgY2xhc3NcbiAqIEBwYXJhbSBPYmplY3QgZG9tTm9kZSAgIFxuICovXG5mdW5jdGlvbiBzZXRDbGFzcyhkb20sIGNsYXNzTmFtZSl7XG5cdGRvbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyxjbGFzc05hbWUgKTtcbn1cblxuLyoqXG4qICBzZXQgaHRtbCBhdHRyaWJ1dGUgaWRcbiAqIEBwYXJhbSBPYmplY3QgZG9tTm9kZSAgIFxuICovXG5mdW5jdGlvbiBzZXRJRChkb20sIGlkKXtcblx0ZG9tLnNldEF0dHJpYnV0ZSgnaWQnLGlkICk7XG59XG5cblxuLyoqXG4qICBzZXQgaHRtbCBhdHRyaWJ1dGUgc3R5bGVzXG4gKiBAcGFyYW0gT2JqZWN0IGRvbU5vZGUgICBcbiAqL1xuZnVuY3Rpb24gc2V0U3R5bGUoZG9tLCBzdHlsZXMpIHtcbiAgICBmb3IgKHZhciBqIGluIHN0eWxlcykge1xuICAgICAgICBkb20uc3R5bGVbal0gPSBzdHlsZXNbal07XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIF9jcmVhdGVEb20odGFnTmFtZSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xufVxuXG5cbmZ1bmN0aW9uIF9jcmVhdGVUZXh0Tm9kZSh0ZXh0KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xufVxuLyoqXG4gKiByZW5kZXIgdG8gYSBkb21ub2RlIGl0ZW1cbiAqIEBwYXJhbSAgT2JqZWN0IHBhcmVudCBub2RlIFxuICogQHBhcmFtICBPYmplY3QgZG9tICBcbiAqIEByZXR1cm4gYm9vbGVhbi9ET00gIFxuICovXG5yZS5yZW5kZXIgPSBmdW5jdGlvbihub2RlLCBkb20pIHtcbiAgICBpZiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5pbm5lckhUTUwgPSBkb20oKS5pbm5lckhUTUw7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSByZTtcbiIsInZhciByZSA9IHJlcXVpcmUoJy4uL3V0aWxzL3JlJylcblxuLyoqXG4gKiBCYWNrZ3JvdW5nIFZpZXdcbiAqIEBwYXJhbSBTdHJpbmcgaW1hZ2VVcmwgaW1hZ2UgdXJsXG4gKi9cbmZ1bmN0aW9uIEJhY2tncm91bmQoaW1hZ2VVcmwpIHtcblx0aWYoaW1hZ2VVcmwpXG5cdCAgICB2YXIgX2JhY2tncm91bmRWaWV3ID1cblx0ICAgICAgICByZSgnc2VjdGlvbicsIHtcblx0ICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJiZy1pbWFnZVwiLFxuXHQgICAgICAgICAgICAgICAgc3R5bGU6IHtcblx0ICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICd1cmwoJyArIGltYWdlVXJsICsgJyknXG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0pO1xuICAgIHJldHVybiBfYmFja2dyb3VuZFZpZXc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2dyb3VuZDtcbiIsIi8qKlxuICogTGFiZWwgY29udGFpbiBjdXN0b21lciB0aXRsZSwgY3VzdG9tZXIgdGl0bGVcbiAqIEBwYXJhbSBTdHJpbmcgbmFtZSAgXG4gKiBAcGFyYW0gU3RyaW5nICB0aXRsZVxuICogQHJldHVybiBGdW5jdGlvbiBmdW5jdGlvbiB0aGF0IGNvbnRhaW5zIGRvbSBvYmplY3RcbiAqL1xuXG52YXIgcmUgPSByZXF1aXJlKCcuLi91dGlscy9yZScpO1xuXG5mdW5jdGlvbiBMYWJlbHMobmFtZSwgdGl0bGUpIHtcbiAgICB2YXIgX2xhYmVsID0gcmUoJ3NlY3Rpb24nLFxuICAgICAgICByZSgnaDEnLCB0aXRsZSwge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnY3VzdG9tZXItdGl0bGUnXG5cbiAgICAgICAgfSksXG4gICAgICAgIHJlKCdoMycsIG5hbWUsIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2N1c3RvbWVyLW5hbWUnXG4gICAgICAgIH0pLCB7XG4gICAgICAgICAgICBjbGFzc05hbWU6IFwiY3VzdG9tZXItZGV0YWlsc1wiXG4gICAgICAgIH0pO1xuICAgIHJldHVybiBfbGFiZWw7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBMYWJlbHM7XG4iLCJ2YXIgcmUgPSByZXF1aXJlKCcuLi91dGlscy9yZScpXG5cbmZ1bmN0aW9uIF9NYXBzKCkge1xuICAgIHZhciBsb24sIGxhdCwgbm9kZTtcblxuICAgIGZ1bmN0aW9uIE1hcHMobG9uZ2l0dWRlLCBsYXRpdHVkZSkge1xuICAgICAgICBsb24gPSBsb25naXR1ZGU7XG4gICAgICAgIGxhdCA9IGxhdGl0dWRlO1xuICAgICAgICByZXR1cm4gbm9kZSA9IHJlKCdzZWN0aW9uJywge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiBcIm1hcFwiLFxuICAgICAgICAgICAgaWQ6ICdNYXAnXG5cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIE1hcHMub25Nb3VudGVkID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBnb29nbGUubG9hZCgnbWFwcycsICczJywge1xuICAgICAgICAgICAgb3RoZXJfcGFyYW1zOiAnc2Vuc29yPWZhbHNlJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnTWFwJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiB7IGxhdDogbGF0LCBsbmc6IGxvbiB9LFxuICAgICAgICAgICAgICAgICAgICB6b29tOiA5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogeyBsYXQ6IGxhdCwgbG5nOiBsb24gfSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSGVsbG8gV29ybGQhJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIjxoNT5cIitkYXRhK1wiPC9oNT5cIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBNYXBzXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBfTWFwcygpO1xuIiwidmFyIHJlID0gcmVxdWlyZSgnLi4vdXRpbHMvcmUnKTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi9CYWNrZ3JvdW5kJyk7XG52YXIgTGFiZWxzID0gcmVxdWlyZSgnLi9MYWJlbHMnKTtcbnZhciBNYXBzID0gcmVxdWlyZSgnLi9NYXBzJyk7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIFZpZXcgYWdncmVnYXRlIGFsbCB0aGUgdmlldyBvYmplY3RcbiAqIFxuICovXG5mdW5jdGlvbiBSYW5kb21QbGFjZShkYXRhLCBub2RlKSB7XG4gICAgdmFyIGN1c3RvbWVyID0gZGF0YS5jdXN0b21lcjtcbiAgICB2YXIgX2RvbTtcbiAgICBpZiAoIWRhdGEuaXNGZXRjaGluZykge1xuICAgICAgICBfZG9tID0gcmUoJ2RpdicsXG4gICAgICAgICAgICBMYWJlbHMoY3VzdG9tZXIuY3VzdG9tZXJGaXJzdE5hbWUsIGN1c3RvbWVyLmFjdGl2aXR5VGl0bGUpLFxuICAgICAgICAgICAgTWFwcyhjdXN0b21lci5hY3Rpdml0eUNvb3JkaW5hdGVMYXRpdHVkZSwgY3VzdG9tZXIuYWN0aXZpdHlDb29yZGluYXRlTG9uZ2l0dWRlKSxcbiAgICAgICAgICAgIEJhY2tncm91bmQoY3VzdG9tZXIuYWN0aXZpdHlQaWN0dXJlVXJsKSwge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2N1c3RvbWVyJ1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgICAgX2RvbSA9IHJlKCdkaXYnLFxuICAgICAgICAgICAgcmUoJ2RpdicsICdMb2FkaW5nLi4uJywge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xvYWRlcidcbiAgICAgICAgICAgIH0pLCB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnY3VzdG9tZXInXG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG4gICAgcmUucmVuZGVyKG5vZGUsIF9kb20pO1xuICAgIGlmICghZGF0YS5pc0ZldGNoaW5nKSB7XG4gICAgICAgIE1hcHMub25Nb3VudGVkKGN1c3RvbWVyLmFjdGl2aXR5VGl0bGUpO1xuXG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tUGxhY2U7XG4iXX0=
