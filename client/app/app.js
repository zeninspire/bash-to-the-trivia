angular.module('app', ['app.auth', 'app.user', 'ui.router'])


.config(function($stateProvider) {
  $stateProvider
  .state('signinState', {
    url: '/',
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  })
  .state('signupState', {
    url: '/signup',
    templateUrl: 'app/auth/signup.html',
    controller: 'AuthController'
  })
  .state('homeState', {
    url: '/home',
    templateUrl: 'app/user/home.html',
    controller: 'HomeController'
  })
  .state('otherwise', {
    url: '*path',
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  });
});