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
  return $resource("api/admin/tests/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});


testerFrontServices.factory("Question", function($resource) {
  return $resource("api/questions/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});

testerFrontServices.factory("QuestionAdmin", function($resource) {
  return $resource("api/admin/questions/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});

testerFrontServices.factory("Statistics", function($resource) {
  return $resource("api/admin/statistics/:id.json", {}, {
    query: { method: "GET", isArray: true }
  });
});

testerFrontServices.factory("SubmitUser", function($resource) {
	return $resource("http://somebackendaddress/api/tests/:id.json");
});

testerFrontServices.factory("SubmitAdmin", function($resource) {
	return $resource("http://somebackendaddress/api/admin/test/:id.json", {id: '@id'});
});

/*
testerFrontServices.factory("SubmitImage", function($resource) {
	return $resource("http://localhost:4500/api/saveimage");
});*/

testerFrontServices.factory("SubmitImage", function($resource) {
	return $resource("http://localhost:4500/api/saveimage",{},{
		create: {
            method: "POST",
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }			
	});
});

testerFrontServices.directive('customOnChange', function() {
  return {
		restrict: "EA",
		scope: {
			data: '=',
			changefunc: "&"
		},
		replace: true,		
		link: function (scope, element, attrs) {
			element.bind('change', function(changeEvent) {	
				scope.changefunc()(scope.data,element[0]);	
			});
		},
		template: [
			  "<input type='file' id='file-select' name='image'/>"
		].join("")
  };
});


testerFrontServices.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});