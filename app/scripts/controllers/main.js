'use strict';

/**
 * @ngdoc function
 * @name testerFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testerFrontApp
 */
  
  
  
angular.module('testerFrontApp')
	.controller('MainCtrl', ['$scope', 'TestList', function($scope, TestList) {
		$scope.currentPage = 0;
		$scope.pageSize = 15;	
		$scope.numberOfPages = 1;
		
		$scope.tests = TestList.query(function(data){
				if(data){
					$scope.numberOfPages = Math.ceil(data.length/$scope.pageSize) || 1;	
				}      
			},
			function(err){
				
		});
		
		
		
}]);

angular.module('testerFrontApp')
	.controller('AdminCtrl', ['$scope', 'TestListAdmin', 'OAuth', function($scope, TestListAdmin, OAuth) {
		$scope.currentPage = 0;
		$scope.pageSize = 15;	
		$scope.numberOfPages = 1;
		
		$scope.tests = TestListAdmin.query(function(data){
			if(data){
				$scope.numberOfPages = Math.ceil(data.length/$scope.pageSize) || 1;	
			}      
		},
		function(err){
			
		});
}]);

angular.module('testerFrontApp')
	.controller('TestCtrl', ['$scope', '$routeParams', 'Test', 'SubmitUser', function($scope, $routeParams, Test, SubmitUser) {
		/* // userForm moved to register
		$scope.userForm = {
			unconfirmed: false	
		};*/
		
		$scope.test = {
			questions:[]
		}
		$scope.submited = false;
		$scope.submitText = '';
		
		Test.query($routeParams.testId).success(function(data) {									
			$scope.test = data;
			$scope.test.startDate = new Date(data.startDate);
			$scope.test.endDate = new Date(data.endDate);					
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
			
			/* // userForm moved to register
			var userForm = $scope.userForm;		
			// check if user form data is filled
			if(!(userForm.name && userForm.surname && userForm.phone && userForm.email)){
				verified = false;
				status+= "Fill in user data. ";
				$scope.userForm.unconfirmed = true;
			} else {
				$scope.userForm.unconfirmed = false;	
			}*/
			
			// check if all questions are correct
			var questionsVeryfy = true;
			$scope.test.questions.forEach(function(item){	
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
				
				SubmitUser.save($scope.saveObj, function(data) {
						$scope.submited = true;
						$scope.submitText = "success";
						//alert('success');
					}, function(error) {
						if(error && error.data && error.data.error){
							$scope.submitText = error.data.error;
							//alert(error.data.error);	
						} else {
							alert("problem occurred");	
						}
				});	
			} else {
				$scope.submitText = status;
				//alert(status);		
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
			
			// userForm moved to register
			//submitObject.userForm = $scope.transformUserform($scope.userForm);
			submitObject.id = $scope.test.id;
			submitObject.testName = $scope.test.testName;

			
			submitObject.questions = [];

			$scope.test.questions.forEach(function(item){	
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
				type: question.type
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
	.controller('AdminTestCtrl', ['$scope', '$routeParams', 'TestAdmin', 'SubmitAdmin', 'SubmitImage', '$window', function($scope, $routeParams, TestAdmin, SubmitAdmin, SubmitImage, $window) {

		$scope.test = {
			unconfirmed: false,
			isPublic: true,
			startDate:  '',
			endDate: '',
			questions:[]
		};
		$scope.testNotNew = false; // if true - show delete button
		$scope.privateLink = "";
		$scope.submited = false;
		$scope.submitText = '';
		
		if($routeParams.testId !== 'createnew'){		
			TestAdmin.query($routeParams.testId).success(function(data) {									
				$scope.testNotNew = true;
				
				$scope.test = data;
				$scope.test.startDate = new Date(data.startDate);
				$scope.test.endDate = new Date(data.endDate);
				
				$scope.privateLink = '/test/' + data.id;					
			});
		}

			
				
		$scope.addQuestion = function(){
			var newQuestion = {				
				type: "radio",	
				textDescription: "",
				answersAreImages: false,
				imageIncluded: false,
				picture: "",
				imgId: "",
				allAnswers: [],
				unconfirmed: false
			};
			$scope.test.questions.push(newQuestion);	
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
					question.imgUrl = URL.createObjectURL(event.target.files[0]);
				});
				$scope.postImg2(question, input);
			}
		};
		
		$scope.answerImgChanged = function(answer, input){
			if (input.files && input.files[0]) {
				$scope.$apply(function () {			
					answer.imgUrl = URL.createObjectURL(event.target.files[0]);	
				});
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
			var status = "";
			
			var submitObject = {};
			
			submitObject.id = $scope.test.id;
			submitObject.testName = $scope.test.testName;
			submitObject.startDate = $scope.test.startDate;
			submitObject.endDate = $scope.test.endDate;
			submitObject.isPublic = $scope.test.isPublic;
			submitObject.questions = [];
			
			if(!(submitObject.testName)){
				verified = false;
				$scope.test.unconfirmed = true;
				status+= 'Add test name. ';
			} else {
				$scope.test.unconfirmed = false;	
			}
			
			if(!$scope.test.questions.length){
				verified = false;	
				status+= 'Add at least one question. ';
			}
			
			if(!$scope.verifyTime(submitObject.startDate, submitObject.endDate)){
				verified = false;
				status+= 'Check start/end time. ';
			}
			
			// check if all questions are correct
			var questionsVeryfy = true;
			$scope.test.questions.forEach(function(item){	
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
				status+= 'Questions are incorect. ';
			}
			
			// final verification check
			if(verified){
				status = "Success";
				$scope.sendTestData(submitObject);
				//alert("success");	
			} else {
				$scope.submitText = status;
				//alert(status);		
			}
			
			return verified;
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
						if(!item.imgId){
							verified = false;
						}
					});
				} else {
					question.allAnswers.forEach(function(item){
						if(!item.text)	verified = false;
					});	
				}
				
				// check if correct answers chosen	
				if(!$scope.verifyAnswer(question)){
					verified = false;	
				}					
			}
						
			return verified;
		};
		
		$scope.verifyTime = function(startDate, endDate){
				
			if(endDate >= startDate && endDate && startDate){
				return true;	
			} else {
				return false;	
			}
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
			
			SubmitAdmin.save($scope.saveObj, function(data) {
				$scope.submitText = 'success';
				$scope.submited = true;
				//alert('success');
			}, function(error) {
				if(error && error.data && error.data.error){
					$scope.submitText = error.data.error;
					//alert(error.data.error);	
				} else {
					alert("problem occurred");	
				}
			});		
		};
		
		$scope.deleteTest = function(){
			//$window.alert('greeting');
			
			if ($window.confirm('Are you sure you want to delete this test?')) {
				var deleteId = $routeParams.testId;
				SubmitAdmin.delete({ id: deleteId},
				function(success) {
					$window.location.href = '/'; //redirect to home
					alert('Success: ');
					}, function(reason) {
					alert('Failed: ' + reason);
				});
			} else {
				// Do nothing!			
			}
		}
		
}]);


angular.module('testerFrontApp')
	.controller('AdminStatsCtrl', ['$scope', '$routeParams', 'Statistics', 'StatExport', function($scope, $routeParams, Statistics, StatExport) {
		
		
		Statistics.query({ id: $routeParams.statsId}, function(data) {
			$scope.test = data;	
		});
		/*
		Statistics.get({ id: $routeParams.statsId}, function(data) {
			$scope.test = data;
			
			
		});	*/
		
		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};	
		
		$scope.getExcel = function() {
			StatExport.query({ id: $routeParams.statsId}, function(data) {
					
			});
		};
		
}]);

angular.module('testerFrontApp')
	.controller('LoginCtrl', ['$scope', 'OAuth', 'UserReg', '$window', '$location', '$cookies', function($scope, OAuth, UserReg, $window, $location, $cookies) {
		
		$scope.isAuthenticated = OAuth.isAuthenticated();
		
		var error_reason='';
		$scope.errorText='';
		$scope.nameRegexp = '([^0-9]*)';	
		$scope.numberRegexp = '([0-9()-]*)';	
			
		
		
		
		
		var locData = $location.search();
		if(locData){
			if(typeof(locData.error_reason) === 'string'){
				error_reason = locData.error_reason;	
			}			
		}
		
		if(error_reason){
			switch (error_reason){
				case "Unauthorized":
					$scope.errorText = 'You should log in';
				break;
				case "Not admin user":
					$scope.errorText = 'You should log in as admin to use admin features';
				break;
				default:
					$scope.errorText = '';
				break;
			}	
		}
		
		$scope.loginData ={
			name: "",
			pass: "",
			passConfirm: ""
		};
		
		$scope.switchToLogin = function(){
			$scope.register = false;	
		}
		
		$scope.switchToRegister = function(){
			$scope.register = true;	
		}
		
		$scope.logIn = function(){			
			var loginUser = {
				'username': $scope.loginData.name,
				'password':$scope.loginData.pass
			};
				
			OAuth.getAccessToken(loginUser).then(function(data){
				$scope.isAuthenticated = OAuth.isAuthenticated();
				if($scope.isAuthenticated){
					var url = "/login";
					if(data && data.data && data.data.userData){
						url = data.data.userData.userRole || "user";
					} else {
						url = "user";	
					}
					
					$location.url('/' + url);	
				}
			});	
		}
		
		$scope.sendRegData = function(){		
			if($scope.loginData.pass === $scope.loginData.passConfirm){
				var newUser = {
					'username': $scope.loginData.name,
					'password':$scope.loginData.pass,
					'firstName': $scope.loginData.firstName,
					'lastName': $scope.loginData.lastName,
					'phone':  $scope.loginData.phone,
					'email':  $scope.loginData.email,
				};
				
				UserReg.send(newUser).then(
					function successCallback(response) {
						$window.alert('User created successfully');
					}, 
					function errorCallback(response) {
						if(response && response.data){
							$window.alert(response.data.error);
						}
				});
				
			} else {
				$window.alert('The entered passwords do not match');	
			}	
		}
		
		$scope.logout = function(){
			$cookies.remove('token');
			$scope.isAuthenticated = OAuth.isAuthenticated();
		}
}]);