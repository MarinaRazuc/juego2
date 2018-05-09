


//setup onclick callback for when the user submits the submit button.
document.getElementById("entername").onclick = function () {

	if (!gameProperties.in_game) {
		gameProperties.in_game = true; 
		//hide the signdiv so that game div shows
		signDiv.style.display = 'none'; 
		elegir.style.display='none';

		var valor=$('input[name=tipo_jugador]:checked', '#form_jugador').val();
		console.log("Valor del radio: ", valor);
		socket.emit('enter_name', {username: signdivusername.value}); 
	}
	
// 	//hide the signdiv so that game div shows
// 	signDiv.style.display = 'none';
// //	Client.nombre_usr({username: signdivusername.value})
// 	socket.emit('enter_name', {username: signdivusername.value});
}

function join_game (data) {
	console.log("join_game en login.js");
	game.state.start(
        'Game', true, false, data.username
    );
   //Game.init(data.username);
}

var login = function(game){
	console.log("login function");
};

login.prototype = {
	

	create: function () {
		console.log("login prototype");
		game.stage.backgroundColor = "#AFF7F0";
		socket = io({transports: ['websocket'], upgrade: false});
		socket.on('join_game', join_game);
	}
}
