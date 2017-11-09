var player;

//objeto cliente que actuara como la interface entre el servidor y el cliente en sí
var Client = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
Client.socket = io.connect();

/*Usa nuestro objeto socket y envía a través del mismo un mensaje al servidor
  Este msj tendrá la etiqueta 'new_player'*/
Client.askNewPlayer=function(){
  Client.socket.emit('new_player', {x: randomInt(20, 1152), y: randomInt(20, 816)}); 
};

Client.moverJugador = function(pointer){  
  Client.socket.emit('input_fired', {
    pointer_x: pointer.x, 
    pointer_y: pointer.y, 
    pointer_worldx: pointer.worldX, 
    pointer_worldy: pointer.worldY, 
  });
 // Client.socket.emit('moverJugador',{x:pointer.x, y:pointer.y});
};

// Client.emitMovement=function(moveplayerData){//{id, XX, YY}
//   Client.socket.emit('player_move', moveplayerData);
// };
// Client.socket.on('movePlayer', function(data){
//   Game.actualizarPos(data.id, data.x, data.y);
// });

// Client.socket.on('newplayer',function(data){
//     Game.addNewPlayer(data.id,data.x,data.y, true);
// });    

Client.socket.on('move',function(data){//data es socket.player
    Game.movePlayer(data.id, data.x, data.y);
});

  Client.socket.on('remove',function(id){
      Game.removePlayer(id);
  });




/*Client.socket.on("enemy_move", function(data){
  Client.socket.emit("enemy_move_info", data);
});*/
Client.socket.on("enemy_move", function(data){
    Game.onEnemyMove(data); 
});
Client.socket.on('input_recieved', function(data){ //socket.player
  Game.onInputRecieved(data);
   // Game.movePlayer(data.id, data.x, data.y);
});

//listen to new enemy connections
Client.socket.on("new_enemyPlayer", function(data){
    Game.onNewPlayer(data);
});


function randomInt(low, high){
  return Math.floor(Math.random() *(high-low) +low);
};