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
