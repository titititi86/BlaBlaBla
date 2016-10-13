angular.module('app')
.controller('loginController',
['$scope', '$location', 'AuthService',
function ($scope, $location, AuthService) {

	$scope.main.title = "Heyyyy login !";
	$scope.loginForm = {
		username : '',
		password : '',
		remember : false
	};

	$scope.login_form = function () {
		console.log($scope.loginForm);
		$scope.error = false;
		$scope.disabled = true;


		AuthService.login($scope.loginForm)
		.then(function () {
			$location.path('/');
			$scope.disabled = false;
			$scope.loginForm = {};
		})
		.catch(function () {
			$scope.error = true;
			$scope.errorMessage = "Invalid email and/or password";
			$scope.disabled = false;
			$scope.loginForm = {};
		});

	};

	$scope.login_form = function () {

		$scope.error = false;
		$scope.disabled = true;

		AuthService.login($scope.loginForm)
		.then(function() {
			$location.path('/');
			$scope.disabled = false;
			$scope.loginForm = {};
		})
		.catch(function() {
			$scope.error = true;
			$scope.errorMessage = "Invalid email and/or password";
			$scope.disabled = false;
			$scope.loginForm = {};
		});

	};
}]);
