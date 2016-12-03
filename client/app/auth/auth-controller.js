angular.module('app.auth', ['app.services'])


.controller('AuthController', function($scope, Authentication) {

  $scope.user = {};

  $scope.signIn = function() {
    Authentication.signIn($scope.user);
    //TODO: SEND signin info to server to check if user exists; if so, check if passwords is correct.
  };

  $scope.signUp = function() {
    Authentication.signUp($scope.user);
    //TODO: SEND signin info to server to check if user exists; if so, check if passwords is correct.
  };

});