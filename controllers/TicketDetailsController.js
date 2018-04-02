myApp.controller('TicketDetailsController',['$http',  'AuthToken', '$routeParams', '$route', 'pnotifyService','requestService','urlService', function($http, AuthToken, $routeParams, $route, pnotifyService, requestService, urlService){
	var main = this;
	// get token from local storage
	var token = AuthToken.getToken();
	// api base url
	this.baseUrl = urlService.baseUrl;
	var ticketID = $routeParams.ticketID;
	// function to get details of particular ticket
	this.getTicketDetails = function(){
		requestService.getData(urlService.baseUrl+'tickets/'+ticketID+'?token='+token).then(function successCallback(response){
			main.ticket = response.data;
			console.log(response.data);
		},function errorCallback(response){
			console.log(response);
		});	
	};
	// functio to change the status of ticket by user
	this.changeStatus = function(){
		main.loadingStatus = true;
		requestService.putData(urlService.baseUrl+'tickets/status/'+ticketID+'?token='+token).then(function successCallback(response){
			main.loadingStatus = false;
			main.hideIt = true;
			console.log(response.data);
			// success notification
			$route.reload();
			pnotifyService.success('Success', 'Your query status has been changed!');
		},function errorCallback(response){
			main.loadingStatus = false;
			// error notification
			pnotifyService.error('Error', 'something went wrong!');
			console.log(response);
		});	
	};
	// function to add reply by user
	this.answerSubmit = function(form){
		// checking form validation
		if (form.$invalid) {
			// error notification
			pnotifyService.error('Incorrect Fillup', 'Please fill up your form correctly!');
			return false;
		}

		main.loading = true;
		// request to post data to database
		requestService.postData(main.answer, urlService.baseUrl+'tickets/answer/save/'+ticketID+'?token='+token).then(function successCallback(response){
			main.loading = false;
			console.log(response.data);
			// clearing form
			main.answer = {};
			$route.reload();
			// success notification
			pnotifyService.success('Success', 'You successfully replied!');

		},function errorCallback(response){
			main.loading = false;
			//console.log(response);
			console.log(response);
			// error notification
			pnotifyService.error('Error', 'Something went wrong!');
		});	
		
	};

}]);