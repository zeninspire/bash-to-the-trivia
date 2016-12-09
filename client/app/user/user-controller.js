angular.module('app.user', ['app.services'])

.controller('HomeController', function($scope, $location, UserInfo, $rootScope) {

  //Passing data from the UserInfo factory
  $scope.user = UserInfo.user;
  $scope.rooms = UserInfo.rooms;
  $scope.currentRoom = UserInfo.currentRoom;
  $scope.activeUsers = [];
  $scope.newPlayer = {};

  $scope.goToRoom = function(roomName) {
    $scope.currentRoom = UserInfo.getRoom(roomName);
    console.log('currentRoom',  $scope.currentRoom)
  };

  $scope.addRoom = function(newRoomName) {
    UserInfo.addNewRoom(newRoomName);
    $scope.clear();
  };

  $scope.clear = function() {
    $scope.newRoomName = '';
  }

  $scope.addPlayer = function(newPlayerUsername) {
    console.log("newPlayerUsername", newPlayerUsername)
    var roomname = $scope.currentRoom.roomname;
    console.log("roomname", roomname)
    UserInfo.addNewPlayer(roomname, newPlayerUsername);
  };

  $scope.startGame = function() {
    UserInfo.startNewGame();
  };

  $scope.on = UserInfo.on;
  $scope.removeActiveUser = UserInfo.removeActiveUser
  $scope.invitedToNewRoom = UserInfo.invitedToNewRoom
  $scope.addActiveUser = UserInfo.addActiveUser


//SOCKET.IO EVENT LISTENNERS//
  $scope.on('PlayerAdded', function(room, newPlayerUsername) {
    console.log('before',$scope.currentRoom)
    //Making sure we are on the right user/socket before we update the view
    if ($scope.currentRoom.roomname === room.roomname) {
      $scope.currentRoom = UserInfo.currentRoom;
      console.log('AFTER',$scope.currentRoom)
    }
    if (newPlayerUsername === UserInfo.user.username) {
    console.log("TEST", newPlayerUsername, UserInfo.user.username)
      $scope.rooms[room.roomname] = UserInfo.addedToNewRoom(room);
    }

  });

  $scope.on('SendQuestions', function(questions) {
    console.log('questions', questions);
    $location.path('/home/game');


    $rootScope.questionSet = questions;
    $scope.startingGame();
  });

  $scope.on('newUserSignedUp', function(data) {
    console.log(data.username, ' got connected');
  });

  $scope.on('UserLeft', function(username) {
    console.log(username, ' has left the room');
    $scope.removeActiveUser(username);
  });

 $scope.on('UserJoined', function(username) {
    console.log(username, ' has joined the room');
    $scope.addActiveUser(username);
  });

  $scope.on('InvitetoNewRoom', function(roomInfo) {
    $scope.invitedToNewRoom(roomname);
  });
//////////////////////////////

/////GAME HAMDLING/////


  // $scope.gameState = {
  //   index: -1, //index that user has selected.
  //   isCorrect: "pending",//pending = no answer yet. "yes"/"no" self explanatory
  //   numCorrect: 0,
  //   questionsAttempted: 1, //total num of questions
  //   gameFinished: false
  // };

  $scope.startingGame = function() {
    $scope.gameState = _resetGameState();
//have to be nested, in order to get the questionSet first
    // UserInfo.getQuestions(function(){
    UserInfo.playGame(handleRoundEnd, handleGameEnd);
    // });

//function is called at the end of every round
    function handleRoundEnd(callback) {
      console.log('$scope.gameState.questionsAttempted: ', $scope.gameState.questionsAttempted);
      $scope.gameState.questionsAttempted++;
      $scope.gameState.isCorrect = "pending";
      $rootScope.questionSet.shift();
      callback();
    }

//function is called at the end of every game
    function handleGameEnd() {
      $scope.gameState.isCorrect = "pending";
    }

//resets the game state to the initial values. called at the start of every game
    function _resetGameState() {
      return {
        index: -1,
        isCorrect: 'pending',
        numCorrect: 0,
        questionsAttempted: 1,
        gameFinished: false
      };
    }
  };

//when user submits an answer, checks to see if it is the right answer.
  $scope.submitAnswer = function() {
    UserInfo.evaluateAnswer($scope.gameState.index, function(isCorrect) {
      if (isCorrect) {
        $scope.gameState.numCorrect++;
        $scope.gameState.isCorrect = 'yes';
      } else {
        $scope.gameState.isCorrect = 'no';
      }
    });

    if ($scope.gameState.questionsAttempted === 10) {
      $scope.gameState.gameFinished = true;
    }
    $scope.clear();
  };
// })

///////////////////////



});











