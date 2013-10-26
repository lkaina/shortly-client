var app = angular.module('Shortly', []);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider.when('/', {
    controller: 'HomeController',
    templateUrl: 'client/views/index.html'
  })
  .when('/create', {
    controller: 'CreateController',
    templateUrl: 'client/views/create.html'
  })
  .otherwise({redirectTo: '/'});

  $locationProvider.html5Mode(true);
}]);

app.controller('HomeController', function($scope, $http){
  $http.get('/links')
  .success(function(data, status){
    $scope.links = data;
  })
  .error(function(){
    console.log('error retrieving links');
  });
});

app.controller('CreateController', function($scope, $http){
  $scope.shortenLink = function(url){
    $http.post('/links', {url:url})
    .success(function(){
      console.log('successfully passed url');
    })
    .error(function(){
      console.log('error on post');
    });
  };
});
