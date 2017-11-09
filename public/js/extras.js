function iniciar(){
	var socket = io(); //I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    //on the client side when we capture a 'chat message' event we’ll include it in the page
    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));
    });
              
}