var modal=document.getElementById("myModal");
var btn=document.getElementById("modalButton");
var span=document.getElementsByClassName("close")[0];
btn.onclick=function(){
	modal.style.display='block';
}
span.onclick=function(){
	modal.style.display="none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
document.getElementById("prison").style.display='none';
document.getElementById("datos").style.display='none';
document.getElementById("sala_llena").style.display='none';
document.getElementById("prueba").style.display="none";
document.getElementById("entername").onclick = function () {
	if (!gameProperties.in_game) {
		gameProperties.in_game = true; 
		signDiv.style.display = 'none'; 
		elegir.style.display='none';
		datos.style.display='block';
		boton.style.display='none';
		
		var valor=getRadioButtonSelectedValue(document.form_jugador.tipo_jugador);
		socket.emit('enter_name', {username: signdivusername.value, tipo_jugador:valor}); 
	}
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
}

var login = function(game){
	//console.log("login function");
};

login.prototype = {
	create: function () {
		//console.log("login prototype");
		//game.stage.backgroundColor = "#AFF7F0";
		console.log("hoal");
		socket = io({transports: ['websocket'], upgrade: false});
		preguntar();
		socket.on('join_game', join_game);
		socket.on("habilitar", function(){
			console.log("HABILITO POLIS");
			document.getElementById("poli").disabled=false;
		});

		socket.on("deshabilitar", function(){
			console.log("DESHABILITO POLIS");
			document.getElementById("poli").disabled=true;
		});
		socket.on("hab_ladrones", function(){
			console.log("HABILITO LADRIS");
		  document.getElementById("ladr").disabled=false;
		});

		socket.on("des_ladrones", function(){
			console.log("DESHABILITO LADRIS");
		  document.getElementById("ladr").disabled=true;
		});
		socket.on("habilitar", function(){
		  document.getElementById("poli").disabled=false;
		});

		socket.on("deshabilitar", function(){
		  var bp=document.getElementById("poli");
		  bp.disabled=true;
		  bp.checked=false;
		  document.getElementById("ladr").checked=true;
		});

		socket.on("hab_ladrones", function(){
		  document.getElementById("ladr").disabled=false;
		});

		socket.on("des_ladrones", function(){
		  var bl=document.getElementById("ladr");
		  bl.disabled=true;
		  bl.checked=false;
		  document.getElementById("poli").checked=true;
		});

		socket.on("sala_llena", function(){
		  document.getElementById("entername").disabled=true;
		  document.getElementById("sala_llena").style.display="block";
		});

		socket.on("sala_libre", function(){
		  document.getElementById("entername").disabled=false;
		});
	}
}

function preguntar(){
	console.log("emito preguntas...");
	socket.emit('pregunta');
};
