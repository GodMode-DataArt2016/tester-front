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
	  .when('/admin/newtest', {
		  templateUrl: 'views/newtest.html',
		  controller: 'NewtestCtrl',
		  controllerAs: 'newtest'
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
	.run(['$rootScope', '$window', 'OAuth', '$cookies', function($rootScope, $window, OAuth, $cookies) {
		$rootScope.$on('oauth:error', function(event, rejection) {
		  // Ignore `invalid_grant` error - should be catched on `LoginController`.
		  if ('invalid_grant' === rejection.data.error) {
			return;
		  }

		  // Refresh token when a `invalid_token` error occurs.
		  if ('invalid_token' === rejection.data.error) {
			return OAuth.getRefreshToken();
		  }
		  

		  // Redirect to `/login` with the `error_reason`.
		  return $window.location.href = '#/login?error_reason=' + rejection.data;
		  //return $window.location.href = '#/login/' + rejection.data.error;
		});
	}]);