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
/*
socket.on('toggle', function(data){
  Game.toggle(data);
});

*/


// socket.on('move',function(data){//data es socket.player
//     Game.movePlayer(data.id, data.x, data.y);
// });

// socket.on('remove',function(id){
//     Game.removePlayer(id);
// });

// socket.on("enemy_move", function(data){
//     Game.onEnemyMove(data); 
// });
// socket.on("input_rec", function(data){ 
//   Game.onInputRecieved(data);
// //Game.movePlayer(data.id, data.x, data.y);
// });

// //listen to new enemy connections
// socket.on("new_enemyPlayer", function(data){
//     Game.onNewPlayer(data);
// });

// socket.on("create_player", function(data){
//   Game.create_player(data);
// });

// socket.on("item_update", function(data){
//   Game.onItemUpdate(data);
// });

// socket.on("itemremove", function(data){
//   Game.onItemRemove(data);
// });

// socket.on("remove_player", function(data){
//   Game.onRemovePlayer(data);
// });

// socket.on("enter_game", function(data){
//   console.log("client.js en enter_game");
//   Game.logueado({username: data.username});
// });

// socket.on("leader_board", function(data){
//   Game.lbupdate(data);
// });

// // socket.on("puntos", function(){
// //   Game.aumentar();
// // });

// socket.on('salto', function(data){
//   Game.saltar({x:data.x, y:data.y});
// });

// socket.on('liberar', function(data){
//   Game.Liberar(data);
// });

// socket.on("liberados", function(data){
//   Game.aumentar({presos: data.cant});
// });

// socket.on('player_preso', function(data){
//   Game.resetear({id: data.id, x:data.x, y:data.y});
// });

// socket.on('player_liberado', function(data){
//   Game.resetear({id:data.id, x:data.x, y:data.y});
// });

function randomInt(low, high){
  return Math.floor(Math.random() *(high-low) +low);
};
function listar(data){
  Game.lbupdate(data);
};