angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, $location, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;
  $scope.users = {};
  $scope.newPlayer = {};


  $scope.goToRoom = function(roomName) {
    UserInfo.getRoom(roomName);
    $scope.users.usernames = UserInfo.currentRoom.users;
  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};
    UserInfo.addNewRoom(newRoomName);
    $scope.newRoom.newRoomNameField.$setPristine();
    $scope.newRoom.newRoomNameField.$setPristine(true);
    $scope.newRoomName = '';

  };

  $scope.addPlayer = function(newPlayerUsername) {
    var roomname = UserInfo.currentRoom.roomname;
    // var newPlayerUsername = $scope.newPlayer.username;
    UserInfo.addNewPlayer(roomname, newPlayerUsername);
  };

  $scope.startGame = function() {
    UserInfo.startNewGame();

  };


//SOCKET.IO EVENT LISTENNERS//
  UserInfo.on('PlayerAdded', function(room, newPlayerUsername) {
    //Making sure we are on the right user/socket before we update the view
    if (newPlayerUsername === UserInfo.user) {
      var promise = new Promise(function(resolve, reject) {
        UserInfo.addedToNewRoom(room);
      });

      return promise.then(function() {
        $scope.rooms = UserInfo.rooms;
      });

    }
  });

  UserInfo.on('SendQuestions', function(questions) {
    console.log('questions', questions);
    $location.path('/home/game');
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

.controller('RoomController', function($scope, $stateParams, UserInfo) {

  $scope.RoomName = $stateParams.RoomName;
  $scope.users.usernames = UserInfo.currentRoom.usernames;


})

;










