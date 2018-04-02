var myApp = angular.module('supportTicketApp', ['ngRoute', 'ui.tinymce','jlareau.pnotify', 'ngSanitize', 'angularMoment', 'ui.filters', 'ngMessages', 'ngFileUpload']);

//protecting auth routes

myApp.run(['$rootScope', '$location', 'Auth', 'notificationService', function ($rootScope, $location, Auth, notificationService) {
    $rootScope.$on('$routeChangeStart', function (event, next) {
    	console.log(next.$$route.protected);
    	if (next.$$route.protected === true) {
	        if (!Auth.isLoggedIn()) {
	        	if ($location.path() !=='/') {
		        	notificationService.notify({
						title: 'Unauthorized Entry',
						text: 'Please Login To Continue',
						hide: true,
						type:'notice'
					});

					$location.path('/');
				}
	            
	        }
	    }    
    });
}]); 