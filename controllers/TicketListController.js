myApp.controller('TicketListController',['$route',  'AuthToken', 'requestService','Auth', '$location', 'pnotifyService', 'urlService', function($route, AuthToken, requestService, Auth, $location, pnotifyService, urlService){
	var main = this;
	this.logout = function(){
		Auth.logout();
		pnotifyService.success('Logout', 'Logout successfully');
		$location.path('/');
	};
	// get token from local storage
	this.token = AuthToken.getToken();
	// function to list the ticket
	this.showTicketList = function(){
		main.loadingfull = true;
		requestService.getData(urlService.baseUrl+'tickets/list?token='+this.token).then(function successCallback(response){
			main.loadingfull = false;
			main.tickets = response.data;
			console.log(main.tickets);
		},function errorCallback(response){
			main.loadingfull = false;
			console.log(response);
		});	
	};

}]);