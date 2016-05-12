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
	.controller('AdminCtrl', ['$scope', 'TestAdmin', function($scope, TestAdmin) {
		$scope.tests = TestAdmin.query();
}]);

angular.module('testerFrontApp')
	.controller('TestCtrl', ['$scope', '$routeParams', 'Test', 'Question', function($scope, $routeParams, Test, Question) {
		var questions = [];
		$scope.questions = questions;
		
		Test.get({ id: $routeParams.testId}, function(data) {
			$scope.test = data;
			$scope.test.startDate = new Date(data.startDate);
			$scope.test.endDate = new Date(data.endDate);
			
			var questions = [];
			var questionIDs = data.questions;
			
			questionIDs.forEach(function (ID) {
				Question.get({ id: ID}, function(data) {									
					questions.push(data);					
				});
			});		
			$scope.questions = questions;
		});	
		
		$scope.setDefault = function(allAnswers, answer){
			angular.forEach(allAnswers, function(p) {
				p.isDefault = false; 
			});
			answer.isDefault = true;
		}
		
		$scope.submitArray = null;
		
		$scope.submitAnswer = function() {
			var verified = true;
			var submitArray = [];
			
			submitArray.userForm = $scope.userForm;
			
			$scope.questions.forEach(function(item){
				var answerInfo = {};
				answerInfo.id = item.id;
				switch (item.type) {
					case "radio":
						answerInfo.answer = item.radioAnswer;					
						var cbVerified = false;
						for(var index in item.allAnswers){
							if(item.allAnswers[index].isDefault){ 
								var cbVerified = true
							}
						}
						if(cbVerified){
							answerInfo.answer = item.allAnswers;	
						} else {
							verified = false;	
						}	
					break;
					case "text":
						answerInfo.answer = item.textAnswer;
					break;
					case "checkbox":
						var cbVerified = false;
						for(var index in item.allAnswers){
							if(item.allAnswers[index].isTrue){ 
								var cbVerified = true
							}
						}
						if(cbVerified){
							answerInfo.answer = item.allAnswers;	
						} else {
							verified = false;	
						}											
					break;
				}
				if(answerInfo.answer){
					submitArray.push(answerInfo);
				} else {
					verified = false;				
				}
				
			});
					
			if(verified){
				alert("success");	
			} else {
				alert("answer all the questions");		
			}
			console.log(submitArray);
		};	
}]);


angular.module('testerFrontApp')
	.controller('NewtestCtrl', ['$scope', function($scope) {
		var questions = [];
		$scope.questions = questions;
		
		$scope.addQuestion = function(){
			var newQuestion = {};
			newQuestion.type = 'radio';
			newQuestion.allAnswers = [];
			$scope.questions.push(newQuestion);	
		}
		
		$scope.addAnswer =  function(question){
			var newAnswer = {};
			newAnswer.text = '';
			newAnswer.isTrue = false;
			question.allAnswers.push(newAnswer);		
		}
		
		$scope.removeAnswer = function(question, id){
			console.log(question);
			question.allAnswers.splice(id, 1);
			console.log(question);
		}
		
		$scope.removeQuestion = function (arr, id){
				arr.splice(id, 1);	
		}
		
		$scope.submitTest = function (){
			var verified = true;
			var submitObject = [];
			
			submitObject.testName = $scope.testName;
			submitObject.startDate = $scope.startDate;
			submitObject.endDate = $scope.endDate;
			submitObject.isPublic = $scope.isPublic;
			submitObject.questions = [];
			
			if(!(submitObject.testName && submitObject.startDate && submitObject.endDate)){
				verified = false;	
			}
			
			if(!$scope.questions.length){
				verified = false;	
			}
			
			$scope.questions.forEach(function(item){
				var questionInfo = {};
				questionInfo.id = item.id;
				switch (item.type) {
					case "radio":
						if(item.allAnswers.length){
							item.allAnswers.forEach(function(item){
								if(!item) {
									verified = false;	
								}	
							});
							questionInfo.answers = item.allAnswers;
							questionInfo.type = "radio";
						} else {
							verified = false;	
						}
					break;
					case "text":
						if(item.textAnswer){
							questionInfo.answers = item.textAnswer;
							questionInfo.type = "text";
						} else {
							verified = false;
						}
					break;
					case "checkbox":
						if(item.allAnswers.length){
							item.allAnswers.forEach(function(item){
								if(!item) {
									verified = false;	
								}	
							});
							questionInfo.answers = item.allAnswers;
							questionInfo.type = "checkbox";
						} else {
							verified = false;	
						}											
					break;
				}
				if(questionInfo.answers){
					submitObject.questions.push(questionInfo);
				} else {
					verified = false;				
				}
				
			});
			
			if(verified){
				alert("success");	
			} else {
				alert("provide all data");		
			}
		}
}]);





angular.module('testerFrontApp')
	.controller('AdminTestCtrl', ['$scope', '$routeParams', 'TestAdmin', 'QuestionAdmin', function($scope, $routeParams, TestAdmin, Question) {
		var questions = [];
		$scope.questions = questions;
		
		TestAdmin.get({ id: $routeParams.testId}, function(data) {
			$scope.test = data;
			$scope.test.startDate = new Date(data.startDate);
			$scope.test.endDate = new Date(data.endDate);
			
			var questions = [];
			var questionIDs = data.questions;
			
			questionIDs.forEach(function (ID) {
				Question.get({ id: ID}, function(data) {									
					questions.push(data);					
				});
			});		
			$scope.questions = questions;
		});		
				
		$scope.addQuestion = function(){
			var newQuestion = {};
			newQuestion.type = 'radio';
			newQuestion.allAnswers = [];
			$scope.questions.push(newQuestion);	
		}
		
		$scope.addAnswer =  function(question){
			var newAnswer = {};
			newAnswer.text = '';
			newAnswer.isTrue = false;
			question.allAnswers.push(newAnswer);		
		}
		
		$scope.removeAnswer = function(question, id){
			console.log(question);
			question.allAnswers.splice(id, 1);
			console.log(question);
		}
		
		$scope.removeQuestion = function (arr, id){
				arr.splice(id, 1);	
		}
		
		$scope.setDefault = function(allAnswers, answer){
			angular.forEach(allAnswers, function(p) {
				p.isDefault = false; 
			});
			answer.isDefault = true;
		}
		
		$scope.submitTest = function (){
			var verified = true;
			var submitObject = [];
			
			submitObject.testName = $scope.testName;
			submitObject.startDate = $scope.startDate;
			submitObject.endDate = $scope.endDate;
			submitObject.isPublic = $scope.isPublic;
			submitObject.questions = [];
			
			if(!(submitObject.testName && submitObject.startDate && submitObject.endDate)){
				verified = false;	
			}
			
			if(!$scope.questions.length){
				verified = false;	
			}
			
			$scope.questions.forEach(function(item){
				var questionInfo = {};
				questionInfo.id = item.id;
				switch (item.type) {
					case "radio":
						if(item.allAnswers.length){
							item.allAnswers.forEach(function(item){
								if(!item) {
									verified = false;	
								}	
							});
							questionInfo.answers = item.allAnswers;
							questionInfo.type = "radio";
						} else {
							verified = false;	
						}
					break;
					case "text":
						if(item.textAnswer){
							questionInfo.answers = item.textAnswer;
							questionInfo.type = "text";
						} else {
							verified = false;
						}
					break;
					case "checkbox":
						if(item.allAnswers.length){
							item.allAnswers.forEach(function(item){
								if(!item) {
									verified = false;	
								}	
							});
							questionInfo.answers = item.allAnswers;
							questionInfo.type = "checkbox";
						} else {
							verified = false;	
						}											
					break;
				}
				if(questionInfo.answers){
					submitObject.questions.push(questionInfo);
				} else {
					verified = false;				
				}
				
			});
			
			if(verified){
				alert("success");	
			} else {
				alert("provide all data");		
			}
		}
}]);