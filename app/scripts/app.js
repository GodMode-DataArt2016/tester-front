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
      .otherwise({
        redirectTo: '/'
      });
  });
