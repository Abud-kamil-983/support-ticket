myApp.controller('CreateTicketController',['Upload', '$http', 'AuthToken','Auth','pnotifyService','$location', 'urlService', function(Upload, $http, AuthToken, Auth, pnotifyService, $location, urlService){
	var main = this;
	// retreiving local strogae token
	var token = AuthToken.getToken();
	// function to generate a ticket 
	this.saveTicket = function(form, file){
		// form validation check
		if (form.$invalid) {
			// error notification
			pnotifyService.error('Incorrect Fillup', 'Please fill up your form correctly!');
			return false;
		}
		main.loading = true;
		if (file) {
			// if client upload file, storing it to ticket object
			main.ticket.file = file;
		}
		// http request to post ticket
		Upload.upload({
			method: 'POST',
			url: urlService.baseUrl+'tickets/save?token='+token,
			data:main.ticket
		}).then(function successCallback(response){
			main.loading = false;
			console.log(response);
			//success notification
			pnotifyService.success('Success', 'Ticket Generated Successfully!');
		  	$location.path("/ticket-list");
		},function errorCallback(response){
			main.loading = false;
          	console.log(response);
          	//error notification
          	pnotifyService.error('Error', 'Something went wrong!');
      	});
		// resetting form after submit
		main.ticket = {};
	}

				

}]);