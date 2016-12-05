// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])



.factory('UserInfo', function($http, $rootScope, $location) {

  return {
    user: 'OVERWRITTEN',
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

    addNewRoom: function(newRoomName) {
        // return $http({
        //   method: 'POST',
        //   url: 'FILL_ME_IN',
        //   data: newRoomName
        // }).then(function(resp) {
        //   console.log(resp);
        // });

        //move this code into the promise from the $http
      this.rooms[newRoomName] = {roomname: newRoomName, admin: this.user};
      this.currentRoom = this.rooms[newRoomName];
    },

    getRoom: function(room) {
      this.currentRoom = this.rooms[room.roomname];
      console.log(this.currentRoom);
      $rootScope.$emit('getRoom');

      //send server request for users avatars
      // return $http({
      //   method: 'GET',
      //   url: 'FILL_ME_IN',
      //   params: {room: room.roomname}
      // }).then(function(resp) {
      //   console.log(resp);
      // });
    },
    signUp: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signup',
        data: user
      }).then(function(resp) {
        if(resp.data === "user exists") {
          return resp.data;
        } else {
          context.user = resp.data.username;
          $location.path('/home/profile');
        }
      }).catch(function(err) {
        console.log("RESP CATCH", err)
      })
    },
    signIn: function(user) {
      var context = this;
      return $http({
        method: 'POST',
        url: 'api/signin',
        data: user
      }).then(function(resp) {
        if(resp.data === "newUser") {
            console.log("NEWUSER", resp.data)
           $location.path('/signup');
        } else if(resp.data === "false") {
          console.log("FALSE", resp.data)
          return resp.data;
        } else {
          console.log("TRUE", resp.data)
          context.user = resp.data.username;
          $location.path('/home/profile');  // concat username to path
        }
      }).catch(function(err) {
        console.log("RESP CATCH", err)
      })
    }

  };

});










