//********************I
var ship;
var cursors;
var customBounds;
var map;
var layer,layer2;
var username;
var leader_text;

var gameProperties = { 
	gameWidth: 4000,
	gameHeight: 4000,
	game_elemnt: "gameDiv",
	in_game: false,
};
//********************F

var players;//yo
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
// var game = new Phaser.Game(1200,1000,window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,/*24*48, 17*48,/*canvas_width, canvas_height 
// 	Phaser.CANVAS, document.getElementById('game'),null, true);

//the enemy player list 
var enemies = [];
var food_pickup=[];
var customBounds;
var USERNAME;
var test;
var paredes;
var spriteMaterial;
var worldMaterial;
var playerCollisionGroup;
var prisonCollisionGroup;

//No obligatorio, pero útil, ya que mantendrá al juego reactivo a los mensajes del servidor 
//incluso cuando la ventana del juego no esté en foco 
Game.init=function(username, tipo){
	USERNAME=username;
	TIPO_J=tipo;
	console.log("username ", USERNAME);
	console.log("tipo ", TIPO_J);
	game.stage.disableVisibilityChange=true;//estaba en true
};


Game.preload=function(){
		game.load.tilemap('mapa', '/assets/mapa_4.json', null, Phaser.Tilemap.TILED_JSON);
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

		game.load.image('pared', '/assets/castleCenter.png');
		game.load.image("prison", "/assets/prison_2.png");
}

Game.create=function() {
	//game.world.setBounds(0, 0, 2000, 2000);
	map = game.add.tilemap('mapa');
	map.addTilesetImage('castle_tileset_part3', 'tiles');
	map.addTilesetImage('PathAndObjects', 'tiles');
	 var bounds = new Phaser.Rectangle(200, 200, 400, 400);
	//Capa_3 = map.createLayer('Capa_3');
	Capa_1 = map.createLayer('Capa_1');
	//Capa_2 = map.createLayer('Capa_2');

	Capa_1.resizeWorld();
	game.physics.startSystem(Phaser.Physics.P2JS);

	game.physics.p2.setImpactEvents(true);
   // Make things a bit more bouncey
	game.physics.p2.restitution = 0.3;	
	 //  Create our collision groups. One for the player, one for the pandas (prision)
    // playerCollisionGroup = game.physics.p2.createCollisionGroup();
    // prisonCollisionGroup = game.physics.p2.createCollisionGroup();
    // //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

	game.physics.p2.gravity.y = 0;
	game.physics.p2.applyGravity = false; 
	game.physics.p2.enableBody(game.physics.p2.walls, true);//estaba en false
	var width = this.game.width;
    var height = this.game.height;

	// para trackear a los jugadores
    Game.playerMap={};
    // customBounds = { left: null, right: null, top: null, bottom: null };
    // createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);
    //  //  Just to display the bounds
    // var graphics = game.add.graphics(bounds.x, bounds.y);
    // graphics.lineStyle(4, 0xffd900, 1);
    // graphics.drawRect(0, 0, bounds.width, bounds.height);
    //COMENTADO POR AHORA
    var prison=game.add.sprite(450,368,"prison");
    game.physics.p2.enable(prison, Phaser.Physics.p2);
   	prison.body.data.shapes[0].sensor=true;
    prison.type="pared";
    prison.body.type="pared";
 	
 	// worldMaterial = game.physics.p2.createMaterial('worldMaterial');
 	// prisonMaterial=game.physics.p2.createMaterial('prisonMaterial', prison.body);
  //   game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.
    //  A single material can be used by as many different sprites as you like.

    // var grupoprision = game.add.group();
    // grupoprision.enableBody = true;
    // grupoprision.physicsBodyType = Phaser.Physics.P2JS;
    
    // var posicionX, posicionY;
    // posicionX=[];
    // posicionY=[];
    // posicionX[1]=200; posicionY[1]=200;
    // posicionX[2]=300; posicionY[2]=200;
    // posicionX[3]=400; posicionY[3]=200;
    // posicionX[4]=500; posicionY[4]=200;
    // posicionX[5]=200; posicionY[5]=300;
    // posicionX[6]=500; posicionY[6]=300;
    // posicionX[7]=200; posicionY[7]=400;
    // posicionX[8]=500; posicionY[8]=400;
    // posicionX[9]=200; posicionY[9]=500;
    // posicionX[10]=500; posicionY[10]=500;
  
    
    // for (var i = 0; i <= 10; i++)
    // {
    //     var panda = grupoprision.create(posicionX[i], posicionY[i], 'pared');
    //     panda.body.setRectangle(40, 40);
    //     game.physics.p2.enable(panda, Phaser.Physics.p2);
    //     panda.body.data.shapes[0].sensor=true;
    //     //  Tell the panda to use the pandaCollisionGroup 
    //     panda.body.setCollisionGroup(prisonCollisionGroup);

    //     //  Pandas will collide against themselves and the player
    //     //  If you don't set this they'll not collide with anything.
    //     //  The first parameter is either an array or a single collision group.
    //     panda.body.collides([prisonCollisionGroup, playerCollisionGroup]);
    //     panda.body.kinematic=true;
    // }


	createLeaderBoard();
	Client.askNewPlayer({username: USERNAME, tipo:TIPO_J, x:0, y:0, angle:0}); 


    // var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial);
    // var prisonplayer=game.physics.p2.createContactMaterial(spriteMaterial, prisonMaterial);
    // contactMaterial.friction = 0.3;     // Friction to use in the contact of these two materials.
    // contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    // contactMaterial.stiffness = 1e7;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.relaxation = 3;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.surfaceVelocity = 0;    	
    // prisonplayer.friction = 0.3;     
    // prisonplayer.restitution = 1.0;  
    // prisonplayer.stiffness = 1e7;    
    // prisonplayer.relaxation = 3;     
    // prisonplayer.frictionStiffness = 1e7;    
    // prisonplayer.frictionRelaxation = 3;     
    // prisonplayer.surfaceVelocity = 0;   
};
// function createPreviewBounds(x, y, w, h) {

//     var sim = game.physics.p2;

//     //  If you want to use your own collision group then set it here and un-comment the lines below
//     var mask = sim.boundsCollisionGroup.mask;

//     customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
//     customBounds.left.addShape(new p2.Plane());
//     // customBounds.left.shapes[0].collisionGroup = mask;

//     customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
//     customBounds.right.addShape(new p2.Plane());
//     // customBounds.right.shapes[0].collisionGroup = mask;

//     customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
//     customBounds.top.addShape(new p2.Plane());
//     // customBounds.top.shapes[0].collisionGroup = mask;

//     customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
//     customBounds.bottom.addShape(new p2.Plane());
//     // customBounds.bottom.shapes[0].collisionGroup = mask;

//     sim.world.addBody(customBounds.left);
//    	sim.world.addBody(customBounds.right);
//     sim.world.addBody(customBounds.top);
//     sim.world.addBody(customBounds.bottom);

// }
Game.update=function(){
	if(player){
		if(!player.preso){
			Client.moverJugador(game.input.mousePointer);
		}else{
			console.log("presum");
		}
	}
};

 
Game.removePlayer=function(id){
  	var removePlayer=findplayerbyid(id);
	// Player not found
	if (!removePlayer) {
		//console.log('Player not found: ', data.id)
		return;
	}
 	removePlayer.player.destroy();
   	enemies.splice(enemies.indexOf(removeplayer), 1);
};


//Server tells us there is a new enemy movement. We find the moved enemy and sync the enemy movement with the server
Game.onEnemyMove=function(data) {
	//var movePlayer = Game.playerMap[data.id] ; 
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
	//move to the new position. 
	player.rotation = movetoPointer(player, speed, newPointer);
	var equis=Math.round(player.x);
	var ygriega=Math.round(player.y);
	document.getElementById("MiPos").innerHTML="Mi posición: "+equis+" "+ygriega;
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
	console.log(data.id);
};




//clase enemiga
var remote_player = function(id, startx, starty, color, /*startSize,*/ startAngle, type, preso, puntos, username){
	this.x = startx; 
	this.y = starty; 
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id; 
	this.angle = startAngle;
	this.player=game.add.sprite(this.x, this.y, color);
//	console.log("this.player ", this.player);
	this.player.type = "player_body"; //para colisiones
	console.log("game.physics.p2 ", game.physics.p2);
//	while(!game.physics.p2){console.log("esperando");}
	game.physics.p2.enable(this.player);//, Phaser.Physics.p2);
	//this.game.physics.p2.enableBody(this, true);
	this.player.body.collideWorldBounds = true;
	this.player.body.clearShapes();
	this.player.body.setCircle(16);
	this.player.body.data.shapes[0].sensor = true;
	this.player.id=id;
	this.player.type=type;
	this.player.body.type="player_body";
	this.preso=preso;
	this.puntos=puntos; //????
	// player follow text (set text to username)
	var style = {fill: "black", align: "center", fontSize:'18px'};
	this.player.playertext = game.add.text(0, 0, username , style);
	// add the text to player object to follw as child
	this.player.addChild(this.player.playertext);
	//console.log("this: ",this);
}	


Game.create_player=function(data){ //esto es lo q llama el cliente
	id_jugador=data.id;
	color_jugador=data.color;
	player = game.add.sprite(1200, 300, color_jugador); 
	//player.scale.set(2);
	player.smoothed=false;
	//  Enable if for physics. This creates a default rectangular body.
	game.physics.p2.enable(player, Phaser.Physics.p2);
    player.body.setCircle(16);
	//player.body.fixedRotation = true;
	//player.body.collideWorldBounds = true;
	//player.body.data.shapes[0].sensor = true;
	player.type = "player_body"; //necesario para las colisiones
	player.preso=data.preso;
	player.puntos=data.puntos;
	//camera follow

	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);	
	player.body.onBeginContact.add(player_coll, this); 

	player.body.type="player_body";
	
	// player follow text (set text to username)
	var style = {fill: "white", align: "right", fontSize:'20px'};
	player.playertext = game.add.text(0, 0, data.username , style);
	// add the text to player object to follw as child
	player.addChild(player.playertext);

	//spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
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
	game.physics.p2.enable(this.item, Phaser.Physics.p2);//problemas
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
				this.puntos=this.puntos+1;
				Client.levantarBanderin({id:key}); 
				document.getElementById("score").innerHTML="Banderines: "+score;
				banderin=true;
			}
			//Acá ver colisión entre ladron y poli
			if(!banderin){
				 var key2=body.data.parent.sprite.body.sprite.body.sprite.body.data.id;
				 if((tipobody=="black_player" || tipobody=="grey_player"|| tipobody=="brown_player")&&
				 	(key_player=="orange_player"||key_player=="violet_player"||key_player=="yellow_player"||
				 	key_player=="red_player"||key_player=="blue_player"||key_player=="pink_player"||key_player=="green_player"))
				 	{
				 		//console.log("colision!!");
				 		banderin=true;
				 		Client.colision({key:body.sprite.id});
				 	}
			}
			console.log("tipobody "+tipobody);
			if(tipobody=="prison"){
				var result=[];
				console.log("ME CHOQUE LA PARED");
				// if (game.input.activePointer.x > player.x){
				// 	console.log("UNO");
				// 	player.body.reset(200,200);
				// }else{
				// 	console.log("DOS");
				// 	player.body.reset(500,200);
				// }
				// if (game.input.activePointer.y < player.y){
				// 	console.log("TRES");
				// 	player.body.reset(200,200);
				// }else{
				// 	console.log("CUATRO");
				// 	player.body.reset(500,200);
				// }
			}
		}
	}
};
// When the server notifies us of client disconnection, we find the disconnected
// enemy and remove from our game
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
	demo(data);
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo(data) {
  console.log('Taking a break...');
  //console.log("posicion:: "+player.position.x+", "+player.position.y);
  Client.moverJugador({x:data.x, y:data.y, worldX:data.x, worldY:data.y});
  player.reset(data.x, data.y);
  await sleep(2000);
  console.log(player.position);
 
  player.preso=false;
  console.log('Two second later');
}

// search through food list to find the food object
function finditembyid (id) {
	for (var i = 0; i < food_pickup.length; i++) {
		if (food_pickup[i].id == id) {
			return food_pickup[i]; 
		}
	}
	return false; 
};

function render(){};


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
	console.log(board_string);
	leader_text.setText(board_string); 
}
