'use strict';

describe('Controller: MainCtrl', function () {
	
	beforeEach(module('testerFrontApp'));
	
	var $controller;
	
	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));
	
	describe('Init settings: ', function() {
		
		var $scope, controller;
		
		beforeEach(function() {
			$scope = {};
			controller = $controller('MainCtrl', { $scope: $scope });
		});
	
		it('currentPage should be 0', function() {	
			expect($scope.currentPage).toBe(0);
		});	
		
		it('pageSize should be 15', function() {			
			expect($scope.pageSize).toBe(15);
		});	
		
		it('numberOfPages should be 1', function() {			
			expect($scope.numberOfPages).toBe(1);
		});	
	});
});



