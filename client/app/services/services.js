// ADD SERVICES AND FACTORIES HERE

angular.module('app.services', [])



.factory('UserInfo', function($http) {

  return {
    user: 'Tonny',
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
      console.log('currentRoom', this.currentRoom);
      // return $http({
      //   method: 'GET',
      //   url: 'FILL_ME_IN',
      //   params: {room: room.roomname}
      // }).then(function(resp) {
      //   console.log(resp);
      // });
    }

  };


})

.factory('Authentication', function($http) {



  var signUp = function(user) {

    return $http({
      method: 'POST',
      url: '/signup',
      data: user
    }).then(function(resp) {
      console.log(resp);
    });

  };

  var signIn = function(user) {

    return $http({
      method: 'POST',
      url: '/login',
      data: user
    }).then(function(resp) {
      console.log(resp);
    });
  };

  return {
    signIn: signIn,
    signUp: signUp
  };


});











