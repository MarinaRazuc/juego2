var player;

//objeto cliente que actuara como la interface entre el servidor y el cliente en sí
var Client = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
Client.socket = io.connect();

/*Usa nuestro objeto socket y envía a través del mismo un mensaje al servidor
  Este msj tendrá la etiqueta 'new_player'*/
Client.askNewPlayer=function(data){
  Client.socket.emit('new_player', data); //  {x: randomInt(20, 30), y: randomInt(20, 30), angle:0}
};

// Client.askNewPlayer=function(){
//    Client.socket.emit('new_player', {x:0, y:0, angle:0}); //  {x: randomInt(20, 30), y: randomInt(20, 30), angle:0}
// };

Client.moverJugador = function(pointer){  
  Client.socket.emit('input_fired', {
    pointer_x: pointer.x, 
    pointer_y: pointer.y, 
    pointer_worldx: pointer.worldX, 
    pointer_worldy: pointer.worldY, 
    preso: pointer.preso
  });
 // Client.socket.emit('moverJugador',{x:pointer.x, y:pointer.y});
};

Client.crearComida=function(color){
  Client.socket.emit("crear_comida", color);
};

Client.levantarBanderin=function(data){
  Client.socket.emit('item_picked', data); 
};    

Client.nombre_usr=function(data){
  Client.socket.emit('enter_name', {username: data.username});
}

Client.colision=function(data){
  console.log("colision en client.js");
  Client.socket.emit('player_collision', {id:data.key});
}

Client.liberar=function(){
  Client.socket.emit('liberar_prisioneros');
}

Client.npresos=function(data){
  var p=0;
  Client.socket.emit("contar_presos", {presos: p});
  data.presos=p;
}

Client.salir_de_prision=function(){
  Client.socket.emit("salir_de_prision");
}

Client.socket.on('toggle', function(data){
  Game.toggle(data);
});

// Client.socket.on('move',function(data){//data es socket.player
//     Game.movePlayer(data.id, data.x, data.y);
// });

// Client.socket.on('remove',function(id){
//     Game.removePlayer(id);
// });

// Client.socket.on("enemy_move", function(data){
//     Game.onEnemyMove(data); 
// });
// Client.socket.on("input_rec", function(data){ 
//   Game.onInputRecieved(data);
// //Game.movePlayer(data.id, data.x, data.y);
// });

// //listen to new enemy connections
// Client.socket.on("new_enemyPlayer", function(data){
//     Game.onNewPlayer(data);
// });

// Client.socket.on("create_player", function(data){
//   Game.create_player(data);
// });

// Client.socket.on("item_update", function(data){
//   Game.onItemUpdate(data);
// });

// Client.socket.on("itemremove", function(data){
//   Game.onItemRemove(data);
// });

// Client.socket.on("remove_player", function(data){
//   Game.onRemovePlayer(data);
// });

// Client.socket.on("enter_game", function(data){
//   console.log("client.js en enter_game");
//   Game.logueado({username: data.username});
// });

// Client.socket.on("leader_board", function(data){
//   Game.lbupdate(data);
// });

// // Client.socket.on("puntos", function(){
// //   Game.aumentar();
// // });

// Client.socket.on('salto', function(data){
//   Game.saltar({x:data.x, y:data.y});
// });

// Client.socket.on('liberar', function(data){
//   Game.Liberar(data);
// });

// Client.socket.on("liberados", function(data){
//   Game.aumentar({presos: data.cant});
// });

// Client.socket.on('player_preso', function(data){
//   Game.resetear({id: data.id, x:data.x, y:data.y});
// });

// Client.socket.on('player_liberado', function(data){
//   Game.resetear({id:data.id, x:data.x, y:data.y});
// });

function randomInt(low, high){
  return Math.floor(Math.random() *(high-low) +low);
};
function listar(data){
  Game.lbupdate(data);
};