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
    abstract: true, //TODO
    templateUrl: 'app/user/home.html',
    controller: 'UserController'
  })
  .state('homeState.profile', {
    url: '/profile',
    templateUrl: 'app/user/home.profile.html', //#1 view
    controller: 'UserController'
  })
  .state('homeState.room', {
    url: '/room',
    templateUrl: 'app/user/home.room.html',
    controller: 'UserController'
  })
  .state('homeState.game', {
    url: '/game',
    templateUrl: 'app/user/home.game.html',
    controller: 'UserController'
  })
  .state('otherwise', {
    url: '*path',
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  });
});