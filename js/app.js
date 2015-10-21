var app = angular.module("oduacm", ["firebase", "ngAnimate", "ui.bootstrap"]);

app.factory('Auth', function($firebaseAuth) {
  var endPoint = "https://oduacm.firebaseio.com/" ;
  var usersRef = new Firebase(endPoint);
  return $firebaseAuth(usersRef);
});

app.controller("MainController", function($scope, Auth, $firebaseArray){
  $scope.login = function(authMethod) {
    Auth.$authWithOAuthRedirect(authMethod, {scope:"email"}).then(function(authData) {
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
      var currEvent = events.$getRecord(id);
      var attendees = getAttendees(currEvent.attendeesStr);
      if(_.indexOf(attendees, $scope.authData.google.email) !== -1) {
        console.log("you've already joined");
      } else {
        attendees.push($scope.authData.google.email);
        delete currEvent.attendees;
        currEvent.attendeesStr = attendees.join();
        $scope.events.$save(currEvent).then(function(ref) {
          console.log("$scope.events is now " + $scope.events);
        });
        console.log("You have joined the event");
      }
    }

    $scope.leaveEvent = function(id){
        var currEvent = events.$getRecord(id);
        var attendees = getAttendees(currEvent.attendeesStr);
        var index = _.indexOf(attendees, $scope.authData.google.email);
        if(index !== -1) {
          attendees.splice(index, 1);
          currEvent.attendeesStr = attendees.join();
          delete currEvent.attendees;
          $scope.events.$save(currEvent).then(function(ref) {
            console.log("$scope.events is now " + $scope.events);
          });
          console.log("You have left the event");
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
