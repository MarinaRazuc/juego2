var Inicio = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
//Inicio.socket = io.connect();
//login.socket.emit("pregunta");

Inicio.preguntar=function(){
	console.log("emito preguntas...");
	socket.emit('pregunta');
};


