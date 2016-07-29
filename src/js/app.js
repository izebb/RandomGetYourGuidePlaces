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