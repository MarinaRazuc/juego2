var express = require('express');
var app = express();
var http = require('http').Server(app);//server
var io = require('socket.io')(http);
//var io=require('socket.io').listen(http)
var player_lst = [];
//require p2 physics library in the server.
var p2 = require('p2'); 
var world = new p2.World({
  gravity : [0,0]
});
var impresora = 0;
var colores=[];
colores[0]='orange_player'//"0xFF8000";
colores[1]='violet_player'//"0xBF00FF";
colores[2]='yellow_player'//"0xFFFF00";
colores[3]='red_player'//"0xFF0000";
colores[4]='green_player'//"0x64FE2E";
colores[5]='blue_player'//"0x08088A";
colores[6]='pink_player'//"0xFF00BF";
colores[7]='black_player'
colores[8]='grey_player'
//needed for physics update 
var startTime = (new Date).getTime();
var lastTime;
var timeStep= 1/70; 
//get the node-uuid package for creating unique id
var unique=require('node-uuid');

var game_setup = function() {
  //The constant number of foods in the game
//  this.food_num = 100; 
  //food object list
  this.food_pickup = [];
  //game size height
  this.canvas_height =2000;
  //game size width
  this.canvas_width =2000; 
}

// createa a new game instance
var game_instance = new game_setup();

const max_banderas=15;


app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/js', express.static(__dirname+'/js'));
//get the functions required to move players in the server.
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
http.lastPlayerID=0;

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


  // //when the player enters their name
    // socket.on('enter_name', onEntername); 
    
    // //when the player logs in
    // socket.on('logged_in', function(data){
    //   this.emit('enter_game', {username: data.username}); 
    // }); 

  
  socket.on('enter_name', function(data){
    socket.emit('join_game', {username: data.username, id: this.id});
    //login
  }); 


  //when the player logs in
  socket.on('logged_in', function(data){
    console.log("socket.on logged_in");
    socket.emit('enter_game', {username: data.username}); 
  }); 
    
   //when the player enters the game 
  socket.on('enter_game', function(data){
    console.log("connected to server"); 
    gameProperties.in_game = true;
    var username = data.username;
    //when the socket connects, call the onsocketconnected and send its information to the server 
    socket.emit('logged_in', {username: username}); 
    // send the server our initial position and tell it we are connected
  });
  //socket.emit('new_player', {username: data.username, x: 0, y: 0, angle: 0});
  //Client.askNewPlayer({username:data.username, x:0, y:0, angle:0})



  console.log('a user connected, ID: ', http.lastPlayerID);
  //socket.on: permite especificar callbacks para manejar diferentes mensajes
  var crear_polis=false;
  var poli1, poli2;
  socket.on('new_player', function(data) {
    console.log("index.js new_player. Player name= "+data.username);

      //new player instance
      var newPlayer = new Player(data.x, data.y, data.angle);
      newPlayer.id = this.id;  /*console.log(newPlayer.id);*/
      var c = http.lastPlayerID%7;
      newPlayer.color=colores[c];
      newPlayer.username = data.username;
      http.lastPlayerID++;
      // if(c==0){ //el primero
      //   poli1=new Player(200, 200, 0);//--------------------------------------------------------------
      //   poli2=new Player(400, 400, 0);
      //   crear_polis=true;
      // }
      //debo controlar si se paso de 7-- ver q hacer cuando esto pasa
      playerBody = new p2.Body ({
        mass: 0,
        position: [0,0],
        //position: [data.x,data.y], //ver, estaba en 0,0
        fixedRotation: true
      });

      //add the playerbody into the player object 
      newPlayer.playerBody = playerBody;
      //Don’t forget to add the playerbody to the world with world.addBody(playerbody) !! or else your player's physics will not be calculated
      world.addBody(newPlayer.playerBody); 

      // if(crear_polis){
      //   pol1body = new p2.Body ({
      //     mass: 0,
      //     position: [0,0],
      //     //position: [data.x,data.y], //ver, estaba en 0,0
      //     fixedRotation: true
      //   });
      //   poli1.playerBody=pol1body;
        
      //   pol2body = new p2.Body ({
      //     mass: 0,
      //     position: [0,0],
      //     //position: [data.x,data.y], //ver, estaba en 0,0
      //     fixedRotation: true
      //   });
      //   poli2.playerBody=pol2body;
        
      //   poli1.color=colores[7];
      //   poli2.color=colores[8];

      //   world.addBody(poli1.playerBody);
      //   world.addBody(poli2.playerBody);
      // }

      

      // if(crear_polis){
      //   socket.emit('create_player', {x: poli1.x, y:poli1.y, id:"P1", color: poli1.color, size:15});
      //   socket.emit('create_player', {x: poli2.x, y:poli2.y, id:"P2", color: poli2.color, size:15});
      // }
      socket.emit('create_player', {x: newPlayer.x, y: newPlayer.y, id: newPlayer.id, color:newPlayer.color, size:newPlayer.size, username:newPlayer.username});
     
      //information to be sent to all clients except sender
      var current_info = {
        id: newPlayer.id, 
        x: newPlayer.x,
        y: newPlayer.y,
        color:newPlayer.color,
        angle:newPlayer.angle, 
        size: newPlayer.size
      };

      var current_info_1;
      var current_info_2;
      // if(crear_polis){
      //   current_info_1 = {
      //     id: poli1.id, 
      //     x: poli1.x,
      //     y: poli1.y,
      //     color:poli1.color,
      //     angle:poli1.angle, 
      //     size: poli1.size
      //   };
      //   current_info_2 = {
      //     id: poli2.id, 
      //     x: poli2.x,
      //     y: poli2.y,
      //     color:poli2.color,
      //     angle:poli2.angle, 
      //     size: poli2.size
      //   };
      // }

      //send to the new player about everyone who is already connected.   
      for (i = 0; i < player_lst.length; i++) {
        console.log("Entro al for");
        existingPlayer = player_lst[i];
        var player_info = {
            id: existingPlayer.id,
            username: existingPlayer.username,
            x: existingPlayer.x,
            y: existingPlayer.y  ,
            color:existingPlayer.color, 
            angle: existingPlayer.angle,
            size: existingPlayer.size
        };
        // send message to the sender-client only
         //me llega la info de cada jugador existente antes que "yo"
        socket.emit("new_enemyPlayer", player_info);
      }//END DEL FOR
      
      player_lst.push(newPlayer); //console.log(player_lst.length);
      // if(crear_polis){
      //   player_lst.push(poli1);
      //   player_lst.push(poli2);
      // }

      //banderas del resto
      for (j = 0; j < game_instance.food_pickup.length; j++) {
          var food_pick = game_instance.food_pickup[j];
          socket.emit('item_update', food_pick); 
      }


      // if(crear_polis){
      //   socket.broadcast.emit('new_enemyPlayer', current_info_1);
      //   socket.broadcast.emit('new_enemyPlayer', current_info_2);
      // }
      
      //a todos los jugadores existentes excepto a mí, les mando mi info
      socket.broadcast.emit('new_enemyPlayer', current_info);

      //se crean banderitas propias
      for (var i = 0; i < max_banderas; i++) { //por ahora 15
          //create the unique id using node-uuid
          var unique_id = unique.v4(); 
          var str_clr=newPlayer.color+"_food";
                   
          var foodentity = new foodpickup(game_instance.canvas_width-100, game_instance.canvas_height-100, str_clr/*'food'*/, unique_id);
          game_instance.food_pickup.push(foodentity); 
          //set the food data back to client
          socket.emit("item_update", foodentity); 
          socket.broadcast.emit("item_update", foodentity);
      }
 
      sortPlayerListByScore();
  }); //FIN 'new_player'------------------------------------------------------------
 

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
          if (physicsPlayer.distanceToPointer(movePlayer, serverPointer) <=30) {
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
  }); //fin input fired


  socket.on('item_picked', function(data){
     // console.log("item_picked");
      var movePlayer = find_playerid(this.id); 
      var object = find_food(data.id);  
      if (!object) {
        console.log(data);
        console.log("could not find object");
        return;
      }
      game_instance.food_pickup.splice(game_instance.food_pickup.indexOf(object), 1);
      //comunicar a todos los jugadores, incluyéndome
      sortPlayerListByScore();
      socket.emit('itemremove', object);
      socket.broadcast.emit('itemremove', object); 
      //socket.emit('item_picked');//?????
  }); //fin item picked


  //Modificar esto en el caso de chocar con un policia
  socket.on("player_collision", function(data){
    var movePlayer = find_playerid(this.id); 
    var enemyPlayer = find_playerid(data.id); 
    
    
    if (movePlayer.dead || enemyPlayer.dead)
      return
    
    if (!movePlayer || !enemyPlayer)
      return

    
    // if (movePlayer.size == enemyPlayer)
    //   return
    // //the main player size is less than the enemy size
    // else if (movePlayer.size < enemyPlayer.size) {
    //   var gained_size = movePlayer.size / 2;
    //   enemyPlayer.size += gained_size; 
    //   this.emit("killed");
    //   //provide the new size the enemy will become
    //   this.broadcast.emit('remove_player', {id: this.id});
    //   this.broadcast.to(data.id).emit("gained", {new_size: enemyPlayer.size}); 
    //   playerKilled(movePlayer);
    // } else {
    //   var gained_size = enemyPlayer.size / 2;
    //   movePlayer.size += gained_size;
    //   this.emit('remove_player', {id: enemyPlayer.id}); 
    //   this.emit("gained", {new_size: movePlayer.size}); 
    //   this.broadcast.to(data.id).emit("killed"); 
    //   //send to everyone except sender.
    //   this.broadcast.emit('remove_player', {id: enemyPlayer.id});
    //   playerKilled(enemyPlayer);
    // }

    sortPlayerListByScore();    
    console.log("someone ate someone!!!");

  }); //fin player collision



    //call when a client disconnects and tell the clients except sender to remove the disconnected player
    socket.on("disconnect", function(){
      console.log('disconnect'); 
      var removePlayer = find_playerid(this.id);
      var clave=removePlayer.color;
      var str=clave+"_food";
      if (removePlayer) {
        player_lst.splice(player_lst.indexOf(removePlayer), 1);
      }
      console.log("removing player " + this.id);
      sortPlayerListByScore();
      //send message to every connected client except the sender
      socket.broadcast.emit('remove_player', {id: this.id});
      var arr=game_instance.food_pickup;
      for (var i = 0; i < arr.length; i++) {
        var b=arr[i];
        if (b.type == str) {
          socket.broadcast.emit("itemremove", b);
        }
      }


    }); //fin disconnect

    

});//FIN DE CONNECTION  

//find player by the the unique socket id 
function find_playerid(id) {
  if (player_lst.length>0){
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
  this.size = 30; 
  this.angle=angle;
  this.dead=false;
}


var foodpickup = function (max_x, max_y, type, id) {
  this.x =getRandomArbitrary(1, max_x)  ;
  this.y =getRandomArbitrary(1, max_y) ;
 // console.log("x e y ", this.x, ", ", this.y);
  this.type = type; 
  //console.log("this ", this);
  this.id = id; 
 
}


// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function find_food (id) {
  //el id que me llega no tiene nada que ver con el id que tienen las comidas
  var arr=game_instance.food_pickup;
 // console.log("arr ",arr);
  //console.log("arr.length ", arr.length);

  for (var i = 0; i < arr.length; i++) {
    if (game_instance.food_pickup[i].id == id) {
      return game_instance.food_pickup[i]; 
    }
  }
  
  return false;
}


// when the player enters their name, trigger this function
function onEntername (data) {
  this.emit('join_game', {username: data.username, id: this.id});
}


function sortPlayerListByScore() {
  player_lst.sort(function(a,b) {
    return b.size - a.size;
  });
  
  var playerListSorted = [];
  for (var i = 0; i < player_lst.length; i++) {
    // send the player username to the client so that clients can update the leaderboard.
    playerListSorted.push({id: player_lst[i].id, username: player_lst[i].username, size: player_lst[i].size});
  }
  
  io.emit("leader_board", playerListSorted);
}