var player;

//objeto cliente que actuara como la interface entre el servidor y el cliente en sí
var Client = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
//socket = io.connect();

/*Usa nuestro objeto socket y envía a través del mismo un mensaje al servidor
  Este msj tendrá la etiqueta 'new_player'*/
Client.askNewPlayer=function(data){
  socket.emit('new_player', data); //  {x: randomInt(20, 30), y: randomInt(20, 30), angle:0}
};

// Client.askNewPlayer=function(){
//    socket.emit('new_player', {x:0, y:0, angle:0}); //  {x: randomInt(20, 30), y: randomInt(20, 30), angle:0}
// };

Client.moverJugador = function(pointer){  
  socket.emit('input_fired', {
    pointer_x: pointer.x, 
    pointer_y: pointer.y, 
    pointer_worldx: pointer.worldX, 
    pointer_worldy: pointer.worldY, 
    preso: pointer.preso
  });
 // socket.emit('moverJugador',{x:pointer.x, y:pointer.y});
};

Client.crearComida=function(color){
  socket.emit("crear_comida", color);
};

Client.levantarBanderin=function(data){
  socket.emit('item_picked', data); 
};    

Client.nombre_usr=function(data){
  socket.emit('enter_name', {username: data.username});
}

Client.colision=function(data){
  console.log("colision en client.js");
  socket.emit('player_collision', {id:data.key});
}

Client.liberar=function(){
  socket.emit('liberar_prisioneros');
}

Client.npresos=function(data){
  var p=0;
  socket.emit("contar_presos", {presos: p});
  data.presos=p;
}

Client.salir_de_prision=function(){
  socket.emit("salir_de_prision");
}

Client.listo=function(){
  socket.emit("listo");
}

Client.final=function(){
  socket.emit("final");
}

Client.desconectar=function(){
  socket.emit("disconnect");
}

function randomInt(low, high){
  return Math.floor(Math.random() *(high-low) +low);
};
function listar(data){
  Game.lbupdate(data);
};

// socket.on("final", function(){
//     socket.emit("final");
// });
