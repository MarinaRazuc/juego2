var modal=document.getElementById("myModal");
var btn=document.getElementById("modalButton");
var signDiv=document.getElementById("signDiv");
var elegir=document.getElementById("elegir");
var datos=document.getElementById("datos");
var boton=document.getElementById("boton");

document.getElementById("danger").style.display="none";
btn.onclick=function(){
	modal.style.display='block';
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
		var valor=getRadioButtonSelectedValue(document.form_jugador.tipo_jugador);
		socket.emit('enter_name', {username: signdivusername.value, tipo_jugador:valor}); 
		if(valor=="pol"){
			document.getElementById("score").innerHTML="";
		}
	}else{
		//aca entraria cuando reinicia
	}
}
// document.onkeypressed=function(){
// 	console.log("enter");
// 	tecla = (document.all) ? e.keyCode : e.which;
// 	if(tecla==13){
// 		console.log("enter");
// 	  	if (!gameProperties.in_game) {
// 			var valor=getRadioButtonSelectedValue(document.form_jugador.tipo_jugador);
// 			socket.emit('enter_name', {username: signdivusername.value, tipo_jugador:valor}); 
// 			if(valor=="pol"){
// 				document.getElementById("score").innerHTML="";
// 			}
// 		}else{
// 			//aca entraria cuando reinicia
// 		}
//   	}
// }


//boton de reiniciar
document.getElementById("reiniciar").onclick=function(){
	location.reload(true);
	// gameProperties.in_game = false; 
	// preguntar();	
	// document.getElementById("cartel").style.display="none";
	// document.getElementById("reiniciar").style.display="none";
	// document.getElementById("prueba").style.display="none";
	// document.getElementById("signDiv").style.display="block";
	// document.getElementById("elegir").style.display="block";
	// document.getElementById("boton").style.display="block";

	//borrar todo lo relacionado al juego del jugador correspondiente.
}


function getRadioButtonSelectedValue(ctrl){
    for(i=0;i<ctrl.length;i++){
        if(ctrl[i].checked) 
        	return ctrl[i].value; 
    }
}



var login = function(game){
	//console.log("login function");
};

login.prototype = {
	create: function () {
		//console.log("login prototype");
		//game.stage.backgroundColor = "#AFF7F0";
		
		socket = io({transports: ['websocket'], upgrade: false});
		preguntar();
		socket.on('join_game', function(data){
			
			gameProperties.in_game = true; 
			signDiv.style.display = 'none'; 
			elegir.style.display='none';
			datos.style.display='block';
			boton.style.display='none';
			document.getElementById("danger").style.display="none";
			document.getElementById("game").style.display="block";
			game.state.start(
        		'Game', true, false, data.username, data.tipo
    		);
		});
		socket.on('not_join_game', function(data){
			
			document.getElementById("danger").style.display="block";
			game.state.start(
        		'login'
    		);
		});
	
		socket.on("habilitar", function(){
			
			document.getElementById("poli").disabled=false;
		});

		socket.on("deshabilitar", function(){
			
			document.getElementById("poli").disabled=true;
		});
		socket.on("hab_ladrones", function(){
			
		  document.getElementById("ladr").disabled=false;
		});

		socket.on("des_ladrones", function(){
			
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
	
	socket.emit('pregunta');
};
