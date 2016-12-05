angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo, $rootScope) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;

  $scope.goToRoom = function(roomName) {
    UserInfo.getRoom(roomName);
    $rootScope.$emit('getRoom');
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

.controller('RoomController', function($scope, UserInfo, $rootScope) {
  $scope.users = ['Allen', 'Josh', 'Benji', 'Zak'];
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.room = UserInfo.currentRoom;
  $scope.avatar = UserInfo.avatar;

  $rootScope.$on('getRoom', function() {
    console.log('getRoom event listened');
    $scope.room = UserInfo.currentRoom;
  });


})

;