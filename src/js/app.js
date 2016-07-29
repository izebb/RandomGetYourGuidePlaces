var Customer =  require('./models/customer');
var customer  = new Customer();

customer.on('change', function(value){
	

});

customer.fetch();