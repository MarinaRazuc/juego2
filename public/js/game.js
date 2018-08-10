var ship;
var cursors;
var customBounds;
var map;
var layer,layer2;
var username;
var leader_text;
var ranking;

var gameProperties = { 
	gameWidth: window.innerWidth * window.devicePixelRatio,
	gameHeight: window.innerHeight * window.devicePixelRatio,
	game_elemnt: "gameDiv",
	in_game: false
};

var posx=451;
var posy=377;
var players;
var id_tile;
var bounds;
var speed = 80;
var score = 0;
var scoreText;
var Game={};
var colores=[];
colores[0xFF8000]='orange_player';
colores[0xBF00FF]='violet_player';
colores[0xFFFF00]='yellow_player';
colores[0xFF0000]='red_player';
colores[0x64FE2E]='green_player';
colores[0x08088A]='blue_player';
colores[0xFF00BF]='pink_player';
colores[0x151515]='black_player';
colores[0x6E6E6E]='grey_player';
colores[0x54451E]='brown_player';

var violet_food, orange_food, green_food, blue_food, red_food, pink_food, yellow_food;

//the enemy player list 
var enemies = [];
var food_pickup=[];
var customBounds;
var USERNAME;
var TIPO_J;
var test;
var paredes;

var listo=false;
var bandlev=0;
const max_banderas=20;
const puntos_banderin=5;
const puntos_atrapar=20;
const puntos_liberar=5;

Game.init=function(username, tipo){
	
	USERNAME=username;
	TIPO_J=tipo;
	game.stage.disableVisibilityChange=true;
	game.physics.startSystem(Phaser.Physics.P2JS);
	
};


Game.preload=function(){
		game.load.tilemap('mapa', '/assets/Mapa_5.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('tiles', '/assets/PathAndObjects.png');
		game.load.image('tiles', '/assets/castle_tileset_part3.png');

		game.load.image('violet_player', '/assets/circulo_violeta.png');
		game.load.image('orange_player', '/assets/circulo_naranja.png');
		game.load.image('red_player', '/assets/circulo_rojo.png');
		game.load.image('blue_player', '/assets/circulo_azul.png');
		game.load.image('green_player', '/assets/circulo_verde.png');
		game.load.image('pink_player', '/assets/circulo_rosa.png');
		game.load.image('yellow_player', '/assets/circulo_amarillo.png');
		game.load.image('black_player', '/assets/circulo_negro.png');
		game.load.image('grey_player', '/assets/circulo_gris.png');
		game.load.image('brown_player', '/assets/circulo_marron.png');

		game.load.image('violet_player_food', '/assets/banderinVioleta2.png');
		game.load.image('orange_player_food', '/assets/banderinNaranja2.png');
		game.load.image('blue_player_food', '/assets/banderinAzul2.png');
		game.load.image('yellow_player_food', '/assets/banderinAmarillo2.png');
		game.load.image('green_player_food', '/assets/banderinVerde2.png');
		game.load.image('pink_player_food', '/assets/banderinRosa2.png');
		game.load.image('red_player_food', '/assets/banderinRojo2.png');

		game.load.image('pared', '/assets/castleCenter_1.png');
		game.load.image("prison", "/assets/prison_2.png");
		game.load.image("prison1", "/assets/p_arriba.png");
		game.load.image("prison2", "/assets/p_abajo.png");
		game.load.image("prison3", "/assets/p_derecha.png");
		game.load.image("prison4", "/assets/p_izquierdo.png");
		game.load.image("llave", "/assets/llave2.png");

		game.physics.p2.restitution = 0.3;	
		game.physics.p2.gravity.y = 0;
		game.physics.p2.applyGravity = false; 
		game.physics.p2.enableBody(game.physics.p2.walls, true);
}

Game.create=function() {
	game.time.advancedTiming = true;
	game.world.setBounds(0, 0, window.innerHeight * window.devicePixelRatio+10, window.innerWidth * window.devicePixelRatio+10);
	map = game.add.tilemap('mapa');
	map.addTilesetImage('castle_tileset_part3', 'tiles');
	map.addTilesetImage('PathAndObjects', 'tiles');
	Capa_1 = map.createLayer('Capa_1');
	Capa_1.resizeWorld();
	var width = this.game.width;
    var height = this.game.height;

	// para trackear a los jugadores
    Game.playerMap={};
    var prison1, prison2, prison3, prison4;
    prison1=game.add.sprite(450, 205, "prison1");
    prison2=game.add.sprite(450, 532, "prison2");
    prison3=game.add.sprite(660, 368, "prison3");
    prison4=game.add.sprite(235, 365, "prison4");

    game.physics.p2.enable(prison1);
    game.physics.p2.enable(prison2);
    game.physics.p2.enable(prison3);
    game.physics.p2.enable(prison4);

    prison1.body.kinematic = true;
    prison2.body.kinematic = true;
    prison3.body.kinematic = true;
    prison4.body.kinematic = true;
  
	var sitio=game.add.sprite(200,300,"pared");
	game.add.sprite(162,264,"llave");
    game.physics.p2.enable(sitio, Phaser.Physics.p2);
   	sitio.body.data.shapes[0].sensor=true;
    sitio.type="sitio";
    sitio.body.type="sitio";

//---------------------------------------------------------------

    socket.on('move',function(data){//data es socket.player
    	Game.movePlayer(data.id, data.x, data.y);
	});

	// socket.on('remove',function(id){
	//     Game.removePlayer(id);
	// });

	socket.on("enemy_move", function(data){
	    Game.onEnemyMove(data); 
	});
	socket.on("input_rec", function(data){ 
	  Game.onInputRecieved(data);
	});

	socket.on("new_enemyPlayer", function(data){
	    Game.onNewPlayer(data);
	});

	socket.on("create_player", function(data){
		Game.create_player(data);
	});

	socket.on("item_update", function(data){
	  Game.onItemUpdate(data);
	});

	socket.on("itemremove", function(data){
	  Game.onItemRemove(data);
	});

	socket.on("remove_player", function(data){
	  Game.onRemovePlayer(data);
	});

	socket.on("enter_game", function(data){
	  Game.logueado({username: data.username});
	});

	socket.on("leader_board", function(data){
	  Game.lbupdate(data);
	});

	// socket.on("puntos", function(){
	//   Game.aumentar();
	// });

	socket.on('salto', function(data){
	  Game.saltar({x:data.x, y:data.y});
	});

	socket.on('liberar', function(data){
	  Game.Liberar(data);
	});

	socket.on("liberados", function(data){
	  Game.aumentar({presos: data.cant});
	});

	socket.on('player_reset', function(data){
	  Game.resetear({id: data.id, x:data.x, y:data.y});
	});

	socket.on("ganan_L", function(){
		console.log("Ganan ladrones");
		mostrarCartel("Ladrones");
	});

	socket.on("ganan_P", function(){
		console.log("Ganan policias");
		mostrarCartel("Policías");
	});

	socket.on("final", function(){
		socket.emit("final");
	});
    socket.on('eliminar_jugador_local', function(data){
    	eliminarLocal(data);
    });

//------------------------------------------------------------



	createLeaderBoard();
	Client.askNewPlayer({username: USERNAME, tipo:TIPO_J, x:0, y:0, angle:0}); 
	
};

Game.update=function(){
	if(player){
		 if(!player.preso){
			Client.moverJugador(game.input.mousePointer);
		 }

	}
};

 


//Server tells us there is a new enemy movement. We find the moved enemy and sync the enemy movement with the server
Game.onEnemyMove=function(data) {
	var movePlayer = findplayerbyid (data.id); 
	if (!movePlayer) {return;}
	var newPointer = {
		x: data.x,
		y: data.y, 
		worldX: data.x,
		worldY: data.y
	}
	var distance = distanceToPointer(movePlayer.player , newPointer);
	speed = distance/0.05;
	movePlayer.rotation = movetoPointer(movePlayer.player , speed, newPointer); //error cannot get velocity of null
};


//we're receiving the calculated position from the server and changing the player position
Game.onInputRecieved=function(data) {
	if(!player.preso){
		if(player==null){return;}
	 	var newPointer = {
			x: data.x,
			y: data.y, 
			worldX: data.x,
			worldY: data.y, 
		}
		var distance = distanceToPointer(player, newPointer);
		//we're receiving player position every 50ms. We're interpolating 
		//between the current position and the new position so that player
		//does jerk. 
		speed = distance/0.05;
		player.rotation = movetoPointer(player, speed, newPointer);
		var equis=Math.round(player.x);
		var ygriega=Math.round(player.y);
		document.getElementById("MiPos").innerHTML="Mi posición: "+equis+" "+ygriega;
	}

};
function constrainVelocity( maxVelocity,speed) {       
	if (speed > maxVelocity) {        
		return maxVelocity;
	}	
	return speed;
};

//This is where we use the socket id. 
//Search through enemies list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].id == id) {
			return enemies[i]; 
		}
	}
};

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
//onNewPlayer sólo se llama cuando hay enemigos
Game.onNewPlayer= function(data) {
	var new_enemy = new remote_player(data.id, data.x, data.y, data.color, /*data.size,*/ data.angle, data.tipo, data.preso, data.puntos, data.username); 
	enemies.push(new_enemy);
};


//clase enemiga
var remote_player = function(id, startx, starty, color, /*startSize,*/ startAngle, type, preso, puntos, username){
	this.x = startx; 
	this.y = starty; 
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id; 
	this.angle = startAngle;
	this.player=game.add.sprite(this.x, this.y, color);
	this.player.type = "player_body"; //para colisiones
	if(game.physics.p2==null){
		Game.preload();
	}
	game.physics.p2.enable(this.player, Phaser.Physics.p2);
	this.player.body.collideWorldBounds = true;
	this.player.body.clearShapes();
	this.player.body.setCircle(16);
	this.player.kinematic=true;
	//this.player.body.data.shapes[0].sensor = true;
	this.player.id=id;
	this.preso=preso;
	this.puntos=puntos; 
	var style = {fill: "black", align: "center", fontSize:'18px'};
	this.player.playertext = game.add.text(0, 0, username , style);
	this.player.addChild(this.player.playertext);
};	


Game.create_player=function(data){ 
	player=null;
	id_jugador=data.id;
	color_jugador=data.color;
	player = game.add.sprite(1200, 300, color_jugador); 
	//player.scale.set(2);
	player.smoothed=false;
	game.physics.p2.enable(player);
    player.body.setCircle(16);
	player.type = "player_body"; //necesario para las colisiones
	player.preso=data.preso;
	player.puntos=data.puntos;
	player.kinematic=true;
	//camera follow
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);	
	player.body.onBeginContact.add(player_coll, this); 
	var style = {fill: "white", align: "right", fontSize:'20px'};
	player.playertext = game.add.text(0, 0, data.username , style);
	player.addChild(player.playertext);

};

Game.onItemUpdate=function(datos){
	var nuevo_banderin=new food_object(datos.id, datos.type, datos.x, datos.y);
	food_pickup.push(nuevo_banderin);
};



// the food class
var food_object = function (id, type, startx, starty) {
	//generated in the server with node-uuid
	this.id = id; 
	this.posx = startx;  
	this.posy = starty; 
	this.type=type;
	this.item = game.add.sprite(startx, starty, type); 
	game.physics.p2.enable(this.item, Phaser.Physics.p2);
	this.item.body.collideWorldBounds = true;
	this.item.body.data.shapes[0].sensor = true;
	this.item.id=id;
	game.physics.p2.enableBody(this, true);
}


// function called when food needs to be removed in the client. 
Game.onItemRemove=function(data) {
	var removeItem; 
	removeItem = finditembyid(data.id);
	if(removeItem){
		food_pickup.splice(food_pickup.indexOf(removeItem), 1); 
		//destroy the phaser object 
		removeItem.item.destroy(true,false); 
	}
}


function player_coll (body, bodyB, shapeA, shapeB, equation){//siempre para los ladrones
	var key_player=player.key; 
	var banderin=false;

	if(body!=null){ //cuando body es null, te chocaste la pared
					//body es el cuerpo que te chocas
		if(body.data.parent.sprite!=null){
			//the id of the collided body that player made contact with 
			var key=body.data.parent.sprite.body.sprite.body.sprite.id;
			//the type of the body the player made contact with 
			var type = body.type; 
			var tipobody=body.sprite.key; //comida
			var tipobodyB=bodyB.parent.sprite.key; //jugador

			if((key_player=="orange_player" && tipobody=="orange_player_food")||
				(key_player=="red_player" && tipobody=="red_player_food")||
				(key_player=="yellow_player" && tipobody=="yellow_player_food")||
				(key_player=="green_player" && tipobody=="green_player_food")||
				(key_player=="pink_player" && tipobody=="pink_player_food")||
				(key_player=="blue_player" && tipobody=="blue_player_food")||
				(key_player=="violet_player" && tipobody=="violet_player_food")){

				score=score+1;
				this.puntos=this.puntos+puntos_banderin;
				Client.levantarBanderin({id:key}); 
				document.getElementById("score").innerHTML="Banderines: "+score;
				banderin=true;
				bandlev=bandlev+1;
				if(bandlev==max_banderas){
					listo=true;
					//enviar al servidor que está listo.
					//console.log("Junté todos mis banderines.");
				}
					Client.listo();
					Client.final();
			}
			//Acá ver colisión entre ladron y poli
			if(!banderin){
				 if((tipobody=="black_player" || tipobody=="grey_player"|| tipobody=="brown_player")&&
				 	(key_player=="orange_player"||key_player=="violet_player"||key_player=="yellow_player"||
				 	key_player=="red_player"||key_player=="blue_player"||key_player=="pink_player"||key_player=="green_player"))
				 	{
				 		banderin=true;
				 		document.getElementById('prison').style.display='block';
				 		Client.colision({key:body.sprite.id});
				 		//el servidor tiene que ver la relacion entre ladrones y presos
				 		//y determinar si polis ganan juego o no
				 		Client.final();
				 		
				 	}
			}
			if(tipobody=="prison"){
				
			}
		
			if(tipobody=="pared" && 
				(key_player=="orange_player" || key_player=="red_player" || key_player=="violet_player" ||
					key_player=="pink_player" || key_player=="green_player" || key_player=="yellow_player"||
					key_player=="blue_player"))
			{
				console.log("Liberando prisioneros...");
				Client.liberar();
			}
		}
	}
};


Game.Liberar=function(data){
	if(player.preso){
		player.preso=false;
		this.preso=false;
		document.getElementById('prison').style.display='none';
		player.reset(data.x,data.y);
		Client.salir_de_prision();
		
	}

};

Game.aumentar=function(data){
	console.log("aumente puntos por liberar jugadores: "+data.presos);
	this.puntos=this.puntos+puntos_liberar*data.presos;
};

// Cuando el servidor avisa que un cliente se desconectó, 
//se busca el enemigo desconectado y se lo remmueve del juego
Game.onRemovePlayer=function(data) {
	var removePlayer = findplayerbyid(data.id);
	// Player not found
	if (!removePlayer) {
		console.log('Player not found: ', data.id)
		return;
	}
	removePlayer.player.destroy();
	enemies.splice(enemies.indexOf(removePlayer), 1);
};

Game.saltar=function(data){
	
	player.preso=true;
	this.preso=true;
	player.reset(data.x, data.y);
};
Game.resetear=function(data) {
	var movePlayer=findplayerbyid(data.id);
	movePlayer.player.reset(data.x, data.y);
};


// search through food list to find the food object
function finditembyid (id) {
	for (var i = 0; i < food_pickup.length; i++) {
		if (food_pickup[i].id == id) {
			return food_pickup[i]; 
		}
	}
	return false; 
};

Game.render=function(){
		game.debug.text(game.time.fps, 2, 14, "#00ff00");
};

//create leader board in here.
function createLeaderBoard() {
	var leaderBox = game.add.graphics(game.width * 0.81, game.height * 0.05);
	leaderBox.fixedToCamera = true;
	// draw a rectangle
	leaderBox.beginFill(0xD3D3D3, 0.3);
    leaderBox.lineStyle(2, 0x202226, 1);
    leaderBox.drawRect(0, 0, 250, 400);
	
	var style = { font: "13px Press Start 2P", fill: "white", align: "left", fontSize: '18px'}; //por ahora white, ver
	
	leader_text = game.add.text(10, 10, " ", style);
	leader_text.anchor.set(0);

	leaderBox.addChild(leader_text);
}

//leader board
Game.lbupdate=function(data) {
	//this is the final board string.
	var board_string = ""; 
	var maxlen = 10;
	var maxPlayerDisplay = 10;
	var mainPlayerShown = false;


		if(leader_text!=null){
			for (var i = 0;  i < data.length; i++) {
				//if the player's rank is very low, we display maxPlayerDisplay - 1 names in the leaderboard
				// and then add three dots at the end, and show player's rank.
				if (!mainPlayerShown && i >= maxPlayerDisplay - 1 && socket.id == data[i].id) {
					board_string = board_string.concat(".\n");
					board_string = board_string.concat(".\n");
					board_string = board_string.concat(".\n");
					mainPlayerShown = true;
				}
				//here we are checking if user id is greater than 10 characters, if it is 
				//it is too long, so we're going to trim it.
				if (data[i].username.length >= 10) {
					var username = data[i].username;
					var temp = ""; 
					for (var j = 0; j < maxlen; j++) {
						temp += username[j];
					}
					temp += "...";
					username = temp;
					//change to player username instead of id.
					board_string = board_string.concat(i + 1,": ");
					board_string = board_string.concat(username," ",(data[i].puntos).toString() + "\n");
				}else{
					board_string = board_string.concat(i + 1,": ");
					board_string = board_string.concat(data[i].username," ",(data[i].puntos).toString() + "\n");
				}
			}
			//console.log(board_string);
			ranking=board_string;
			leader_text.setText(board_string); 
		}

}


function mostrarCartel(ganadores){
	game.state.start('fin',true,false, ganadores );
	Client.terminarJuego();
	listo=false;
	bandlev=0;
	score=0;
}

function eliminarLocal(data){
	player.body=null;
	player.destroy();
	this.player.body=null;
	this.player.destroy();

}