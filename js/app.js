var app = angular.module("oduacm", ["firebase", "ngAnimate", "ui.bootstrap"]);

app.factory('Auth', function($firebaseAuth) {
  var endPoint = "https://oduacm.firebaseio.com/" ;
  var usersRef = new Firebase(endPoint);
  return $firebaseAuth(usersRef);
});

app.controller("MainController", function($scope, Auth, $firebaseArray){
  $scope.login = function(authMethod) {
    Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
        });
      } else {
        console.log(error);
      }
    });
  };

  Auth.$onAuth(function(authData) {
    if (authData === null) {
      console.log('Not logged in yet');
    } else {
      console.log('Logged in as', authData.uid);
    }
    // This will display the user's name in our view
    $scope.authData = authData;
  });

  $scope.logout = function() {
    Auth.$unauth();
  }

});

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

  $scope.events.$loaded().then(function(events) {

    $scope.joinEvent = function(id) {
      var currEvent = angular.copy(events.$getRecord(id));
      var attendees = getAttendees(currEvent.attendeesStr);
      if(_.indexOf(attendees, "jharr173@odu.edu") !== -1) {
        console.log("you've already joined");
      }
    }

    function getAttendees(commaAttendees){
      if(commaAttendees) {return commaAttendees.split(',');}
      else {return [];}
    }

    _.forEach(events, function(element) {
      events.$getRecord(element.$id).attendees = getAttendees(element.attendeesStr);
      events.$getRecord(element.$id).numAttending = element.attendees.length;
    });

  });
});
