var player;

//objeto cliente que actuara como la interface entre el servidor y el cliente en sí
var Client = {};

//iniciar una conexion con el servidor (localhost si no se especifica otro link entre parentesis)
Client.socket = io.connect();

/*Usa nuestro objeto socket y envía a través del mismo un mensaje al servidor
  Este msj tendrá la etiqueta 'new_player'*/
Client.askNewPlayer=function(){
   Client.socket.emit('new_player', {x: 0, y: 0, angle:0}  ); //  {x: randomInt(20, 30), y: randomInt(20, 30), angle:0}
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

Client.crearComida=function(color){
  Client.socket.emit("crear_comida", color);
};

Client.levantarBanderin=function(data){
  Client.socket.emit('item_picked', data); 
};    

Client.socket.on('move',function(data){//data es socket.player
    Game.movePlayer(data.id, data.x, data.y);
});

Client.socket.on('remove',function(id){
    Game.removePlayer(id);
});

Client.socket.on("enemy_move", function(data){
    Game.onEnemyMove(data); 
});
Client.socket.on("input_rec", function(data){ 
  Game.onInputRecieved(data);
//Game.movePlayer(data.id, data.x, data.y);
});

//listen to new enemy connections
Client.socket.on("new_enemyPlayer", function(data){
    Game.onNewPlayer(data);
});

Client.socket.on("create_player", function(data){
  Game.create_player(data);
});

Client.socket.on("item_update", function(data){
  Game.onItemUpdate(data);
});

Client.socket.on("itemremove", function(data){
  Game.onItemRemove(data);
});

Client.socket.on("remove_player", function(data){
  Game.onRemovePlayer(data);
});

function randomInt(low, high){
  return Math.floor(Math.random() *(high-low) +low);
};