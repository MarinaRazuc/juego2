


//setup onclick callback for when the user submits the submit button.
document.getElementById("entername").onclick = function () {

	if (!gameProperties.in_game) {
		gameProperties.in_game = true; 
		//hide the signdiv so that game div shows
		signDiv.style.display = 'none'; 
		elegir.style.display='none';

		var valor=getRadioButtonSelectedValue(document.form_jugador.tipo_jugador);
		socket.emit('enter_name', {username: signdivusername.value, tipo_jugador:valor}); 
	}
	
// 	//hide the signdiv so that game div shows
// 	signDiv.style.display = 'none';
// //	Client.nombre_usr({username: signdivusername.value})
// 	socket.emit('enter_name', {username: signdivusername.value});
}

function getRadioButtonSelectedValue(ctrl){
    for(i=0;i<ctrl.length;i++){
        if(ctrl[i].checked) 
        	return ctrl[i].value; 
    }
}

function join_game (data) {
	game.state.start(
        'Game', true, false, data.username, data.tipo
    );
   //Game.init(data.username);
}

var login = function(game){
	//console.log("login function");
};

login.prototype = {
	

	create: function () {
		//console.log("login prototype");
		game.stage.backgroundColor = "#AFF7F0";
		socket = io({transports: ['websocket'], upgrade: false});
		socket.on('join_game', join_game);
	}
}
