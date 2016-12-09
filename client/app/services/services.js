// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])
.factory('UserInfo', function($http, $rootScope, $location, $timeout) {
  var socket = io.connect();

  return {
    user: {},
    rooms: {},
    avatar: 'http://www.how-to-draw-funny-cartoons.com/images/draw-a-goose-001.jpg',
    currentRoom: {},
    activeUsers: [],

    addNewRoom: function (newRoomName) {
      console.log('newRoomName', newRoomName)
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addRoom',
        data: {roomname: newRoomName, currentUser: context.user.username}
      }).then(function successCallback(resp) {
        context.rooms[newRoomName] = {
          roomname: newRoomName,
          users: [context.user.username],
          admin: context.user.username
        };
        context.currentRoom = context.rooms[newRoomName];
        console.log('AddNewRoom: ', context.currentRoom);
        $location.path('/home/room/' + newRoomName);
        socket.emit('addNewRoom', newRoomName);
      }, function errorCallback(err) {
          throw err;
      });
    },

    addNewPlayer: function(roomname, newPlayerUsername) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addNewPlayer',
        data: {roomname: roomname, newPlayerUsername: newPlayerUsername}
      }).then(function successCallback(resp) {
        context.rooms[roomname].users.push(newPlayerUsername);
        context.currentRoom = context.rooms[roomname];
        console.log('addNewPlayer SUCCESS', context.currentRoom)
        socket.emit('addNewPlayer', context.currentRoom, newPlayerUsername);
      }, function errorCallback(err) {
          throw err;
      });
    },

    startNewGame: function() {
      return $http({
        method: 'GET',
        url: 'api/questions'
      }).then(function successCallback(resp) {

        for(var i = 0; i < resp.data.length; i++) {
          resp.data[i].incorrect_answers.splice(Math.floor(Math.random() * 4), 0, resp.data[i].correct_answer)
          resp.data[i].answerChoices = resp.data[i].incorrect_answers;
        }
        $rootScope.questionSet = resp.data;
        socket.emit('startNewGame', resp.data);
      }, function errorCallback(err) {
          throw err;
      });
    },

    addedToNewRoom: function(room) {
      alert('You have been added to' + room.roomname);
      return this.rooms[room.roomname] = room;
      //TODO: update rooms object to add the new roomname, admin and users
    },
    removeActiveUser: function(username) {
      var index = this.activeUsers.indexOf(username);
      this.activeUsers.splice(index, 1);
    },
    addActiveUser: function(username) {
      if (username !== this.user) {
        this.activeUsers.push(username);
      } else {
        //TODO: Emit server request to REDIS DB to get the database of all the active users in the currentroom
      }
    },
    invitedToNewRoom: function(roomInfo) {
      this.rooms[roomInfo.roomname] = roomInfo;
    },

    getRoom: function(room) {
      socket.emit('changeRoom', room);
      this.currentRoom = this.rooms[room.roomname];
      return this.currentRoom;
    },

//RE-IMPLEMENTING SOCKETS.IO METHODS TO USE THEM IN THE CONTROLLERS DUE TO SCOPE ISSUES//
    on: function(eventName, callback) {
      if(!socket.hasListeners(eventName)) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      }
    },
    emit: function(eventName, callback) {
      socket.emit(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
/////////////////////////////////////////////////////////////////////


    signUp: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signup',
        data: user
      }).then(function(resp) {
        console.log("signUp response", resp.data);
        if (!resp.data) {
          $location.path('/signin');
        } else {
          context.user.username = resp.data.user.username;
          context.rooms = resp.data.rooms;
          socket.emit('signUp', {username: resp.data.user.username});
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        console.log('signup error: ', err);
      });
    },

    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signin',
        data: user
      }).then(function(resp) {
        console.log("signIn response", resp.data);
        if (!resp.data) {
          $location.path('/signup');
        } else {
          context.user.username = resp.data.user.username;
          context.rooms = resp.data.rooms;
          socket.emit('signIn', {username: resp.data.user.username});
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        $location.path('/signin');
        console.log('unauthorized', err);
      });
    },

  };
});








