'use strict';
/*
describe('Controller: TestCtrl', function () {

	var TestCtrl, scope;
	var localSubmitUser,localTest;

	beforeEach(module('testerFrontApp'));
	beforeEach(module('testerFrontServices'));
	
	var $controller;
	
	beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
	}));
  
	beforeEach(inject(function ($controller, $rootScope, Test, SubmitUser) {
		localTest = Test;
		localSubmitUser = SubmitUser;
		scope = $rootScope.$new();
		TestCtrl = $controller('TestCtrl', {
			$scope: scope,
			$routeParams: {testId: 1},
			Test: localTest,
			SubmitUser: localSubmitUser
		});
	}));
	
	describe('$scope.setDefault: ', function() {
		it('sets the setDefault property true if chosen', function() {
			var allAnswers = [
				{
					text: "answer 1",
					isDefault: false		
				},
				{
					text: "answer 2",
					isDefault: false		
				},
				{
					text: "answer 2",
					isDefault: false		
				}
			];
			console.log("scope = ", $scope);
			$scope.setDefault(allAnswers, allAnswers[0]);	
			expect(allAnswers[0].isDefault).toBe(true);
			
			$scope.setDefault(allAnswers, allAnswers[1]);	
			expect(allAnswers[1].isDefault).toBe(true);
			expect(allAnswers[1].isDefault).toBe(false);
		});
	});
	
	
});*/


describe('PasswordController', function() {
  beforeEach(module('testerFrontApp'));

  var $controller;

	beforeEach(inject(function(_$controller_){
	// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$scope.setDefault', function() {
		
		var $scope, controller;
		
		beforeEach(function() {
			$scope = {};
			controller = $controller('TestCtrl', { $scope: $scope });
		});
			
		it('sets the setDefault property true if chosen', function() {

			var allAnswers = [
			{
				text: "answer 1",
				isDefault: false		
			},
			{
				text: "answer 2",
				isDefault: false		
			},
			{
				text: "answer 2",
				isDefault: false		
			}
			];
			$scope.setDefault(allAnswers, allAnswers[0]);	
			expect(allAnswers[0].isDefault).toBe(true);
			
			$scope.setDefault(allAnswers, allAnswers[1]);	
			expect(allAnswers[1].isDefault).toBe(true);
			expect(allAnswers[0].isDefault).toBe(false);
		});	
	});
	
	describe('Init settings:', function() {
		
		var $scope, controller;
		
		beforeEach(function() {
			$scope = {};
			controller = $controller('TestCtrl', { $scope: $scope });
		});
		
		it('init test should have no questions', function() {
			expect($scope.test.questions.length).toBe(0);
		});	
		
		it('init test should have submited = false', function() {
			expect($scope.submited).toBe(false);
		});	
		
		it('init test should have submitText = false', function() {
			expect($scope.submitText).toBe('');
		});	
		
	});
	
	describe('Test answers verify:', function() {
		
		var $scope, controller;
		
		beforeEach(function() {
			$scope = {};
			controller = $controller('TestCtrl', { $scope: $scope });
			
			$scope.test = {
				"isAvailable":true,
				"availabilityText":"",
				"testName":"test 1",
				"isPublic":true,
				"startDate":"2016-05-31",
				"endDate":"2016-06-28",
				"questions":[
					{
						"id":1,
						"textDescription":"question 1",
						"type":"checkbox",
						"imgId":"",
						"answersAreImages":false,
						"imageIncluded":false,
						"textAnswer":"",
						"allAnswers":[
						{
							"text":"answer 1",
							"imgId":"",
							"isDefault":false,
							"isTrue":false
						},
						{
							"text":"answer 2",
							"imgId":"",
							"isDefault":false,
							"isTrue":false
						}
						]
					}
				],
				"id":1
			}
		});
		
		describe('$scope.submitAnswer', function() {
			it('test should be not submited without answers', function() {
				expect($scope.submitAnswer()).toBe('Answer all the questions. ');
			});	
			
			it('test should be submited with answers', function() {
				$scope.test.questions[0].allAnswers[0].isTrue = true;
				expect($scope.submitAnswer()).toBe('Success');
			});	
		});
		
		describe('$scope.transformTest', function() {
			it('transformed test should have id', function() {
				var submitObject = $scope.transformTest();
				expect(submitObject.id).toBe(1);
			});	
			
			it('transformed test should have testName', function() {
				var submitObject = $scope.transformTest();
				expect(submitObject.testName).toBe("test 1");
			});	
			
			it('transformed test should have questions', function() {
				var submitObject = $scope.transformTest();
				expect(submitObject.questions.length).toBe(1);
			});	
		});
		
		describe('$scope.transformQuestion', function() {
			it('transformed question should have id', function() {
				var submitObject = $scope.transformQuestion($scope.test.questions[0]);
				expect(submitObject.id).toBe(1);
			});	
			
			it('transformed question should have textDescription', function() {
				var submitObject = $scope.transformQuestion($scope.test.questions[0]);
				expect(submitObject.textDescription).toBe("question 1");
			});

			it('transformed question should have type', function() {
				var submitObject = $scope.transformQuestion($scope.test.questions[0]);
				expect(submitObject.type).toBe("checkbox");
			});	

			it('transformed question should have answers', function() {
				var submitObject = $scope.transformQuestion($scope.test.questions[0]);
				expect(submitObject.allAnswers.length).toBe(2);
			});	
			
			it('transformed text question should have text answer', function() {
				var textQuestion = {
					"id":1,
					"textDescription":"question 1",
					"type":"text",
					"textAnswer":"answer_1",
					"allAnswers":[]
				};
				var submitObject = $scope.transformQuestion(textQuestion);
				expect(submitObject.textAnswer).toBe("answer_1");
			});			
		});
		
		describe('$scope.transformAnswers', function() {
			
			var oneQuestion = {
				"id":1,
				"textDescription":"question 1",
				"type":"checkbox",
				"textAnswer":"",
				"allAnswers":[
					{
						"text":"answer 1",
						"imgId":"",
						"isDefault":false,
						"isTrue":true
					},
					{
						"text":"answer 2",
						"imgId":"",
						"isDefault":false,
						"isTrue":false
					}
				]
			}
				
			it('transformed checkbox answer should have isTrue property', function() {
				var submitObject = $scope.transformAnswers(oneQuestion);
				expect(submitObject[0].isTrue).toBe(true);
			});	
					
			it('transformed radio answer should have isDefault property', function() {
				oneQuestion.type = "radio";
				oneQuestion.allAnswers[0].isDefault = true;
				var submitObject = $scope.transformAnswers(oneQuestion);
				expect(submitObject[0].isDefault).toBe(true);
			});							
		});
		
		describe('$scope.verifyQuestion', function() {
			var textQuestion = {
				"id":1,
				"textDescription":"question 1",
				"type":"text",
				"textAnswer":"",
				"allAnswers":[]
			};
			
			it('text question should not be submited without text answer', function() {
				expect($scope.verifyQuestion(textQuestion)).toBe(false);
			});	
			
			it('question should not be submited if answer not chosen', function() {
				expect($scope.verifyQuestion($scope.test.questions[0])).toBe(false);
			});
			
			it('question should be submited if answer  chosen', function() {
				$scope.test.questions[0].allAnswers[0].isTrue = true;				
				expect($scope.verifyQuestion($scope.test.questions[0])).toBe(true);
			});
		});
		
		describe('$scope.verifyAnswer', function() {
			var oneQuestion = {
				"id":1,
				"textDescription":"question 1",
				"type":"checkbox",
				"textAnswer":"",
				"allAnswers":[
					{
						"text":"answer 1",
						"imgId":"",
						"isDefault":false,
						"isTrue":false
					},
					{
						"text":"answer 2",
						"imgId":"",
						"isDefault":false,
						"isTrue":false
					}
				]
			}
						
			it('checkbox question should not be submited if answer not chosen', function() {
				expect($scope.verifyAnswer(oneQuestion)).toBe(false);
			});
			
			it('checkbox question should be submited if answer chosen', function() {
				oneQuestion.allAnswers[0].isTrue = true;
				expect($scope.verifyAnswer(oneQuestion)).toBe(true);
			});
			
			it('radio question should not be submited if answer not chosen', function() {
				oneQuestion.type = "radio";
				expect($scope.verifyAnswer(oneQuestion)).toBe(false);
			});
			
			it('radio question should be submited if answer chosen', function() {
				oneQuestion.allAnswers[0].isDefault = true;
				expect($scope.verifyAnswer(oneQuestion)).toBe(true);
			});
		});
	});
});
