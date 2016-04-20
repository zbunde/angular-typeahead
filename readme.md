### Building an Angular Directive
- We are going to build a custom type ahead angular directive that we can hook up to a factory for retrieving data to compare against.
- This is useful anytime you want to interact with your databases and have auto completion based on that data.
- We could use this to search against a users endpoint to auto complete a search for users.
- For this example we are using an arbitrary set of data from a states.json file.
```
{
    "name": "Alabama",
    "abbreviation": "AL"
}
```
- Since we are making a http request to a local file we need to run a server.
- Use python -m SimpleHTTPServer 8000 within this directory to start a server that will serve our files.
- When a user begins typing we want to filter all of the states by what they type. When they select a state we want to set the value in the text input to the selected state's abbreviation.


### Setup
```
js
    app.js
templates
    statelist.html
index.html
states.json
```
#### Service:

```
app.service('stateService', function($http) {
  return {
    get: function(url) {
      return $http.get(url).then(function(resp) {
        return resp.data;
      });
    }
  };
});
```


### Views

- In our index.html file we need to include angular and app.js. We need to connect our controller to our view here as well.
- We need a statelist.html template that we will use as the dropdown menu when we begin typing.
- We need an input box, that is connected to our model 'state'.
```
<html ng-app="app">
<head>
<script src="http://code.angularjs.org/1.2.9/angular.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/app.js"></script>
</head>
<body>
   <div  ng-controller="StatesController">
	<statetypeahead items="items" prompt="Start typing a US state" name="name" abbreviation="abbreviation" model="model" on-select="onItemSelected()" />
   </div>
</body>
</html>

```
- when a user selects the correct state, we want to put the abbreviation into the text box.
- the name and abbreviation fields will relate to the returned states and display them.
- this is also the dropdown menu that will contain all of our states and allow the user to select the correct one.
- we need to handle selecting a state by firing a function to fill in the box.
- we will then filter item in items by the model, as we type our results will shrink.
- we need an ng click that will fill in our search bar with the abbreviation for the state.

```
<input type="text" ng-model="model" placeholder="{{prompt}}" ng-keydown="selected=false"/><br/>
<div ng-hide="!model.length || selected">
	<div ng-repeat="item in items | filter:model  track by $index" ng-click="handleSelection(item[abbreviation])" style="cursor:pointer" >
		<p>{{state[name]}}</p>
	</div>
</div>


```
- hide it if there is no model or we aren't selecting something.
- loop through our items displaying both the name and abbreviation.

#### Controller:
- within our controller we make a get request to our states.json file, and then set our scope.items to that return.
- use our factory we built to retrieve the states from our json file.
- set our $scope.states to the return of that request.

```
app.controller('StatesController',function($scope, stateService){
	stateService.get('states.json').then(function(data){
		$scope.states=data;
	});
	$scope.name="";
});
```


#### Directive:
- we need a link function that will contain our code.
- within this we need to
    - Handle Selection.
    - Set the correct model.
    - Set selected to true.(so that we hide the dropwdown list)


```
app.directive('typeahead', function($timeout) {
  return {
    restrict: 'AEC',
    scope: {
		items: '=',
		prompt:'@',
		name: '@',
		abbreviation:'@',
		model: '='
    	},
	link:function(scope,elem,attrs){
	     scope.handleSelection=function(selectedItem){
		 scope.model=selectedItem;
	  }
	  scope.selected=true;
	},
    templateUrl: 'templates/statelist.html'
  }
});
```
