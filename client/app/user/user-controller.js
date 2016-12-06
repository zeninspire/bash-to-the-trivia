angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;
  $scope.users = {};


  $scope.goToRoom = function(roomName) {
    $scope.room = UserInfo.getRoom(roomName);
    $scope.users.usernames = UserInfo.currentRoom.usernames;
  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};

    UserInfo.addNewRoom(newRoomName);/*.then(function() {
      return $scope.newRoom.setPristine();
    });*/
  };

  $scope.startGame = function() {
    UserInfo.getQuestions().then(function() {

    });
  };


//SOCKET.IO EVENT LISTENNERS//
  UserInfo.on('newUserSignedUp', function(data) {
    console.log(data.username, ' got connected');
  });

  UserInfo.on('UserLeft', function(username) {
    UserInfo.removeActiveUser(username);
  });

  UserInfo.on('UserJoined', function(username) {
    UserInfo.addActiveUser(username);
  });

  UserInfo.on('InvitetoNewRoom', function(roomInfo) {
    UserInfo.invitedToNewRoom(roomname);
  });
//////////////////////////////

})


.controller('ProfileController', function($scope, UserInfo, $rootScope) {

  $scope.activeUsers = [];
  $scope.questions = [];
  $scope.answers = [];

})


.controller('GameController', function($scope, UserInfo) {

  //Local scope variable
  $scope.activeUsers = [];
  $scope.questions = [];
  $scope.answers = [];




})

.controller('RoomController', function($scope, UserInfo) {

})

;