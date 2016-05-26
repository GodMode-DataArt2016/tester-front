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
	'testerFrontServices'
  ])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/'
      });
  });
