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
	.controller('TestCtrl', ['$scope', '$routeParams', 'Test', 'Question', function($scope, $routeParams, Test, Question) {
		Test.get({ id: $routeParams.testId}, function(data) {
			$scope.test = data;
			
			var questions = [];
			var questionIDs = data.questions;
			
			questionIDs.forEach(function (ID) {
				Question.get({ id: ID}, function(data) {									
					var allAnswers = {};
					data.allAnswers.forEach(function(item){
						allAnswers[item] = false;	
					});
					
					data.allAnswers = allAnswers;

					if(data.type == 'radio'){
						data.radioAnswer = null;	
					}
					if(data.type == 'text'){
						data.textAnswer = null;	
					}
					questions.push(data);					
				});
			});		
			$scope.questions = questions;
		});
		
		
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
					break;
					case "text":
						answerInfo.answer = item.textAnswer;
					break;
					case "checkbox":
						var cbVerified = false;
						for(var index in item.allAnswers){
							if(item.allAnswers[index]){ 
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



