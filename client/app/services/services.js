// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])



.factory('UserInfo', function($http, $rootScope, $location) {
  var socket = io.connect();
  return {
    user: '',
    rooms: {
      'room1': {
        roomname: 'room1',
        usernames: ['A', 'B', 'C', 'Tonny'],
        admin: 'Tonny'
      },
      'room2': {
        roomname: 'room2',
        usernames: ['D', 'E', 'F', 'Tonny'],
        admin: 'Tonny'
      },
      'room3': {
        roomname: 'room3',
        usernames: ['G', 'H', 'I', 'Tonny'],
        admin: 'Tonny'
      }
    },
    avatar: 'http://www.how-to-draw-funny-cartoons.com/images/draw-a-goose-001.jpg',
    currentRoom: {},
    getRoom: function(room) {
      return this.currentRoom = this.rooms[room.roomname];
    },

    
    signUp: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signup',
        data: user
      }).then(function(resp) {
        if(!resp.data) {
          $location.path('/signin');
        } else {
          context.user = resp.data.username;
          socket.emit('signUp', {username: resp.data.username});
          $location.path('/home/profile');
        } 
      }).catch(function(err) {

        console.log("signup error: ", err)
      })
    },


    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signin',
        data: user
      }).then(function(resp) {
        console.log("resp", resp)
        if(!resp.data.username) {
          $location.path('/signup');
        } else {
          context.user = resp.data.username;
          $location.path('/home/profile');  
        }
      }).catch(function(err) {
        $location.path('/signin');
        console.log('unauthorized', err)
      })
    },


    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
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


    addNewRoom: function (newRoomName) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addRoom',
        data: {roomname: newRoomName, currentUser: this.user}
      }).then(function(resp) {
        console.log("RESP", resp.data)
        context.rooms[newRoomName] = {
          roomname: newRoomName, 
          admin: context.user
        };
        context.currentRoom = context.rooms[newRoomName];
      });
    //move this code into the promise from the $http
    }
  };
});




//     getRoom: function(room) {
//       this.currentRoom = this.rooms[room.roomname];
//       console.log(this.currentRoom);
//       $rootScope.$emit('getRoom');

//       //send server request for users avatars
//       // return $http({
//       //   method: 'GET',
//       //   url: 'FILL_ME_IN',
//       //   params: {room: room.roomname}
//       // }).then(function(resp) {
//       //   console.log(resp);
//       // });
//     },







