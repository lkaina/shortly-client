var app = angular.module('Shortly', ['ui.bootstrap']);

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

app.filter('moment', function() {
  return function(dateString) {
    return moment(dateString).fromNow();
  };
});

app.filter('momentDate', function() {
  return function(dateString) {
    return moment(dateString).calendar();
  };
});

app.controller('HomeController', function($scope, $http, $modal, $log){
  $http.get('/links')
  .success(function(data, status){
    $scope.links = data;
  })
  .error(function(){
    console.log('error retrieving links');
  });
  $scope.modal = function(link){
    $http.get('/'+link.code+'/stats')
    .success(function(data, status){
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceController',
        resolve: {
          data: function(){
            return [data, link];
          }
        }
      });
    })
    .error(function(){
      console.log('error on modal post');
    });
  };
});

app.controller('ModalInstanceController', function($scope, $modalInstance, data){
  $scope.clicks = data[0];
  $scope.link = data[1];
  $scope.clickCount = $scope.clicks.length;
  $scope.ok = function() {
    $modalInstance.dismiss('cancel');
  };
});

app.controller('CreateController', function($scope, $http){
  $scope.shortenLink = function(url){
    $scope.url = '';
    $http.post('/links', {url:url})
    .success(function(){
      console.log('successfully passed url');
    })
    .error(function(){
      console.log('error on post');
    });
  };
});

  // .when('/:code/stats', {
  //   controller: 'StatsController',
  //   templateUrl: 'client/views/stats.html'
  // })
