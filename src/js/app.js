var EventEmitter =  require('./utils/eventEmitter');
var customerReducers =  require('./reducers/customerReducers');
var customerAction =  require('./actions/customer');

var customer  = new EventEmitter(customerReducers);

customer.on('change', function(state){
	//Change View
});

customerAction.fetchCustomer(customer);


