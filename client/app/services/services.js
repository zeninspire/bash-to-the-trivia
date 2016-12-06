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
<<<<<<< e96a66ecf4ba5059bf7907e80c79ec3cfd601eb5
        if (resp.data === 'user exists') {
          return resp.data;
        } else {
          console.log('getting into the expected if loop');
          context.user = resp.data.username;
          socket.emit('signUp', {username: resp.data.username});
=======
        if(!resp.data) {
          $location.path('/signin');
        } else {
          context.user = resp.data.username;
>>>>>>> refactored users login
          $location.path('/home/profile');
        } 
      }).catch(function(err) {
<<<<<<< e96a66ecf4ba5059bf7907e80c79ec3cfd601eb5
        console.log('RESP CATCH', err);
      });
=======
        console.log("signup error: ", err)
      })
>>>>>>> refactored users login
    },

    userProfile: function(user) {
      var context =  this;
    },

    userProfile: function(user) {
      var context =  this;
    }

    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signin',
        data: user
      }).then(function(resp) {
<<<<<<< e96a66ecf4ba5059bf7907e80c79ec3cfd601eb5

        if(resp.data === "newUser") {
            console.log("NEWUSER", resp.data)
           $location.path('/signup');
        } else if(resp.data === "false") {
          console.log("FALSE", resp.data)
          return resp.data;
=======
        console.log("resp", resp)
        if(!resp.data.username) {
          $location.path('/signup');
>>>>>>> refactored users login
        } else {
          context.user = resp.data.username;
          $location.path('/home/profile');  
        }
      }).catch(function(err) {
        $location.path('/signin');
        console.log('unauthorized', err)
      })
    },
<<<<<<< e96a66ecf4ba5059bf7907e80c79ec3cfd601eb5
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
    }
=======
>>>>>>> refactored users login

    addNewRoom: function (newRoomName) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/users/addRoom',
        data: {roomname: newRoomName, user: this.user}
      }).then(function(resp) {
        console.log("RESP", resp)
        // this.rooms[newRoomName] = {roomname: newRoomName, admin: this.user};
        // this.currentRoom = this.rooms[newRoomName];
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







