myApp.controller('AdminDetailsController',['$http',  'AuthToken', '$routeParams', '$route','pnotifyService', 'requestService', 'urlService', function($http, AuthToken, $routeParams, $route, pnotifyService, requestService, urlService){
	var main = this;
	// token from local storage 
	var token = AuthToken.getToken();
	var ticketID = $routeParams.ticketID;
	// api base url to pass to view for showing file from the server
	this.baseUrl = urlService.baseUrl;
	// function to get details of particular ticket
	this.getTicketDetails = function(){
		requestService.getData(urlService.baseUrl+'tickets/'+ticketID+'?token='+token).then(function successCallback(response){
			main.ticket = response.data;
		},function errorCallback(response){
			console.log(response);
		});	
	}

	// functio to change the status of ticket by mentor
	this.changeStatus = function(){
		main.loadingStatus = true;
		requestService.putData(urlService.baseUrl+'tickets/status/'+ticketID+'?token='+token).then(function successCallback(response){
			main.loadingStatus = false;
			main.hideIt = true;
			console.log(response.data);
			// success notification
			$route.reload();
			pnotifyService.success('Success', 'student query status has been changed!');
		},function errorCallback(response){
			main.loadingStatus = false;
			// error notification
			pnotifyService.error('Error', 'something went wrong!');
			console.log(response);
		});	
	};


	// function to post answer given by admin/mentor
	this.answerSubmit = function(form){
		//checking form validation and show notification
		if (form.$invalid) {
			pnotifyService.error('Invalid Fillup', 'Please fill up your form correctly!');
			return false;
		}
		main.loading = true;
		//http request to post answer by admin/mentor
		requestService.postData(main.answer, urlService.baseUrl+'tickets/admin/answer/save/'+ticketID+'?token='+token).then(function successCallback(response){
			main.loading = false;
			console.log(response.data);
			main.answer = {};
			$route.reload();
			// success notification
			pnotifyService.success('Success', 'You have successfully answerd!');
		},function errorCallback(response){
			main.loading = false;
			//console.log(response);
			console.log(response);
			// error notification 
			pnotifyService.error('Error', 'Something went wrong!');
		});	
		
	};

}]);