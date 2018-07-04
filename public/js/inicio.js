var Inicio = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
Inicio.socket = io.connect();

Inicio.socket.emit("pregunta");

Inicio.preguntar=function(){
	console.log("emito preguntas...");
	Inicio.socket.emit('pregunta');
};

Inicio.socket.on("habilitar", function(){
	console.log("HABILITO");
	document.getElementById("poli").disabled=false;
});

Inicio.socket.on("deshabilitar", function(){
	console.log("DESHABILITO");
	console.log(document.getElementById("poli"));
	document.getElementById("poli").disabled=true;
});
Inicio.socket.on("hab_ladrones", function(){
  document.getElementById("ladr").disabled=false;
});

Inicio.socket.on("des_ladrones", function(){
  document.getElementById("ladr").disabled=true;
});
