angular.module('app.auth', ['app.services'])


.controller('AuthController', function($scope, UserInfo) {

  $scope.user = {};

  $scope.signIn = function() {
    UserInfo.signIn($scope.user);
    //TODO: SEND signin info to server to check if user exists; if so, check if passwords is correct.
  };

  $scope.signUp = function() {
    UserInfo.signUp($scope.user);
    //TODO: SEND signin info to server to check if user exists; if so, check if passwords is correct.
  };

});