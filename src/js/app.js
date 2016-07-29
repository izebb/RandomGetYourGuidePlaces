var EventEmitter =  require('./utils/eventEmitter');
var customerReducers =  require('./reducers/customerReducers');
var customerAction =  require('./actions/customer');


var customer  = new EventEmitter(customerReducers);
// var views = new View('root');

customer.on('change', function(state){

});

customerAction.fetchCustomer(customer);


