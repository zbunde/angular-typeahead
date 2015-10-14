var app = angular.module('app', []);

app.directive('statetypeahead', function($timeout) {
  return {
    restrict: 'AEC',
    scope: {
		items: '=',
		prompt:'@',
		name: '@',
		abbreviation:'@',
		state: '=',
	},

	link:function(scope,elem,attrs){
	   scope.handleSelection=function(selectedItem){
		 scope.model=selectedItem;
		 scope.selected=true;
	  }
	},
    templateUrl: 'templates/statelist.html'
  }
});

app.controller('StatesController',function($scope, stateFactory){
	stateFactory.get('states.json').then(function(data){
		$scope.items=data;
	});
	$scope.name="";
});

app.factory('stateFactory', function($http) {
  return {
    get: function(url) {
      return $http.get(url).then(function(resp) {
        return resp.data;
      });
    }
  };
});
