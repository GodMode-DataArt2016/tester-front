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
	.controller('TestCtrl', ['$scope', '$routeParams', 'Test', 'Question', 'SubmitUser', function($scope, $routeParams, Test, Question, SubmitUser) {
		var questions = [];
		$scope.questions = questions;
		$scope.userForm = {};
		
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
		};
		
		$scope.submitArray = null;
		
		$scope.submitAnswer = function() {
			var verified = true;
			
			var submitObject = {};
			
			var userForm = $scope.userForm;
			submitObject.userForm = userForm;			
			submitObject.questions = [];
			
			if(!(userForm.name && userForm.surname && userForm.phone && userForm.email)){
				verified = false;
			}
						
			$scope.questions.forEach(function(item){
				var answerInfo = {};
				var cbVerified = false;
				answerInfo.id = item.id;
				switch (item.type) {
					case "radio":
						answerInfo.answer = item.radioAnswer;					
					
						for(var index in item.allAnswers){
							if(item.allAnswers[index].isDefault){ 
								cbVerified = true;
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
						for(var index in item.allAnswers){
							if(item.allAnswers[index].isTrue){ 
								cbVerified = true;
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
					submitObject.questions.push(answerInfo);
				} else {
					verified = false;				
				}
				
			});
					
			if(verified){
				$scope.saveObj = new SubmitUser();
				
				$scope.saveObj.data = submitObject;
				
				SubmitUser.save($scope.saveObj, function() {
					
					alert("saved");
				});	
				
				alert("success");	
			} else {
				alert("answer all the questions");		
			}
			console.log(submitObject);
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
		};
		
		$scope.addAnswer =  function(question){
			var newAnswer = {};
			newAnswer.text = '';
			newAnswer.isTrue = false;
			question.allAnswers.push(newAnswer);		
		};
		
		$scope.removeAnswer = function(question, id){
			console.log(question);
			question.allAnswers.splice(id, 1);
			console.log(question);
		};
		
		$scope.removeQuestion = function (arr, id){
				arr.splice(id, 1);	
		};
		
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
		};
}]);





angular.module('testerFrontApp')
	.controller('AdminTestCtrl', ['$scope', '$routeParams', 'TestAdmin', 'QuestionAdmin', 'SubmitAdmin', 'SubmitImage', function($scope, $routeParams, TestAdmin, Question, SubmitAdmin, SubmitImage) {
		var questions = [];
		$scope.questions = questions;
		$scope.test = {};
		$scope.images = [];
		
		if($routeParams.testId !== 'createnew'){
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
		}				
				
		$scope.addQuestion = function(){
			var newQuestion = {};
			newQuestion.type = 'radio';
			newQuestion.allAnswers = [];
			$scope.questions.push(newQuestion);	
		};
		
		$scope.addAnswer =  function(question){
			var newAnswer = {};
			newAnswer.text = '';
			newAnswer.isTrue = false;
			question.allAnswers.push(newAnswer);		
		};
		
		$scope.removeAnswer = function(question, id){
			console.log(question);
			question.allAnswers.splice(id, 1);
			console.log(question);
		};
		
		$scope.removeQuestion = function (arr, id){
				arr.splice(id, 1);	
		};
		
		$scope.setDefault = function(allAnswers, answer){
			angular.forEach(allAnswers, function(p) {
				p.isDefault = false; 
			});
			answer.isDefault = true;
		};
		
		$scope.questionImgChanged = function(question, input){
			if (input.files && input.files[0]) {
				/*var reader = new FileReader();
				
				reader.onload = function (e) {
					$scope.$apply(function () {
						question.picture =  e.target.result;
					});
				}			
				reader.readAsDataURL(input.files[0]);*/
				$scope.$apply(function () {
					question.picture = URL.createObjectURL(event.target.files[0]);
				});
			}
		};
		
		$scope.answerImgChanged = function(answer, input){
			if (input.files && input.files[0]) {
				/*var reader = new FileReader();
				
				reader.onload = function (e) {
					$scope.$apply(function () {
						answer.url =  e.target.result;
					});
				}			
				reader.readAsDataURL(input.files[0]);
				*/
				$scope.$apply(function () {			
					answer.url = URL.createObjectURL(event.target.files[0]);
					
				});
				$scope.images.push(event.target.files[0]);			
			}
		};
		
		$scope.submitTest = function (){
			var verified = true;
			var submitObject = {};
			
			submitObject.testName = $scope.test.testName;
			submitObject.startDate = $scope.test.startDate;
			submitObject.endDate = $scope.test.endDate;
			submitObject.isPublic = $scope.test.isPublic;
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
				$scope.sendTestData(submitObject);
				//alert("success");	
			} else {
				alert("provide all data");		
			}
		};

		$scope.sendTestData = function (obj){
			$scope.saveObj = new SubmitAdmin(); 
			
			$scope.saveObj.data = obj;
			
			SubmitAdmin.save($scope.saveObj, function() {

				alert("saved");
				//$scope.sendTestImg();
			});		
			//$scope.sendTestImg();
		};
		
		$scope.sendTestImg = function (obj){
				
			var images = $scope.images;

			/*images.forEach(function (file) {
				$scope.saveObj = new SubmitImage(); 
				
				var formData = new FormData();
				formData.append('photos[]', file, file.name);
				
				
				
				$scope.saveObj.data = formData;
				SubmitImage.save($scope.saveObj, function() {
					
					console.log("saved");
				});
			});	*/
					
			for (var i = 0; i < images.length; i++) { // test save to local.
				var formData = new FormData();
				var file = images[i];
				
				// Check the file type.
				if (!file.type.match('image.*')) {
					continue;
				}
				
				// Add the file to the request.
				formData.append('photos[]', file, file.name);
				var xhr = new XMLHttpRequest();			
				xhr.open('POST', 'http://localhost:4500/api/saveimage', true);
				
				xhr.onload = function () {
					if (xhr.status === 200) {
						// File(s) uploaded.
					} else {
						alert('An error occurred!');
					}
				};			
				xhr.send(formData);
			}
		};
}]);
