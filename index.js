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

var colores=[];
colores[0]='orange_player'//"0xFF8000";
colores[1]='violet_player'//"0xBF00FF";
colores[2]='yellow_player'//"0xFFFF00";
colores[3]='red_player'//"0xFF0000";
colores[4]='green_player'//"0x64FE2E";
colores[5]='blue_player'//"0x08088A";
colores[6]='pink_player'//"0xFF00BF";
var coloresP=[]
coloresP[0]='black_player'
coloresP[1]='grey_player'
coloresP[2]='brown_player'



//needed for physics update 
var startTime = (new Date).getTime();
var lastTime;
var timeStep= 1/70; 
//get the node-uuid package for creating unique id
var unique=require('node-uuid');

var game_setup = function() {
  //food object list
  this.food_pickup = [];
  //game size height
  this.canvas_height =4000;//2000;
  //game size width
  this.canvas_width =4000;//2000; 
}

// createa a new game instance
var game_instance = new game_setup();
var posx=451;
var posy=377;
var ladrones=0;
var policias=0;
var apresados=0;
const maxPX=633;
const minPX=267;
const maxPY=502;
const minPY=237;
const max_banderas=30;
const puntos_banderin=15;
const puntos_prision=-5
const puntos_atrapar=20;
const puntos_liberar=5;
var pagina;

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
  pagina=res;
 // console.log(pagina);
 
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

//mantiene el último ID asignado
http.lastPlayerID=0;
http.lastPolID=0;

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

io.on('connection', function(socket){
  // when the player enters their name, trigger this function
  socket.on('enter_name', function(data){
    var usrname;
    if(data.username.length==0 || data.username=="" || data.username==" " || data.username[0]==" "){
      temp=(this.id).toString();
      temp=temp[1]+temp[2]+temp[3]+temp[4]+temp[5]+"#";
      usrname="plyr_"+temp;
    }else{
      usrname=data.username;
    }
    if(data.tipo_jugador=="lad"){
      //console.log("soy ladron");
      ladrones=ladrones+1;
      // if(ladrones>=3){
      //   socket.broadcast.emit("toggle", {valor:true});
      // }
      console.log("ladrones "+ladrones);
    }else{
      console.log("soy policia");
      policias=policias+1;
      console.log("policias "+policias);
    }
    socket.emit('join_game', {username: usrname, tipo:data.tipo_jugador, id: this.id});
    //login
  }); 



  console.log('a user connected, ID: ', http.lastPlayerID);
  //socket.on: permite especificar callbacks para manejar diferentes mensajes
  socket.on('new_player', function(data) {
      console.log("index.js new_player. Player name= "+data.username);
      //new player instance
      var newPlayer = new Player(data.x, data.y, data.angle);
      var c;
      newPlayer.id = this.id;  /*console.log(newPlayer.id);*/
      newPlayer.username = data.username;
      newPlayer.tipo=data.tipo;
      newPlayer.puntos=0;

      if(data.tipo=="lad"){ //es ladron
        c = http.lastPlayerID%7;
        newPlayer.color=colores[c];
        http.lastPlayerID++;
      }else{ //es policia
        c=http.lastPolID%3;
        newPlayer.color=coloresP[c];
        http.lastPolID++;
      }
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

      socket.emit('create_player', {x: newPlayer.x, y: newPlayer.y, id: newPlayer.id, color:newPlayer.color, size:newPlayer.size, username:newPlayer.username, tipo:newPlayer.tipo, preso:false, puntos:newPlayer.puntos});
     
      //information to be sent to all clients except sender
      var current_info = {
        id: newPlayer.id, 
        x: newPlayer.x,
        y: newPlayer.y,
        color:newPlayer.color,
        angle:newPlayer.angle, 
        size: newPlayer.size,
        username: newPlayer.username,
        tipo: newPlayer.tipo,
        preso: false, 
        puntos: newPlayer.puntos
      };

     
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
            size: existingPlayer.size,
            tipo: existingPlayer.tipo,
            preso: existingPlayer.preso,
            puntos: existingPlayer.puntos
        };
        // send message to the sender-client only
         //me llega la info de cada jugador existente antes que "yo"
        socket.emit("new_enemyPlayer", player_info);
      }//END DEL FOR
      
      player_lst.push(newPlayer); //console.log(player_lst.length);
      
      //banderas del resto
      for (j = 0; j < game_instance.food_pickup.length; j++) {
          var food_pick = game_instance.food_pickup[j];
          socket.emit('item_update', food_pick); 
      }


       //a todos los jugadores existentes excepto a mí, les mando mi info
      socket.broadcast.emit('new_enemyPlayer', current_info);

      //se crean banderitas propias solo si soy ladron
      if(data.tipo=="lad"){
        for (var i = 0; i < max_banderas; i++) { 
            //create the unique id using node-uuid
            var unique_id = unique.v4(); 
            var str_clr=newPlayer.color+"_food";
                     
            var foodentity = new foodpickup(2500, 2500, str_clr/*'food'*/, unique_id);
            game_instance.food_pickup.push(foodentity); 
            //set the food data back to client
            socket.emit("item_update", foodentity); 
            socket.broadcast.emit("item_update", foodentity);
        }
        //ladrones+=1;
        //gameProperties.cantL=ladrones;
      }
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
  }); //FIN 'new_player'------------------------------------------------------------
 

      //listen for new player inputs. 
      socket.on("input_fired", function(data) {
          var movePlayer = find_playerid(this.id/*, this.room*/); 
          if (!movePlayer|| movePlayer.dead){/*console.log("entra aca");*/ return;}
          //when sendData is true, we send the data back to client. 
          if (!movePlayer.sendData) {
            //console.log("en verdad entro aca");
            return;
          }

          //if(data.preso){
           //   movePlayer.reset(data.x, data.y);
          //}else{
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
              if(physicsPlayer.distanceToPointer(movePlayer, serverPointer) <=30) {
                movePlayer.playerBody.angle = physicsPlayer.movetoPointer(movePlayer, 0, serverPointer, 1000);
              }else{
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
          //}
  }); //fin input fired


  socket.on('item_picked', function(data){
      var movePlayer = find_playerid(this.id); 
      var object = find_food(data.id);  
      if (!object) {
        console.log(data);
        console.log("could not find object");
        return;
      }
      game_instance.food_pickup.splice(game_instance.food_pickup.indexOf(object), 1);
      movePlayer.puntos=movePlayer.puntos+puntos_banderin; //por ahora +1, despues se vera
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
      //comunicar a todos los jugadores, incluyéndome
      socket.emit('itemremove', object);
      socket.broadcast.emit('itemremove', object); 

      /* preguntar por todos los jugadores, si están todos listos, ganaron*/

  }); //fin item picked

//------------------------------------------------------------COLISION
  //Esto en el caso de chocar con un policia
  socket.on("player_collision", function(data){
    var movePlayer = find_playerid(this.id);  //ladronciño
    var enemyPlayer = find_playerid(data.id); //policiña
    var equis=Math.random() * (maxPX - minPX) + minPX;
    var ygriega=Math.random() * (maxPY - minPY) + minPY;
    movePlayer.puntos+=puntos_prision;
    enemyPlayer.puntos+=puntos_atrapar;
    movePlayer.preso=true;
    apresados=apresados+1;
    //if apresados==ladrones --> fin del juego, ganan los policias
    socket.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("leader_board",sortPlayerListByScore());
    socket.emit("salto", {x:equis, y:ygriega});//al ladron
    socket.broadcast.emit("player_reset",{id:this.id, x:equis, y:ygriega});

  }); //fin player collision

  socket.on("liberar_prisioneros", function(){
    var movePlayer=find_playerid(this.id);
    var presos=0;
    if (player_lst.length>0){
      for (var i = 0; i < player_lst.length; i++) {
        if (player_lst[i].preso){
          presos=presos+1; 
        }
      }
    }
    console.log("presos "+presos);
    movePlayer.puntos=movePlayer.puntos+presos*puntos_liberar;
    socket.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("liberar", {x:723, y:476}); //para todos los demas
    socket.emit("liberados",{cant:presos}); //para el q libero
  });


  socket.on("salir_de_prision", function(){
    var movePlayer=find_playerid(this.id);
    movePlayer.preso=false;
    socket.broadcast.emit("player_reset", {id:this.id, x:723, y:476});
  });

  socket.on("pregunta", function(){
    if(ladrones>=3 && policias<3){
      // console.log("emito habilitar"); //habilito policias
      socket.broadcast.emit("habilitar");
      if(policias==0){
        socket.broadcast.emit("des_ladrones");
      }else{
        if(ladrones<7){
          socket.broadcast.emit("hab_ladrones");
        }
      }
    }else{//si los ladrones son pocos y los policias muchos, deshabilito polis
      // console.log("emito deshabilitar");
      socket.broadcast.emit("deshabilitar");
    }
    if(ladrones==5 && policias==1){
      socket.broadcast.emit("des_ladrones");
    }
    if(ladrones==7 && policias==3){
      socket.broadcast.emit("sala_llena");
    }else{
      socket.broadcast.emit("sala_libre");
    }
    if(policias==3){
      socket.broadcast.emit("deshabilitar");
    }

  });


    //call when a client disconnects and tell the clients except sender to 
    //remove the disconnected player
     socket.on("disconnect", function(){
      console.log('disconnect'); 
      var removePlayer = find_playerid(this.id);
      var clave=removePlayer.color;
      var str=clave+"_food";
      if (removePlayer) {
        if(removePlayer.tipo=="lad"){
          ladrones=ladrones-1;
          // if(ladrones<3){
          //   socket.broadcast.emit("toggle", {valor:false});
          // }
          console.log("ladrones: "+ladrones);
        }else{
          console.log("remuevo policia");
          policias=policias-1;
          console.log("policias: "+policias);
        }
        player_lst.splice(player_lst.indexOf(removePlayer), 1);
      }
      socket.broadcast.emit('remove_player', {id: this.id});
      console.log("removing player " + this.id);
      //send message to every connected client except the sender
      var arr=game_instance.food_pickup;
      for (var i = 0; i < arr.length; i++) {
        var b=arr[i];
        if (b.type == str) {
          socket.broadcast.emit("itemremove", b);
        }
      }
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
    }); //fin disconnect
});//FIN DE CONNECTION  

//find player by the the unique socket id 
function find_playerid(id) {
  if (player_lst.length>0){
    //console.log("id del primero en la lista" + player_lst[0].id);
    for (var i = 0; i < player_lst.length; i++) {
      if (player_lst[i].id == id) {
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
  var bandera=false
  var ex, guay;
  while(!bandera){
    ex=getRandomArbitrary(1, max_x);
    guay =getRandomArbitrary(1, max_y);
    if(ex<(minPX-5) || ex>(maxPX+5) || guay<(minPY-5)|| guay>(maxPY+5)){
      bandera=true
    }
  }
  this.x =ex;
  this.y =guay;
  this.type = type; 
  this.id = id; 
}


// Retorna un número aleatorio entre min (incluido) y max (excluido)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function find_food (id) {
  //el id que me llega no tiene nada que ver con el id que tienen las comidas
  var arr=game_instance.food_pickup;
  for (var i = 0; i < arr.length; i++) {
    if (game_instance.food_pickup[i].id == id) {
      return game_instance.food_pickup[i]; 
    }
  }
  
  return false;
}

function sortPlayerListByScore() {
  player_lst.sort(function(a,b) {
    return b.puntos - a.puntos;
  });
  
  var playerListSorted = [];
  for (var i = 0; i < player_lst.length; i++) {
    // send the player username to the client so that clients can update the leaderboard.
    playerListSorted.push({id: player_lst[i].id, username: player_lst[i].username, puntos: player_lst[i].puntos});
  }
  return playerListSorted;
  //this.emit("leader_board", playerListSorted);
}

function hola(){
  return 5;
}