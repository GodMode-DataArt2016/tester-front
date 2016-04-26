'use strict';

/**
 * @ngdoc function
 * @name testerFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testerFrontApp
 */
  
  
  
angular.module('testerFrontApp')
	.controller('MainCtrl', ['$scope', 'Test', function($scope, Test) {
		$scope.tests = Test.query();
}]);

angular.module('testerFrontApp')
	.controller('TestCtrl', ['$scope', '$routeParams', 'Test', function($scope, $routeParams, Test) {
		/*$scope.test = Test.get({testId: $routeParams.testId}, function(test) {
			$scope.questions = test.questions[0];
		});*/
		
		
		
		
		Test.get({ id: $routeParams.testId}, function(data) {
			$scope.test = data;
		});
}]);


