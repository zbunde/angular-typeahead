var app = angular.module('app', []);

app.directive('statetypeahead', function($timeout) {
  return {
    restrict: 'AEC',
    scope: {
		states: '=',
		prompt:'@',
		name: '@',
		abbreviation:'@',
		state: '=',
    selectedAbbreviation: '@',
	},

	link:function(scope,elem,attrs){
	   scope.handleSelection=function(selectedState){
      /// sets our current model to the selected states abreviation
		 scope.selectedAbbreviation=selectedState;
     /// sets selected to true so that the list becomes hidden.
		 scope.selected=true;
	  }
	},
    templateUrl: 'templates/statelist.html'
  }
});

app.controller('StatesController',function($scope, stateService){
	stateService.get('states.json').then(function(data){
    /// sets our scope.states to the return data
		$scope.states=data;
	});
	$scope.name="";
});

app.service('stateService', function($http) {
  return {
    get: function(url) {
      return $http.get(url).then(function(resp) {
        return resp.data;
      });
    }
  };


});
