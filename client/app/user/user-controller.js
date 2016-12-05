angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;

  $scope.goToRoom = function(roomName) {
    UserInfo.getRoom(roomName);
  };

  $scope.addRoom = function(newRoomName) {
    // $scope.rooms[newRoomName] = {roomname: newRoomName, admin: $scope.user};

    UserInfo.addNewRoom(newRoomName);/*.then(function() {
      return $scope.newRoom.setPristine();
    });*/
  };


})


.controller('GameController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;

  //Local scope variable
  $scope.activeUsers = [];
  $scope.questions = [];
  $scope.answers = [];

})

.controller('RoomController', function($scope, UserInfo) {
  $scope.users = ['Allen', 'Josh', 'Benji', 'Zak'];
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.room = UserInfo.currentRoom;
  $scope.avatar = UserInfo.avatar;


})

;