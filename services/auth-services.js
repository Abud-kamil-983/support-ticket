myApp.factory('AuthToken', function($window){
	var authTokenFactory = {};
	// storing jwt token to local storage
	authTokenFactory.setToken = function(token){
		$window.localStorage.setItem('token',token);
	};
	// retreiving token from local storegae
	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	};


	return authTokenFactory;
});


myApp.factory('Auth', function($http, AuthToken, urlService){
	var authFactory = {};
	// checking if user is loggedin
	authFactory.isLoggedIn = function(){
		if (AuthToken.getToken()) {
			return true;
		} else{
			return false;
		}
	};
	// getting auth user
	authFactory.getAuthUser = function(){
		if (AuthToken.getToken()) {
			return $http.get(urlService.baseUrl+'tickets/me?token='+AuthToken.getToken()).then(function(data){
			 	return data;
			 });
		}
	}

	authFactory.logout = function(){
		localStorage.removeItem("token");
	}

	return authFactory;
});