//controller to manage admin list ticket
myApp.controller('AdminController',['$http','AuthToken', '$location','pnotifyService', 'requestService', 'urlService', function($http, AuthToken, $location, pnotifyService, requestService, urlService){
	var main = this;
	// getting local storage token from AuthToken service
	var token = AuthToken.getToken();
	// function to get total tickets for admin
	this.getTickets = function(){
		main.loadingfull = true;
		requestService.getData(urlService.baseUrl+'tickets/admin/list?token='+token).then(function successCallback(response){
			  main.loadingfull = false;
              main.tickets = response.data;
              // pnotify service for success notification
              pnotifyService.success('Welcome', 'Hello Mentor!');
          },function errorCallback(response){
          	  main.loadingfull = false;
              console.log(response);
              // pnotify service for error notification
              pnotifyService.error('Error', 'Something went wrong!');
          });
	}	

}]);