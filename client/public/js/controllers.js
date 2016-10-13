angular.module('app')
.controller('MainController', function($scope) {

	// this.sendMessage = function() {
	// 	console.log("test");
	// }
	this.title = 'Default';
	// this.firstname = 'Default';
})
.controller('homeController',
	["$scope", "$http", "$location", "AuthService",
	function($scope, $http, $location, AuthService) {
		var _this = this;

		if (!AuthService.isLoggedIn()) $location.path("/login");
		$scope.main.title = 'Messages';

		this.getMessages = function() {
			$http.get('/api/messages')
			.then(function(res) {
				_this.messages = res.data;
			});
		};

		this.getMessages();

		this.removeMessage = function(id) {
			$http.delete('/api/messages/' + id)
			.then(function() {
				_this.getMessages();
			});
		};

		this.sendMessage = function() {
			if (!this.newmsg || !this.newmsg.title || !this.newmsg.text)
				return ;
			$http.post('/api/messages', this.newmsg)
			.then(function() {
				_this.getMessages();
			});
			this.newmsg = {};
		};

	}])
.controller('logoutController',
	['$scope', '$location', 'AuthService',
	function ($scope, $location, AuthService) {

		$scope.logout = function () {

			AuthService.logout()
			.then(function () {
				$location.path('/login');
			});
		};
		$scope.logout();

	}])


.controller('registerController',
	['$scope', '$location', 'AuthService',
	function ($scope, $location, AuthService) {
		$scope.main.title = "Let's register Bambino !";

		$scope.register_form = function () {
			if($scope.registerForm.password === $scope.registerForm.passwordConfirm) {
				$scope.error = false;
				$scope.disabled = true;

				AuthService.register(
					$scope.registerForm.email,
					$scope.registerForm.password,
					$scope.registerForm.passwordConfirm,
					$scope.registerForm.email,
					$scope.registerForm.firstname,
					$scope.registerForm.lastname,
					$scope.registerForm.postalAddress)
				.then(function () {
					$location.path('/');
					$scope.disabled = false;
					$scope.registerForm = {};

				})
				.catch(function () {
					$scope.error = true;
					$scope.errorMessage = "Heyyyy failed";
					$scope.disabled = false;
					$scope.registerForm = {};
				});

			}
			else {
				$scope.error = true;
				$scope.errorMessage = "Heyyyy failed";
				$scope.disabled = false;
				$scope.registerForm = {};
			}
		};
	}])
.controller('usersController',
	function($scope, $http){

		$http({
			method : "POST",
			url : "/users",
			headers: {
				'Content-Type' : 'application/json'
			}
		})
		.then(function mySucces(response) {
			$scope.list = response.data;
		},
		function myError(response) {
			$scope.err= response.statusText;
		});

	})


	.controller('profileController', ['$scope','$http', '$location', 'AuthService', '$routeParams', '$rootScope',
	function($scope, $http, $location, AuthService, $routeParams, $rootScope) {
		$scope.profile = $routeParams.id;
		$http({
			method: 'GET',
			url: '/user/'+ $scope.profile,
			headers: {
				'Content-Type' : 'application/json'
			}
		})
		.then(function successCallback(response) {
			$scope.user = response.data;
		},
		function myError(response) {
			$scope.err= response.statusText;
		});

		$scope.updateUser = function(){
			// console.log("client controller update");
			$http({
				method: 'PUT',
				url: '/updateUser/' + $scope.profile,
				headers: {
					'Content-Type' : 'application/json'
				},
				data: {user: $scope.user}
			})
			.then(function successCallback(response) {
				$scope.user = response.data;
				$location.path( "/profile/:id" );
			},
			function myError(response) {
				$scope.err= response.statusText;
			})
		};
		$scope.deleteUser = function(){
			// console.log("client controller delete");
			$http({
				method: 'DELETE',
				url: '/deleteUser/' + $scope.profile,
				headers: {
					'Content-Type' : 'application/json'
				},
			})
			.then(function successCallback(response) {
				$scope.user = response.data;
				$location.path( "/users" );
			},
			function myError(response) {
				$scope.err= response.statusText;
			})
		};

		//add messages
		var _this = this;

		if (!AuthService.isLoggedIn()) $location.path("/login");
		$scope.main.title = 'Messages';

		this.getMessages = function() {
			$http.get('/api/messages/from/' + $routeParams.id)
			.then(function(res) {
				_this.messages = res.data;
			});
		};

		this.getMessages();

		this.removeMessage = function(id) {
			$http.delete('/api/messages/' + id)
			.then(function() {
				_this.getMessages();
			});
		};

		this.sendMessage = function() {
			if (!this.newmsg || !this.newmsg.title || !this.newmsg.text)
			return ;
			$http.post('/api/messages', this.newmsg)
			.then(function() {
				_this.getMessages();
			});
			this.newmsg = {};
		};

		$scope.friendRequest = function(id){
			console.log("call to friend request angular js")
			$http({
				method: 'GET',
				url: '/requestfriend/' + $scope.profile,
				headers: {
					'Content-Type' : 'application/json'},
					data: {user: $scope.user}
				})
			.then(function successCallback(response) {
				console.log("angular controller");
				$scope.user = response.data;
				$location.path("/users");
			},
			function myError(response) {
				$scope.err= response.statusText;
			})
		};

			$http({
				method: 'GET',
				url: '/listfriends/' + $scope.profile,
				headers: {
					'Content-Type' : 'application/json'},
					data: {user: $scope.users}
				})
			.then(function successCallback(response) {
				$scope.users = response.data;
			},
			function myError(response) {
				$scope.err= response.statusText;
			})

}])

.controller('errorController',
	function($scope) {
	})

angular.module('app')
	.run(function ($rootScope, $location, $route, AuthService) {
		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			AuthService.getUserStatus()
			.then(function(){
				if (next.access.restricted && !AuthService.isLoggedIn()){
					$location.path('/login');
					$route.reload();
				}
			});
		});
});
