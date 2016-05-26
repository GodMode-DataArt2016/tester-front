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
		$scope.userForm = {
			unconfirmed: false	
		};
		
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
			var status = "";
			
			var userForm = $scope.userForm;
			
			// check if user form data is filled
			if(!(userForm.name && userForm.surname && userForm.phone && userForm.email)){
				verified = false;
				status+= "Fill in user data. ";
				$scope.userForm.unconfirmed = true;
			} else {
				$scope.userForm.unconfirmed = false;	
			}
			
			// check if all questions are correct
			var questionsVeryfy = true;
			$scope.questions.forEach(function(item){	
				if($scope.verifyQuestion(item)){
					item.unconfirmed = false;					
				} else {					
					questionsVeryfy = false;
					item.unconfirmed = true;
				}
			});
			
			if(!questionsVeryfy){
				verified = false;
				status+= "Answer all the questions. ";				
			}
			
			// final verification check		
			if(verified){
				status = "Success";
				$scope.saveObj = new SubmitUser();
				
				var submitObject = $scope.transformTest();
				$scope.saveObj.data = submitObject;
				
				console.log(submitObject);
				
				SubmitUser.save($scope.saveObj, function() {				
					alert("saved");
				});	
				
				alert(status);	
			} else {
				alert(status);		
			}
		};	
		
		$scope.verifyQuestion = function (question){
			var verified = true;
		
			
			if(question.type === "text") {// if type is text check that answer is present,
				if(!question.textAnswer){
					verified = false;	
				}
			} else {
				// check if correct answers chosen	
				if(!$scope.verifyAnswer(question)){
					verified = false;				
				}					
			}
			
			return verified;
		};
		
		$scope.verifyAnswer = function (question){
			var answersChosen = false;
			if(question.type === "radio"){
				question.allAnswers.forEach(function(item){
					if(item.isDefault){
						answersChosen = true;	
					}	
				});	
			} else if(question.type === "checkbox"){
				question.allAnswers.forEach(function(item){
					if(item.isTrue){
						answersChosen = true;	
					}	
				});	
			}
			
			return answersChosen;
		};
		
		$scope.transformTest = function (){
			var submitObject = {};
			
			submitObject.userForm = $scope.transformUserform($scope.userForm);
			submitObject.id = $scope.test.id;
			submitObject.testName = $scope.test.testName;

			
			submitObject.questions = [];

			$scope.questions.forEach(function(item){	
				submitObject.questions.push($scope.transformQuestion(item));
			});
			
			return submitObject;
		};
		
		$scope.transformUserform = function (form){
			return {
				name:form.name,
				surname:form.surname,
				phone:form.phone,
				email:form.email,			
			};		
		}
		
		$scope.transformQuestion = function (question){
			var submitObj = {
				id: question.id,
				textDescription: question.textDescription,			
			};
			
			if(question.type === "text") {
				submitObj.textAnswer = question.textAnswer;	
			} else {
				submitObj.allAnswers = $scope.transformAnswers(question);
			}
			
			return submitObj;
		};
		
		$scope.transformAnswers = function (question){
			var submitObj = [];
				
			if(question.type === "radio"){
				question.allAnswers.forEach(function(item){
					submitObj.push({
						text: item.text,
						isDefault: item.isDefault,	
					});
				});	
			} else if(question.type === "checkbox"){
				question.allAnswers.forEach(function(item){
					submitObj.push({
						text: item.text,
						isTrue: item.isTrue,	
					});
				});	
			}
			return submitObj;	
		};
}]);


angular.module('testerFrontApp')
	.controller('AdminTestCtrl', ['$scope', '$routeParams', 'TestAdmin', 'QuestionAdmin', 'SubmitAdmin', 'SubmitImage', function($scope, $routeParams, TestAdmin, Question, SubmitAdmin, SubmitImage) {
		var questions = [];
		$scope.questions = questions;
		$scope.test = {
			unconfirmed: false	
		};
		
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
			var newQuestion = {				
				type: "radio",	
				textDescription: "",
				answersAreImages: false,
				imageIncluded: false,
				picture: "",
				imgId:101,
				allAnswers: [],
				unconfirmed: false
			};
			$scope.questions.push(newQuestion);	
		};
		
		$scope.addAnswer =  function(question){
			var newAnswer = {
				text: "",
				isTrue: false,
				isDefault: false,
				imgId: "",
				unconfirmed: false
			};
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
				$scope.$apply(function () {
					question.picture = URL.createObjectURL(event.target.files[0]);
				});
				$scope.postImg2(question, input);
			}
		};
		
		$scope.answerImgChanged = function(answer, input){
			if (input.files && input.files[0]) {
				$scope.$apply(function () {			
					answer.url = URL.createObjectURL(event.target.files[0]);	
				});
				//$scope.images.push(event.target.files[0]);
				$scope.postImg2(answer, input);
			}
		};
		
		$scope.postImg = function (model, input){
			var formData = new FormData();
			var file = input.files[0];
			
			if (!file.type.match('image.*')) {
				
			}
			
			formData.append('image', file, file.name);
			var xhr = new XMLHttpRequest();			
			xhr.open('POST', 'http://localhost:4500/api/saveimage', true);
			
			xhr.onload = function () {
				if (xhr.status === 200) {
					console.log(xhr);
					var jsonResponse = JSON.parse(xhr.responseText);
					if(jsonResponse.id){						
						model.imgId = jsonResponse.id;	
					}
				} else {
					alert('An error occurred!');
				}
			};			
			xhr.send(formData);	
		}
		
		$scope.postImg2 = function (model, input){
			var formData = new FormData();
			var file = input.files[0];

			formData.append('image', file, file.name);
			
			
			SubmitImage.create({}, formData).$promise.then(function (res) {
					//var jsonResponse = JSON.parse(res.responseText);
					if(res.id){						
						model.imgId = res.id;	
					}
				}).catch(function (err) {
					alert('An error occurred!');
						console.log(err);
			});
			
			
		}
		
		$scope.submitTest = function (){
			var verified = true;
			
			var submitObject = {};
			
			submitObject.id = $scope.test.id;
			submitObject.testName = $scope.test.testName;
			submitObject.startDate = $scope.test.startDate;
			submitObject.endDate = $scope.test.endDate;
			submitObject.isPublic = $scope.test.isPublic;
			submitObject.questions = [];
			
			if(!(submitObject.testName && submitObject.startDate && submitObject.endDate)){
				verified = false;
				$scope.test.unconfirmed = true;
			} else {
				$scope.test.unconfirmed = false;	
			}
			
			if(!$scope.questions.length){
				verified = false;	
			}
			
			// check if all questions are correct
			var questionsVeryfy = true;
			$scope.questions.forEach(function(item){	
				if($scope.verifyQuestion(item)){
					submitObject.questions.push(item);
					item.unconfirmed = false;
				} else {					
					questionsVeryfy = false;
					item.unconfirmed = true;					
				}
			});
			
			if(!questionsVeryfy){
				verified = false;	
			}
			
			// final verification check
			if(verified){
				$scope.sendTestData(submitObject);
				//alert("success");	
			} else {
				alert("provide all data");		
			}
		};
		
		$scope.verifyQuestion = function (question){
			var verified = true;
			
			if(question.imageIncluded && !question.imgId) {
				verified = false;	
			}
			
			if(!question.textDescription){
				verified = false;	
			}
			 
			if(question.type === "text") {// if type is text check that answer is present,
				if(!question.textAnswer) {
					verified = false;							
				}
			} else {
				// check if there is more than 1 answer
				if(question.allAnswers.length < 2) {
					verified = false;	
				}
				
				// check if answers are filled or images are selected
				if(question.answersAreImages) {
					question.allAnswers.forEach(function(item){
						if(!item.imgId)	verified = false;
					});
				} else {
					question.allAnswers.forEach(function(item){
						if(!item.text)	verified = false;
					});	
				}
				
				// check if correct answers chosen	
				console.log(question);
				if(!$scope.verifyAnswer(question)){
					verified = false;	
				}					
			}
						
			return verified;
		};
		
		$scope.verifyAnswer = function (question){
			var answersChosen = false;
			if(question.type === "radio"){
				question.allAnswers.forEach(function(item){
					if(item.isDefault){
						answersChosen = true;	
					}	
				});	
			} else if(question.type === "checkbox"){
				question.allAnswers.forEach(function(item){
					if(item.isTrue){
						answersChosen = true;	
					}	
				});	
			}
					
			return answersChosen;
		};
		
		$scope.sendTestData = function (obj){
			$scope.saveObj = new SubmitAdmin({id: obj.id}); 
			
			$scope.saveObj.data = obj;
			
			SubmitAdmin.save($scope.saveObj, function() {

				alert("saved");
				//$scope.sendTestImg();
			});		
			//$scope.sendTestImg();
		};
		
}]);


angular.module('testerFrontApp')
	.controller('AdminStatsCtrl', ['$scope', '$routeParams', 'Statistics', function($scope, $routeParams, Statistics) {

		Statistics.get({ id: $routeParams.statsId}, function(data) {
			$scope.test = data;
			
			
		});	
		
		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};	
}]);