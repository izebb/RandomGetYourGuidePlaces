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
