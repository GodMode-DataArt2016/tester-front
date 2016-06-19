var testerFrontServices = angular.module('testerFrontServices', ['ngResource']);




function appendTransform(defaults, transform) {

  // We can't guarantee that the default transformation is an array
  defaults = angular.isArray(defaults) ? defaults : [defaults];

  // Append the new transformation to the defaults
  return defaults.concat(transform);
}

function addServerPrefix(oneTest, apiUrl){
		
	if(oneTest && oneTest.questions){
		oneTest.questions.map(function(item){
			if(item.imageIncluded && item.imgUrl){
				item.imgUrl = apiUrl + item.imgUrl;	
			}
			if(item.answersAreImages && item.allAnswers.length){
				item.allAnswers.forEach(function(answer){
					if(answer.imgUrl){
						answer.imgUrl = apiUrl + answer.imgUrl;	
					}							
				});	
			}	
			return item;	
		});	
	}
	
	return oneTest;	
};


testerFrontServices.factory("TestList", ['$resource', 'app_config', function($resource, app_config) {
	return $resource(app_config.apiUrl + "api/test/:id", {}, {
		query: {		
			method: "GET",
			isArray: true
		}
	});
}]);

testerFrontServices.factory('Test',['$http', 'app_config', function($http, app_config){
    return {
        query: function(id) {
            return $http({
					method: 'GET',
					url: app_config.apiUrl + "api/test/" + id,
					transformResponse: appendTransform($http.defaults.transformResponse, function(data) {
						return addServerPrefix(data, app_config.apiUrl);	
					})
			})
        }
    };
}]);

testerFrontServices.factory("TestListAdmin", ['$resource', 'app_config', function($resource, app_config) {
  return $resource(app_config.apiUrl + "api/admin/test", {}, {
    query: { method: "GET", isArray: true },
	delete: {method:'DELETE'}
  });
}]);

testerFrontServices.factory("TestAdmin", ['$http', 'app_config', function($http, app_config) {
	return {
        query: function(id) {
            return $http({
				method: 'GET',
				url: app_config.apiUrl + "api/admin/test/" + id,
				transformResponse: appendTransform($http.defaults.transformResponse, function(data) {
					return addServerPrefix(data, app_config.apiUrl);	
				})
			})
        }
    };
}]);

testerFrontServices.factory("Statistics", ['$resource', 'app_config', function($resource, app_config) {
  return $resource(app_config.apiUrl + "api/admin/statistics/:id", {}, {
    query: { method: "GET", isArray: false }
  });
}]);
/*
testerFrontServices.factory("StatExport", ['$resource', 'app_config', function($resource, app_config) {
  return $resource(app_config.apiUrl + "api/admin/export/:id", {}, {
    query: { method: "GET", isArray: false }
  });
}]);
*/

testerFrontServices.factory('StatExport',['$http', 'app_config', function($http, app_config){
    return {
        query: function(id) {
            return $http({
					method: 'GET',
					url: app_config.apiUrl + "api/admin/export/" + id,
					transformResponse: appendTransform($http.defaults.transformResponse, function(data) {
						if(data && data.reportLink){
							data.reportLink = app_config.apiUrl + data.reportLink;
						}						
						return data;	
					})
			})
        }
    };
}]);


testerFrontServices.factory("SubmitUser", ['$resource', 'app_config', function($resource, app_config) {
	return $resource(app_config.apiUrl + "api/test/:id");
}]);

testerFrontServices.factory("SubmitAdmin", ['$resource', 'app_config', function($resource, app_config) {
	return $resource(app_config.apiUrl + "api/admin/test/:id", {id: '@id'});
}]);

testerFrontServices.factory("SubmitImage", ['$resource', 'app_config', function($resource, app_config) {
	return $resource(app_config.apiUrl + "api/saveimage",{},{
		create: {
            method: "POST",
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }			
	});
}]);
/*
testerFrontServices.factory("UserReg", ['$resource', 'app_config', function($resource, app_config) {
  return $resource(app_config.apiUrl + "api/oauth/token", {}, {
    query: { method: "GET", isArray: true }
  });
}]);
*/
testerFrontServices.factory('UserReg',['$http', 'app_config', function($http, app_config){
    return {
        send: function(data) {
            return $http({
					method: 'POST',
					url: app_config.apiUrl + "api/register",
					data: data
			})
        }
    };
}]);




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


testerFrontServices.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});