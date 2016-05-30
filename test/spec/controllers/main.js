'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('testerFrontApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(MainCtrl.awesomeThings.length).toBe(5);
  });
});


describe('Controller: AdminTestCtrl', function () {

  // load the controller's module
  beforeEach(module('testerFrontApp'));

  var AdminTestCtrl,
    scope;

  // Initialize the controller and a mock scope
  

	
	describe('new test:  ', function() {
			
		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			AdminTestCtrl = $controller('AdminTestCtrl', {
				$scope: scope,
				$routeParams: {testId: 'createnew'}
				// place here mocked dependencies
			});
		}));
	
		describe('Test create:  ', function() {
			
			it('there should be no questions when create new test', function () {
				expect(scope.questions.length).toBe(0);		
			});
			
			it('add question. length should be 1', function () {
				scope.addQuestion();
				expect(scope.questions.length).toBe(1);
			});
			
			it('new question answers length should be 0', function () {
				scope.addQuestion();
				expect(scope.questions[0].allAnswers.length).toEqual(0);				
			});
			
			it('check if answers adding correctly ', function () {	
				scope.addQuestion();		
				scope.addAnswer(scope.questions[0]);	
				scope.addAnswer(scope.questions[0]);			
				expect(scope.questions[0].allAnswers.length).toEqual(2);
			});
				
			it('check if answers adding correctly ', function () {	
				scope.addQuestion();		
				scope.addAnswer(scope.questions[0]);	
				scope.addAnswer(scope.questions[0]);			
				expect(scope.questions[0].allAnswers.length).toEqual(2);
			});
					
		});
		
		describe('question submit verification:  ', function() {
			
			beforeEach(function() {
				scope.addQuestion();
				//scope.addQuestion();
				scope.addAnswer(scope.questions[0]);
				scope.addAnswer(scope.questions[0]);			
			});
			
			
			it('check if empty answers is not verificated ', function () {				
				expect(scope.verifyAnswer(scope.questions[0])).toBe(false);		
			});
			
			it('check if filled answer is verificated ', function () {
				scope.questions[0].allAnswers[0] = {
					"text":"answer 1",
					"isDefault":true,
					"isTrue":false,
				};
				
				scope.questions[0].allAnswers[1] = {
					"text":"answer 1",
					"isDefault":false,
					"isTrue":false,
				};
				scope.questions[0].textDescription = "question_1";
				
				expect(scope.verifyQuestion(scope.questions[0])).toBe(true);			
			});	
			
			it('check if image answers without image chosen are not verificated ', function () {
				scope.questions[0].allAnswers[0] = {
					"text":"answer 1",
					"isDefault":true,
					"isTrue":false,

				};
				
				scope.questions[0].allAnswers[1] = {
					"text":"answer 1",
					"isDefault":false,
					"isTrue":false
				};
				scope.questions[0].textDescription = "question_1";
				scope.questions[0].answersAreImages = true;
				
				expect(scope.verifyQuestion(scope.questions[0])).toBe(false);			
			});
			
			it('check if image answers with image chosen are  verificated ', function () {
				scope.questions[0].allAnswers[0] = {
					"text":"answer 1",
					"isDefault":true,
					"isTrue":false,
					"imgId": 1234
				};
				
				scope.questions[0].allAnswers[1] = {
					"text":"answer 1",
					"isDefault":false,
					"isTrue":false,
					"imgId": 1235
				};
				scope.questions[0].textDescription = "question_1";
				scope.questions[0].answersAreImages = true;
				
				expect(scope.verifyQuestion(scope.questions[0])).toBe(true);			
			});

			it('check if text answer is verificated ', function () {
				scope.questions[0].type = "text";
				scope.questions[0].textAnswer = "answer 1";
				
				scope.questions[0].textDescription = "question_1";
				expect(scope.verifyQuestion(scope.questions[0])).toBe(true);			
			});			
		});
		
		describe('test submit verification:  ', function() {
			
			beforeEach(function() {
				scope.addQuestion();
				scope.questions[0].type = "text";
				scope.questions[0].textAnswer = "answer 1";
				
				scope.questions[0].textDescription = "question_1";
			});
			
			
			it('check if test without test data is not verificated ', function () {				
				expect(scope.submitTest()).toBe(false);		
			});
			
			it('check if test with test data is verificated ', function () {
				
				scope.test.testName = "test 1";
				scope.test.startDate = 1461785956668;
				scope.test.endDate = 1461785956668;

				expect(scope.submitTest()).toBe(true);		
			});		
		});
	});
	
	
	describe('existing test:  ', function() {
		var httpBackend, authRequestHandler,createController;
		
		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
		
			createController = function() {
				return  $controller('AdminTestCtrl', {
					$scope: scope,
					$routeParams: {testId: 1}
					// place here mocked dependencies
				});
			};
		}));
		
		describe('test query mock  ', function() {
			
			beforeEach(inject(function($httpBackend) {			
				httpBackend = $httpBackend;
				// backend definition common for all tests
				//authRequestHandler = httpBackend.when('GET', 'api/admin/tests/:id.json').respond({userId: 'userX'}, {'A-Token': 'xxx'});
//console.log(httpBackend);	
//console.log("httpBackend-------------------------");				
			}));
			
			
			it('check if test without test data is not verificated ', function () {				
				httpBackend.expectGET('api/admin/tests/1.json').respond({
					"id":1,
					"testName": "firstTest",
					"isPublic": true,
					"startDate": 1461785956668,
					"endDate": 1461785959999,
					"questions": [1,2]
				});
				httpBackend.expectGET('api/admin/questions/1.json').respond({
						"id":1,
						"textDescription": "question № 1",
						"type": "radio",
						"picture": "",
						"imgId":"",
						"answersAreImages": false,
						"imageIncluded": false,
						"textAnswer": "",
						"allAnswers": [
						{
							"text":"answer 1",
							"isDefault":true,
							"isTrue":false,
							"imgId":""
						},
						{
							"text":"answer 2",
							"isDefault":false,
							"isTrue":false,
							"imgId":""
						},
						{
							"text":"answer 3",
							"isDefault":false,
							"isTrue":false,
							"imgId":""
						}]	
				});
				httpBackend.expectGET('api/admin/questions/2.json').respond({
						"id":2,
						"textDescription": "question № 2",
						"type": "checkbox",
						"picture": "",
						"imgId":"",
						"answersAreImages": false,
						"imageIncluded": false,
						"textAnswer": "",
						"allAnswers": [
							{
								"text":"answer 1",
								"isTrue":false,
								"isDefault":false,
								"imgId":""
							},
							{
								"text":"answer 2",
								"isTrue":true,
								"isDefault":false,
								"imgId":""
							},
							{
								"text":"answer 3",
								"isTrue":false,
								"isDefault":false,
								"imgId":""
							}]	
				});
				AdminTestCtrl = createController();
				httpBackend.flush();
			});
			

		});
	});
	
});

