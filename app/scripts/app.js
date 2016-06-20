'use strict';

/**
 * @ngdoc overview
 * @name testerFrontApp
 * @description
 * # testerFrontApp
 *
 * Main module of the application.
 */
angular
  .module('testerFrontApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
	'testerFrontServices',
	'angular-oauth2',
	'720kb.datepicker'
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
	  .when('/test/:testId', {
		  templateUrl: 'views/test.html',
		  controller: 'TestCtrl',
		  controllerAs: 'test'
      })
	  .when('/admin', {
		  templateUrl: 'views/admin.html',
		  controller: 'AdminCtrl',
		  controllerAs: 'admin'
      })
	  .when('/admin/test', {
		  templateUrl: 'views/admin_test.html',
		  controller: 'AdminTestCtrl',
		  controllerAs: 'admintest'
      })
	  .when('/admin/test/:testId', {
		  templateUrl: 'views/admin_test.html',
		  controller: 'AdminTestCtrl',
		  controllerAs: 'admintest'
      })
	  .when('/admin/statistics/:statsId', {
		  templateUrl: 'views/admin_stats.html',
		  controller: 'AdminStatsCtrl',
		  controllerAs: 'admintest'
      })
	  .when('/login', {
		  templateUrl: 'views/login.html',
		  controller: 'LoginCtrl',
		  controllerAs: 'login'
      })
      .otherwise({
        redirectTo: '/'
      });
	  
  }]);

  
angular.module('testerFrontApp').constant('app_config', {
	apiUrl: 'http://localhost:1337/'
	//apiUrl: 'http://54.149.152.128:1337/'
	//apiUrl: '/'
});



angular.module('testerFrontApp')
	.config(['OAuthProvider', 'OAuthTokenProvider', 'app_config', function(OAuthProvider, OAuthTokenProvider, app_config) {
		OAuthProvider.configure({
			baseUrl: app_config.apiUrl,
			clientId: 'angular',
			clientSecret: 'zljw29lq0d42', 
		    grantPath: 'api/oauth/token',
			revokePath: 'api/oauth/token'
		});
		OAuthTokenProvider.configure({
			name: 'token',
			options: {
				secure: false
			}
		});
	}])
	.run(['$rootScope', '$window', 'OAuth', '$cookies', '$location', '$route', function($rootScope, $window, OAuth, $cookies, $location, $route) {
		$rootScope.$on('oauth:error', function(event, rejection) {
			// Ignore `invalid_grant` error - should be catched on `LoginController`.
			if ('invalid_grant' === rejection.data.error) {
				return;
			}

			if('invalid_token' === rejection.data.error){
				if ('Token expired' === rejection.data.error_description) {
					var url = $location.url();
					/*return OAuth.getRefreshToken().then(function(res) {
						$window.location.href = '#/' + url;            
					});*/
					
					return OAuth.getRefreshToken().then(
						function(success) {
							console.log("reload page after refresh token");
							$route.reload();
							//$window.location.reload();
							//$window.location.href = '#' + url;
						},
						function(error) {
							$cookies.remove('token');
							return $window.location.href = '#/login?error_reason=' + rejection.data.error;
					});
				} else if("Not admin user" === rejection.data.error_description){
					return $window.location.href = '#/login?error_reason=' + rejection.data.error_description;	
				} else {
					$cookies.remove('token');
					return $window.location.href = '#/login?error_reason=' + rejection.data.error;	
				}	
			}
			//return $window.location.href = '#/login?error_reason=' + rejection.data.error_description;		
			return setTimeout(function() { 
				return $window.location.href = '#/login?error_reason=' + rejection.data.error_description;
			},500);
		});
	}]);