angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, UserInfo) {
  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.avatar = UserInfo.avatar;

  $scope.goToRoom = function(roomName) {
    UserInfo.getRoom(roomName);
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

})

;