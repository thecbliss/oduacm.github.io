var app = angular.module("oduacm", ["firebase", "ui.bootstrap"]);

app.controller("EventsController", function($scope, $firebaseArray) {

  var ref = new Firebase("https://oduacm.firebaseio.com/events");

  $scope.events = $firebaseArray(ref);

  $scope.events.$loaded().then(function(events){

    _.forEach(events, function(element) {
      console.log(element);
    });
  
  });

});
