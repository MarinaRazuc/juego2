var express = require('express');
var app = express();
var http = require('http').Server(app);//server
var io = require('socket.io')(http);
//var io=require('socket.io').listen(http)
var player_lst = [];
var p2 = require('p2'); 
var world = new p2.World({
  gravity : [0,0]
});
var colores=[];
colores[0]="0xBF00FF";
colores[1]="0xFF8000";
colores[2]="0xFFFF00";
colores[3]="0xFF0000";
colores[4]="0x64FE2E";
colores[5]="0x08088A";
colores[6]="0xFF00BF";




app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname+'/js'));

var physicsPlayer = require('./public/physics/playermovement.js');

//We define a route handler "/" that gets called when we hit our website home.
app.get('/', function(req, res){
  //Let’s refactor our route handler to use sendFile instead
  res.sendFile(__dirname + '/index.html');
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

//mantiene el último ID asignado
http.lastPlayderID=0;

//Then I listen on the connection event for incoming sockets, and I log it to the console.
//Each socket also fires a special disconnect event:
io.on('connection', function(socket){
  console.log('a user connected, ID: ', http.lastPlayderID);
  //socket.on: permite especificar callbacks para manejar diferentes mensajes
   socket.on('new_player', function(data) {
      //new player instance
      var newPlayer = new Player(data.x, data.y);
      newPlayer.id = this.id;  
      var c = http.lastPlayderID%7;
      newPlayer.color=colores[c];
      http.lastPlayderID++;
      //debo controlar si se paso de 7-- ver q hacer cuando esto pasa
      playerBody = new p2.Body ({
        mass: 0,
        position: [data.x,data.y],
        fixedRotation: true
      });
      
      //add the playerbody into the player object 
      newPlayer.playerBody = playerBody;
      //Don’t forget to add the playerbody to the world with world.addBody(playerbody) !! or else your player's physics will not be calculated
      world.addBody(newPlayer.playerBody); 
     
      //information to be sent to all clients except sender
      var current_info = {
        id: newPlayer.id, 
        x: newPlayer.x,
        y: newPlayer.y,
        color:newPlayer.color
      }; 
      
      //send to the new player about everyone who is already connected.   
      for (i = 0; i < player_lst.length; i++) {
        existingPlayer = player_lst[i];
        var player_info = {
          id: existingPlayer.id,
          x: existingPlayer.x,
          y: existingPlayer.y  ,
          color:existingPlayer.color
        };
         //send message to the sender-client only
        socket.emit("new_enemyPlayer", player_info);
      }
      player_lst.push(newPlayer); 
      //send message to every connected client except the sender
      socket.broadcast.emit('new_enemyPlayer', current_info);
  });
//     //le enviamos al jugador la lista de los jugadores conectados
//     socket.emit('allplayers', getAllPlayers());
//     // socket.emit('allfood', getAllFood()); //????????????????????????????
//     socket.broadcast.emit('newplayer', socket.player);
// //  socket.broadcast.emit('newfood', socket.food); //???????????????????
      
    socket.on('moverJugador',function(data){
      socket.player.x = data.x;
      socket.player.y = data.y;
      io.emit('move',socket.player);
      socket.broadcast.emit('movePlayer', socket.player); //enviar pos a los demas jugadores
    });

      //listen for new player inputs. 
      socket.on("input_fired", function(data) {
          var movePlayer = find_playerid(this.id, this.room); 
          if (!movePlayer){ return;}
          setTimeout(function() {movePlayer.sendData = true}, 50);
          //we set sendData to false when we send the data. 
          movePlayer.sendData = false;
          //Make a new pointer with the new inputs from the client. 
          //contains player positions in server
          var serverPointer = {
            x: data.pointer_x,
            y: data.pointer_y,
            worldX: data.pointer_worldx,    
            worldY: data.pointer_worldy
          }
         //new player position to be sent back to client. 
         var info = {
            x: movePlayer.playerBody.position[0], //ESTO VA A FALLAR
            y: movePlayer.playerBody.position[1],
            angle: movePlayer.playerBody.angle
          } //VER SI ESTO ES NECESARIO O NO
          //send to sender (not to every clients). 
          socket.emit('input_recieved', info);
         
/*          socket.player.x=data.x;
          socket.player.y=data.y;
          socket.emit('input_recieved', socket.player); //para el mismo jugador
*/
          //data to be sent back to everyone except sender 
          var moveplayerData = {
            id: movePlayer.id, 
            x: movePlayer.playerBody.position[0],//ESTO VA A FALLAR
            y: movePlayer.playerBody.position[1],
          }
          //send to everyone except sender 
          socket.broadcast.emit('enemy_move', moveplayerData);
  });
});//FIN DE CONNECTION
   
//       //el callback de 'disconnect' se registra acá, dentro del callback de 'newplayer', si esto no es así, 
//       //y de alguna manera 'disconnect' es llamado antes que 'newplayer', se "rompe" el servidor
//       socket.on('disconnect', function(){
//         console.log('user disconnected');
//         io.emit('remove', socket.player.id);
//         var removePlayer = find_playerid(this.id); 
    
//         if (removePlayer) {
//           player_lst.splice(player_lst.indexOf(removePlayer), 1);
//         }
//         //send message to every connected client except the sender
//         this.broadcast.emit('remove_player', {id: this.id});
//       });

//       socket.on('player_move', function(moveplayerData){
//         socket.broadcast.emit('movePlayer', socket.player)
//       });
      
//       socket.on("enemy_move_info", function(data){//????????????????????????????????????????????????????????
//         var movePlayer = find_playerid (data.id); 
//         if (!movePlayer) {
//           return;
//         }
//         var newPointer = {
//           x: data.x,
//           y: data.y, 
//           worldX: data.x,
//           worldY: data.y, 
//         }
//         var distance = physicsPlayer.distanceToPointer(movePlayer.player , newPointer);
//         speed = distance/0.05;
//         movePlayer.rotation = physicsPlayer.movetoPointer(movePlayer.player , speed, newPointer);
//       });

//  });
// });
  

 

//find player by the the unique socket id 
function find_playerid(id) {
  for (var i = 0; i < player_lst.length; i++) {
    if (player_lst[i].id == id) {
      return player_lst[i]; 
    }
  }
  
  return false; 
}

//a player class in the server
var Player = function (startX, startY) {
  this.x = startX;
  this.y = startY;
  this.speed = 500;
  //We need to intilaize with true.
  this.sendData = true;
}

