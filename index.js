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
var impresora = 0;
var colores=[];
colores[0]="0xBF00FF";
colores[1]="0xFF8000";
colores[2]="0xFFFF00";
colores[3]="0xFF0000";
colores[4]="0x64FE2E";
colores[5]="0x08088A";
colores[6]="0xFF00BF";
//needed for physics update 
var startTime = (new Date).getTime();
var lastTime;
var timeStep= 1/70; 
var unique=require('node-uuid');

app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname+'/js'));

var physicsPlayer = require('./public/physics/playerMovement.js');
 
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

//We call physics handler 60fps. The physics is calculated here. 
setInterval(physics_handler, 1000/60);

//Steps the physics world. 
function physics_handler() {
  var currentTime = (new Date).getTime();
  timeElapsed = currentTime - startTime;
  var dt = lastTime ? (timeElapsed - lastTime) / 1000 : 0;
    dt = Math.min(1 / 10, dt);
    world.step(timeStep);
}
//Then I listen on the connection event for incoming sockets, and I log it to the console.
//Each socket also fires a special disconnect event:
io.on('connection', function(socket){
  console.log('a user connected, ID: ', http.lastPlayderID);
  //socket.on: permite especificar callbacks para manejar diferentes mensajes


  socket.on('new_player', function(data) {
      //new player instance
      var newPlayer = new Player(data.x, data.y, data.angle);
      newPlayer.id = this.id;  /*console.log(newPlayer.id);*/
      var c = http.lastPlayderID%7;
      newPlayer.color=colores[c];
      http.lastPlayderID++;
      //debo controlar si se paso de 7-- ver q hacer cuando esto pasa
      playerBody = new p2.Body ({
        mass: 0,
        position: [0,0],
        //position: [data.x,data.y], //ver, estaba en 0,0
        fixedRotation: true
      });
      
      //add the playerbody into the player object 
      newPlayer.playerBody = playerBody;
      newPlayer.id=this.id;
      //Don’t forget to add the playerbody to the world with world.addBody(playerbody) !! or else your player's physics will not be calculated
      world.addBody(newPlayer.playerBody); 
     
     
     socket.emit('create_player', {x: newPlayer.x, y: newPlayer.y, id: newPlayer.id, color:newPlayer.color, size:newPlayer.size});
      //information to be sent to all clients except sender
      var current_info = {
        id: newPlayer.id, 
        x: newPlayer.x,
        y: newPlayer.y,
        color:newPlayer.color,
        angle:newPlayer.angle, 
        size: newPlayer.size
      }; 
      
      //send to the new player about everyone who is already connected.   
      for (i = 0; i < player_lst.length; i++) {
        console.log("Entro al for");
        existingPlayer = player_lst[i];
        var player_info = {
            id: existingPlayer.id,
            x: existingPlayer.x,
            y: existingPlayer.y  ,
            color:existingPlayer.color, 
            angle: existingPlayer.angle,
            size: existingPlayer.size
        };
         //send message to the sender-client only
         //me llega la info de cada jugador existente antes que "yo"
        socket.emit("new_enemyPlayer", player_info);
      }//END DEL FOR


      player_lst.push(newPlayer); //console.log(player_lst.length);
      //send message to every connected client except the sender
      //a todos los jugadores existentes excepto a mí, les mando mi info
      socket.broadcast.emit('new_enemyPlayer', current_info);
      //socket.emit('new_enemyPlayer', current_info);
  });
 

      //listen for new player inputs. 
      socket.on("input_fired", function(data) {
          var movePlayer = find_playerid(this.id/*, this.room*/); 
          // if (impresora==0){
          //   console.log("id del update" + this.id);
          //   impresora++;
          // }


          if (!movePlayer|| movePlayer.dead){/*console.log("entra aca");*/ return;}
          //when sendData is true, we send the data back to client. 
          if (!movePlayer.sendData) {
            //console.log("en verdad entro aca");
            return;
          }
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
          //moving the player to the new inputs from the player
          // console.log(movePlayer.playerBody);
          if (physicsPlayer.distanceToPointer(movePlayer, serverPointer) > 5) {
            movePlayer.playerBody.angle = physicsPlayer.movetoPointer(movePlayer, 0, serverPointer, 1000);
          } else {
            movePlayer.playerBody.angle = physicsPlayer.movetoPointer(movePlayer, movePlayer.speed, serverPointer); 
          }

          movePlayer.x = movePlayer.playerBody.position[0]; 
          movePlayer.y = movePlayer.playerBody.position[1];

         //new player position to be sent back to client. 
         var info = {
             
            id:movePlayer.id,
            x: movePlayer.playerBody.position[0], 
            y: movePlayer.playerBody.position[1],
            angle: movePlayer.playerBody.angle
          } 

          //send to sender (not to every clients). 
          socket.emit("input_rec", info);
         
          
/*          socket.player.x=data.x;
          socket.player.y=data.y;
          socket.emit('input_recieved', socket.player); //para el mismo jugador
*/
          //data to be sent back to everyone except sender 
          var moveplayerData = {
            id: movePlayer.id, 
            x: movePlayer.playerBody.position[0],
            y: movePlayer.playerBody.position[1],
            angle: movePlayer.playerBody.angle, 
            size: movePlayer.size
          }
          //send to everyone except sender 
          socket.broadcast.emit('enemy_move', moveplayerData);
  });
});//FIN DE CONNECTION 

//find player by the the unique socket id 
function find_playerid(id) {
  if (player_lst.length>0)
    //console.log("id del primero en la lista" + player_lst[0].id);
  for (var i = 0; i < player_lst.length; i++) {
    if (player_lst[i].id == id) {
      // if (impresora == 0){ 
      //   console.log(player_lst[i].id + " " +id);
      //   impresora++;
      // }
      return player_lst[i]; 
    }
  }
  return false; 
}

//a player class in the server
var Player = function (startX, startY, angle) {
  this.x = startX;
  this.y = startY;
  this.speed = 500;
  //We need to intilaize with true.
  this.sendData = true;
  this.angle=angle;
  this.dead=false;
}

