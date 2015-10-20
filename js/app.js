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

    function getAttendees(commaAttendees){
      if(commaAttendees) {return commaAttendees.split(',');}
      else {return [];}
    }
    _.forEach(events, function(element) {
      //console.log(events.$getRecord(element.$id));
      events.$getRecord(element.$id).attendees = getAttendees(element.attendeesStr);
      events.$getRecord(element.$id).numAttending = element.attendees.length;
    });

  });

});
