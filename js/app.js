var app = angular.module("oduacm", ["firebase", "ui.bootstrap"]);

app.controller("CarouselController", function($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [];
  slides.push({
    image: 'public/img/jumbotron.jpg',
    text: 'ODU ACM'
  });
  slides.push({
    image: 'public/img/jumbotron.jpg',
    text: 'ODU ACM Slide 2'
  });
});


app.controller("EventsController", function($scope, $firebaseArray) {

  var ref = new Firebase("https://oduacm.firebaseio.com/events");

  $scope.events = $firebaseArray(ref);

  $scope.events.$loaded().then(function(events){

    _.forEach(events, function(element) {
      console.log(element);
    });

  });

});
