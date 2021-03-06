var express = require('express');
var app = express();
var http = require('http').Server(app);//server
var io = require('socket.io')(http);
var player_lst = [];
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

var dispL=[];
dispL[0]=true; //na
dispL[1]=true; //vi
dispL[2]=true; //am
dispL[3]=true; //roj
dispL[4]=true; //ve
dispL[5]=true; //az
dispL[6]=true; //ros

var dispP=[];
dispP[0]=true; //ne
dispP[1]=true; //gr
dispP[2]=true; //ma

var recolectados=[];

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
  this.canvas_height =4000;
  //game size width
  this.canvas_width =4000;
}

// create a new game instance
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
const max_banderas=20;
const puntos_banderin=5;
const puntos_atrapar=20;
const puntos_liberar=5;
var listos = false;



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
      if(data.username.length>14){
        var temp=data.username;
        usrname="";
        for(var i=0; i<14; i++){
          usrname=usrname+temp[i];
        }
        usrname=usrname+"#";
      }else{
        usrname=data.username;
      }
    }
    if(data.tipo_jugador=="lad"){
      if((ladrones>=3 && policias==0) || (ladrones==5 && policias==1) || (ladrones==7)){
        socket.emit('not_join_game', {msg:"error"});
        return;
      }
      ladrones=ladrones+1;
    }else{
      if( ladrones<3 || policias==3 ){
        socket.emit('not_join_game', {msg:"error"});
        return;
      }
      policias=policias+1;
    }
    socket.emit('join_game', {username: usrname, tipo:data.tipo_jugador, id: this.id});
    //login

    socket.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("leader_board",sortPlayerListByScore());
  }); 



  console.log('a user connected, ID: ', http.lastPlayerID);
  //socket.on: permite especificar callbacks para manejar diferentes mensajes
  socket.on('new_player', function(data) {
      //new player instance
      var newPlayer = new Player(data.x, data.y, data.angle);
      var c;
      newPlayer.id = this.id;  
      newPlayer.username = data.username;
      newPlayer.tipo=data.tipo;
      newPlayer.puntos=0;
      if(data.tipo=="lad"){ //es ladron
        c = http.lastPlayerID%7;
        var i=0;
        var bandera=false;
        while(!bandera && i<7){
          if(dispL[i]){
            bandera=true;
            c=i;
            dispL[i]=false;
          }
          i=i+1;
        }
        newPlayer.listo=false;
        newPlayer.color=colores[c];
        recolectados[newPlayer.color]=0;
        http.lastPlayerID++;
      }else{ //es policia
        var i=0;
        var bandera=false;
        c=http.lastPolID%3;
        while(!bandera && i<3){
          if(dispP[i]){
            bandera=true;
            c=i;
            dispP[i]=false;
          }
          i=i+1;
        }
        newPlayer.color=coloresP[c];
        http.lastPolID++;
      }
     
      playerBody = new p2.Body ({
        mass: 0,
        position: [0,0],
        fixedRotation: true
      });

      newPlayer.playerBody = playerBody;
      world.addBody(newPlayer.playerBody); 
      
      socket.emit('create_player', {x: newPlayer.x, y: newPlayer.y, id: newPlayer.id, color:newPlayer.color, size:newPlayer.size, username:newPlayer.username, tipo:newPlayer.tipo, preso:false, puntos:newPlayer.puntos});
     
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

     
      //el nuevo se entera de los demas
      for (i = 0; i < player_lst.length; i++) {
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
         //me llega la info de cada jugador existente antes que "yo"
        socket.emit("new_enemyPlayer", player_info);
      }//END DEL FOR
      
      player_lst.push(newPlayer); 
      
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
        
            socket.emit("item_update", foodentity); 
            socket.broadcast.emit("item_update", foodentity);
        }
      }
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
  }); //FIN 'new_player'------------------------------------------------------------
 

      
      socket.on("input_fired", function(data) {
          var movePlayer = find_playerid(this.id); 
          if (!movePlayer|| movePlayer.dead){ return;}
          //when sendData is true, we send the data back to client. 
          if (!movePlayer.sendData) {
            return;
          }
              setTimeout(function() {movePlayer.sendData = true}, 50);
              //we set sendData to false when we send the data. 
              movePlayer.sendData = false;
              //Make a new pointer with the new inputs from the client. 
              //contains player positions in server
              var serverPointer = {
                
                worldX: data.pointer_worldx,    
                worldY: data.pointer_worldy
              }
              //moving the player to the new inputs from the player
              // console.log(movePlayer.playerBody);
              if(physicsPlayer.distanceToPointer(movePlayer, serverPointer) <=30) {
                /*movePlayer.playerBody.angle = */physicsPlayer.movetoPointer(movePlayer, 0, serverPointer, 1000);
              }else{
                /*movePlayer.playerBody.angle =*/ physicsPlayer.movetoPointer(movePlayer, movePlayer.speed, serverPointer); 
              }

              movePlayer.x = movePlayer.playerBody.position[0]; 
              movePlayer.y = movePlayer.playerBody.position[1];

             //new player position to be sent back to client. 
             var info = {
                id:movePlayer.id,
                x: movePlayer.playerBody.position[0], 
                y: movePlayer.playerBody.position[1],
              /*  angle: movePlayer.playerBody.angle*/
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
      recolectados[movePlayer.color]++;
      game_instance.food_pickup.splice(game_instance.food_pickup.indexOf(object), 1);
      movePlayer.puntos=movePlayer.puntos+puntos_banderin;
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
      //comunicar a todos los jugadores, incluyéndome
      socket.emit('itemremove', object);
      socket.broadcast.emit('itemremove', object); 
  }); //fin item picked

//------------------------------------------------------------COLISION
  //Esto en el caso de chocar con un policia
  socket.on("player_collision", function(data){
    var movePlayer = find_playerid(this.id);  //ladron
    var enemyPlayer = find_playerid(data.id); //policia
    var equis=Math.random() * (maxPX - minPX) + minPX;
    var ygriega=Math.random() * (maxPY - minPY) + minPY;
    enemyPlayer.puntos+=puntos_atrapar;
    movePlayer.preso=true;
    apresados=apresados+1;
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
    apresados=0;
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
      socket.emit("habilitar");
      if(policias==0){
        socket.emit("des_ladrones");
      }else{
        if(ladrones<7){
          socket.emit("hab_ladrones");
        }
      }
    }else{//si los ladrones son pocos y los policias muchos, deshabilito polis
      socket.emit("deshabilitar");
    }

    if(ladrones==5 && policias==1){
      socket.emit("des_ladrones");
    }
    if(ladrones==7 && policias==3){
      socket.emit("sala_llena");
    }else{
      socket.emit("sala_libre");
    }
    if(policias==3){
      socket.emit("deshabilitar");
    }
    if(ladrones==7){
      socket.emit("des_ladrones");
    }

  });

  socket.on("listo", function(){
    //solo los ladrones pueden emitir esto
    var movePlayer=find_playerid(this.id);
    if(recolectados[movePlayer.color]==max_banderas){
      movePlayer.listo=true;
      listos=listos+1;
    }
  });

  socket.on("final", function(){
    var tl=true;
    var i=0;
    var hayladrones=false;
    var largo=player_lst.length;

    while(i<largo && tl){
      if(player_lst[i].tipo=="lad"){
        hayladrones=true;
        if(!(player_lst[i].listo)){
            tl=false;
        }
      }
      
        i=i+1;
    }
    if(!hayladrones){
      socket.emit("leader_board",sortPlayerListByScore());
      socket.broadcast.emit("leader_board",sortPlayerListByScore());
      socket.emit("ganan_P");
      socket.broadcast.emit("ganan_P");
    }else{
        //ver si ganan polis
        if(apresados==ladrones){
          socket.emit("leader_board",sortPlayerListByScore());
          socket.broadcast.emit("leader_board",sortPlayerListByScore());
          socket.emit("ganan_P");
          socket.broadcast.emit("ganan_P");
        }else{
          if(tl){
            console.log("todos listos");
            socket.emit("leader_board",sortPlayerListByScore());
            socket.broadcast.emit("leader_board",sortPlayerListByScore());
            socket.emit("ganan_L");
            socket.broadcast.emit("ganan_L");
        }
      }
    }
  });

  socket.on("terminar", function(){
    var removePlayer = find_playerid(this.id);
    var clave=removePlayer.color;
    var str=clave+"_food"; 
    var comiditas=game_instance.food_pickup;
    let largo = comiditas.length-1;
    if(removePlayer.tipo=="lad"){
      for(i=largo; i>=0; i--){
        var banderin=comiditas[i];
        if(banderin.type==str){
          socket.broadcast.emit("itemremove", banderin);
          comiditas.splice(i, 1);
        }
      }
    }
    player_lst.splice(player_lst.indexOf(removePlayer), 1);
    socket.emit('eliminar_jugador_local', {id: this.id});
    socket.broadcast.emit('remove_player', {id: this.id});

    largo_L=dispL.length;
    largo_P=dispP.length;
    for(i=0; i<largo_L; i++){
      dispL[i]=true;
    }
    for(i=0; i<largo_P; i++){
      dispP[i]=true;
    }

    listos=false;
    ladrones=policias=apresados=0;

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
        if(removePlayer.preso){
          apresados=apresados-1;
        }
      }else{
        policias=policias-1;
      }
      player_lst.splice(player_lst.indexOf(removePlayer), 1);
    }
    //send message to every connected client except the sender
    var comiditas=game_instance.food_pickup;
    let largo = comiditas.length-1;
   
    if(removePlayer.tipo=="lad"){
      for(i=largo; i>=0; i--){
        var banderin=comiditas[i];
        if(banderin.type==str){
          socket.broadcast.emit("itemremove", banderin);
          comiditas.splice(i, 1);
        }
      }
      var encontre=false;
      var j=0;
      while(!encontre && j<7){
        if(clave==colores[j]){
          encontre=true;
          dispL[j]=true;
        }
        j=j+1;
      }
    }else{
      var encontre=false;
      var j=0;
      while(!encontre && j<3){
        if(clave==coloresP[j]){
          encontre=true;
          dispP[j]=true;
        }
        j=j+1;
      }
    }
    socket.broadcast.emit('remove_player', {id: this.id});
    console.log("removing player " + this.id);
    //socket.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("leader_board",sortPlayerListByScore());
    socket.broadcast.emit("final"); //para ver si finalizó el juego gracias al que se fue
   }); //fin disconnect
});//FIN DE CONNECTION  

//find player by the the unique socket id 
function find_playerid(id) {
  if (player_lst.length>0){
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
  this.sendData = true;
  this.size = 30; 
  this.angle=angle;
  this.dead=false;
}


var foodpickup = function (max_x, max_y, type, id) {
  var bandera=false
  var ex, guay;
  var delta=25;
  while(!bandera){
    ex=getRandomArbitrary(1, max_x);
    guay =getRandomArbitrary(1, max_y);
    if(ex<(minPX-delta) || ex>(maxPX+delta) || guay<(minPY-delta)|| guay>(maxPY+delta)){
      if(ex>(16+delta) && ex<(2544-delta) && guay>(16+delta) && guay<(2544-delta)){
        bandera=true
      }
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
    playerListSorted.push({id: player_lst[i].id, username: player_lst[i].username, puntos: player_lst[i].puntos});
  }
  return playerListSorted;
}
