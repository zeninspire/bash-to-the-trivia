angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;
  $scope.users = {};
  $scope.newPlayer = {};


  $scope.goToRoom = function(roomName) {
    $scope.room = UserInfo.getRoom(roomName);
    $scope.users.usernames = UserInfo.currentRoom.users;
  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};
    UserInfo.addNewRoom(newRoomName);
  };

  $scope.addPlayer = function() {
    var roomname = UserInfo.currentRoom.roomname;
    var newPlayerUsername = $scope.newPlayer.username;
    UserInfo.addNewPlayer(roomname, newPlayerUsername);
  };

  $scope.startGame = function() {
    UserInfo.getQuestions().then(function() {

    });
  };


//SOCKET.IO EVENT LISTENNERS//
  UserInfo.on('PlayerAdded', function(roomname, newPlayerUsername) {
    if (newPlayerUsername === UserInfo.user) {
      UserInfo.addedToNewRoom(roomname, newPlayerUsername);
    }
  //TODO: promisify addedtoNewRoom and in the then statement update $scope.rooms to re-render

  });

  UserInfo.on('newUserSignedUp', function(data) {
    console.log(data.username, ' got connected');
  });

  UserInfo.on('UserLeft', function(username) {
    console.log(username, ' has left the room');
    UserInfo.removeActiveUser(username);
  });

  UserInfo.on('UserJoined', function(username) {
    console.log(username, ' has joined the room');
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