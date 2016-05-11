var testerFrontServices = angular.module('testerFrontServices', ['ngResource']);
/*
testerFrontServices.factory('Test', ['$resource',
  function($resource){
    return $resource('tests/:testId.json', {}, {
      query: {method:'GET', params:{testId:'tests'}, isArray:true}
    });
 }]);
 */

 /*
testerFrontServices.factory("Test", function($resource) {
  return $resource("tests/:testId.json", {}, {
    query: { method: "GET",params:{testId:'tests'}, isArray: true }
  });
});
*/
testerFrontServices.factory("Test", function($resource) {
  return $resource("api/tests/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});

testerFrontServices.factory("TestAdmin", function($resource) {
  return $resource("api/tests_admin/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});


testerFrontServices.factory("Question", function($resource) {
  return $resource("api/questions/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});

testerFrontServices.factory("QuestionAdmin", function($resource) {
  return $resource("api/questions_admin/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});




