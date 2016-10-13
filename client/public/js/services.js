angular.module("app")
.factory("AuthService",
["$q", "$timeout", "$http", "$rootScope",
function($q, $timeout, $http, $rootScope){

	var user = null;

	function isLoggedIn(){
		if (user) return true;
		return false;

	}

	function getUserStatus(){
		return $http.get('/api/user/status')
		.success(function (data) {
			if (data.status){
				user = true;
				$rootScope.loggedIn = true;
			}
			else {
				user = false;
				$rootScope.loggedIn = false;
			}
		})
		.error(function (data) {
			user = false;
		});
	}

	function login(obj){
		var deferred = $q.defer();
		$http.post('/api/user/login',
		{username: obj.username, password: obj.password, remember: obj.remember})
		.success(function(data, status){
			$rootScope.status = data.status;
			if (status == 200 && data.status){
				user = true;
				$rootScope.loggedIn = true;
				$rootScope.currentUser = data.user;
				// $rootScope.loggedUser = function () {
				// 	return User.get();
				// };
				// console.log(User.get());
				// $rootScope.currentUser = User.get();
				deferred.resolve();
			}
			else {
				user = false;
				$rootScope.loggedIn = false;
				deferred.reject();
			}
		})
		.error(function(data){
			user = false;
			$rootScope.loggedIn = false;
			deferred.reject();
		});
		return deferred.promise;
	}

	function logout(){
		var deferred = $q.defer();
		$rootScope.loggedIn = false;

		$http.get("/api/user/logout")
		.success(function(data){
			user = false;
			deferred.resolve();
		})
		.error(function(data){
			user = false;
			deferred.reject();
		});

		return deferred.promise;
	}

	function register(username, password, passwordConfirm, email, firstname, lastname, postalAddress){
		var deferred = $q.defer();

		$http.post("/api/user/register",{
			username: username,
			password: password,
			firstname: firstname,
			lastname: lastname,
			email: email,
			postalAddress: postalAddress
		})
		.success(function(data, status){
			if (status == 200 && data.status){
				$rootScope.loggedIn = true;
				user = true;
				deferred.resolve();
			}
			else
			deferred.reject();
		})
		.error(function(data){
			deferred.reject();
		});

		return deferred.promise;
	}
	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout: logout,
		register: register
	});

}]);
