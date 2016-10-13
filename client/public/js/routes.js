angular.module('app')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
	.when("/", {
		templateUrl: "/views/messages.html",
		controller: "homeController as msg",
		access: {restricted: true}
	})
	.when("/login", {
		templateUrl: "/views/login.html",
		controller: "loginController as login",
		access: {restricted: false}
	})
	.when("/logout", {
		templateUrl: "/views/logout.html",
		controller: "logoutController",
		access: {restricted: true}
	})
	.when("/register", {
		templateUrl: "/views/register.html",
		controller: "registerController as register",
		access: {restricted: false}
	})
	.when('/users', {
		templateUrl : '/views/users.html',
		controller  : 'usersController',
		access: {restricted: false}
	})
	.when('/profile/:id', {
		templateUrl : 'views/profile.html',
		controller : 'profileController as pfl',
		access : {restricted: true}
	})
	.when('/updateUser/:id', {
		templateUrl : 'views/updateUser.html',
		controller : 'profileController',
		access : {restricted: true}
	})
	.when('/deleteUser/:id', {
		// templateUrl : 'views/updateUser.html',
		controller : 'profileController',
		access : {restricted: true}
	})
	.when('/friendrequest/:id', {
		controller: 'profileController',
		access : {restricted: true}
	})
	.when('/friendslist/:id', {
		templateUrl: 'views/profile.html',
		controller: 'profileController',
		access : {restricted: true}
	})
	.otherwise({
		templateUrl: "/views/404.html",
		controller: 'errorController',
		access: {restricted: true}
	});

	$locationProvider.html5Mode(true);

}]);
