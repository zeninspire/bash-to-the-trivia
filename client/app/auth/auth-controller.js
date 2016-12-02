angular.module('app.auth', [])


.controller('AuthController', function($scope) {

  $scope.signInData=''
  $scope.signIn=function(){
    console.log('test ng-click')
    //TODO: SEND signin info to server to check if user exists; if so, check if passwords is correct.
  }


});