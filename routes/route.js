myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'views/sign-in.html',
		controller: 'LoginController',
		protected:false
	}).
	when('/sign-up', {
		templateUrl: 'views/sign-up.html',
		controller: 'SignupController',
		protected:false
	}).
	when('/forgot-password', {
		templateUrl: 'views/forgot.html',
		controller: 'ForgotController',
		protected:false
	}).
	when('/reset/:token', {
		templateUrl: 'views/reset.html',
		controller: 'ResetController',
		protected:false
	}).
	when('/create-ticket', {
		templateUrl: 'views/create-ticket.html',
		controller: 'CreateTicketController',
		protected:true
	}).
	when('/ticket-list', {
		templateUrl: 'views/ticket-list.html',
		controller: 'TicketListController',
		protected:true
	}).
	when('/ticket-details/:ticketID', {
		templateUrl: 'views/ticket-details.html',
		controller: 'TicketDetailsController',
		protected:true
	}).
	when('/admin/ticket-details/:ticketID', {
		templateUrl: 'views/admin-ticket-details.html',
		controller: 'AdminDetailsController',
		protected:true
	}).
	when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'AdminController',
		protected:true
	}).
	otherwise({
		redirectTo: '/'
	});
}]);