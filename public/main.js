$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var typing = $('#typing');
    var connections = $('#connections span');
    var clickCount = 0;
    var timeout;

    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
        typing.text("");
    };

    var updateConnections = function(connectionCount) {
      connections.html(connectionCount);
      console.log(connectionCount);
    };

    var addUsername = function(username) {
      messages.append('<div>' + username + '</div>');
    };

    var userType = function(msg) {
      typing.html('<div>' + msg + '</div>');
      if (!timeout) {
        timeout = setTimeout(function() {
          typing.html('');
          timeout = undefined;
        }, 3000);
      }
    }

/*------------------  jQuery  ---------------------*/
    input.keypress(function(event) {
      if(event.keyCode == 13) {
        if(!socket.username) {
          //user is not signed in yet
          socket.emit('username', input.val());
          socket.username = input.val();
          input.removeAttr('placeholder');
        } else {
          //user is signed in
          socket.emit('message', input.val());
          addMessage(socket.username + ": " + input.val());
        }
        input.val("");
        typing.text("");
      } else {
        if (socket.username) {
            socket.emit('typing');
            //userType(socket.username + " is typing...");
        }
      }
    });

socket.on('message', addMessage);
socket.on('typing', userType);
socket.on('total', updateConnections);
socket.on('username', addUsername);
});
