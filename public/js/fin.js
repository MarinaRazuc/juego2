var fin = function(){
	
};

fin.prototype = {
	create: function(){

	},
	init: function (variable) {
		var ventana=document.getElementById("cartel");
		var text=ventana.innerHTML;
		var nuevo_rank=ranking.replace(/\n/g, "</br>");
		console.log(variable);
		var texto="  ¡Fin del Juego!"+"</br>"+"Ganaron los "+" "+variable+"."+"</br> </br>"+"Ranking final: "+"</br>"+nuevo_rank;
		ventana.innerHTML=texto;
		document.getElementById("game").style.display="none";
		document.getElementById("datos").style.display="none";
		document.getElementById("prueba").style.display="block";
		ventana.style.textAlign = "center";
		ventana.style.display='block';
		
		document.getElementById("score").innerHTML="Banderines: "+0;
	}

}