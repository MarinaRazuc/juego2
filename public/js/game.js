//********************I
var ship;
var cursors;
var customBounds;
//********************F

var players;//yo


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

var violet_food, orange_food, green_food, blue_food, red_food, pink_food, yellow_food;
// var game = new Phaser.Game(1200,1000,window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,/*24*48, 17*48,/*canvas_width, canvas_height 
// 	Phaser.CANVAS, document.getElementById('game'),null, true);

//the enemy player list 
var enemies = [];
var food_pickup=[];
var customBounds;
//No obligatorio, pero útil, ya que mantendrá al juego reactivo a los mensajes del servidor 
//incluso cuando la ventana del juego no esté en foco 
Game.init=function(){
	game.stage.disableVisibilityChange=true;//estaba en true
};

 Game.preload=function(){
		//game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		//game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
		//game.physics.p2.setBoundsToWorld(false, false, false, false, false)
		//game.physics.startSystem(Phaser.Physics.ARCADE);
		game.load.image("background", "assets/fondo_9.jpg");            
		game.load.image('violet_player', '/assets/circulo_violeta.png');
		game.load.image('orange_player', '/assets/circulo_naranja.png');
		game.load.image('red_player', '/assets/circulo_rojo.png');
		game.load.image('blue_player', '/assets/circulo_azul.png');
		game.load.image('green_player', '/assets/circulo_verde.png');
		game.load.image('pink_player', '/assets/circulo_rosa.png');
		game.load.image('yellow_player', '/assets/circulo_amarillo.png');

		game.load.image('violet_player_food', '/assets/banderinVioleta2.png');
		game.load.image('orange_player_food', '/assets/banderinNaranja2.png');
		game.load.image('blue_player_food', '/assets/banderinAzul2.png');
		game.load.image('yellow_player_food', '/assets/banderinAmarillo2.png');
		game.load.image('green_player_food', '/assets/banderinVerde2.png');
		game.load.image('pink_player_food', '/assets/banderinRosa2.png');
		game.load.image('red_player_food', '/assets/banderinRojo2.png');

		game.load.image('ship', '/assets/blue-square.png', 32, 32);
    	game.load.image('ball', '/assets/comida_rosa.png');
		
		//game.load.tilemap('map', '/assets/collision.json', null, Phaser.Tilemap.TILED_JSON);
};

  

Game.create=function() {

	game.world.setBounds(0, 0, 2000, 2000);
//*******************************************************I
	//  The bounds of our physics simulation
    var bounds = new Phaser.Rectangle(300, 300, 600, 600);
//*******************************************************F

	game.physics.startSystem(Phaser.Physics.P2JS);

//******************************************************I	
	// Make things a bit more bouncey
	game.physics.p2.restitution = 0.9;
//******************************************************F	
	game.physics.p2.gravity.y = 0;
	game.physics.p2.applyGravity = false; 
	game.physics.p2.enableBody(game.physics.p2.walls, true);//estaba en false
	var width = this.game.width;
    var height = this.game.height;
	// para trackear a los jugadores
    Game.playerMap={};
//    Game.add.sprite(0, 0, 'background');

    Game.scores={};
//****************************************************I
//  Some balls to collide with
    balls = game.add.physicsGroup(Phaser.Physics.P2JS);

    players=game.add.physicsGroup(Phaser.Physics.P2JS);//YO

    for (var i = 0; i < 20; i++)
    {
        var ball = balls.create(bounds.randomX, bounds.randomY, 'ball');
        ball.body.setCircle(16);
    }

    ship = game.add.sprite(bounds.centerX, bounds.centerY, 'ship');
    ship.scale.set(2);
    ship.smoothed = false;
    ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ship.play('fly');

    //  Create our physics body. A circle assigned the playerCollisionGroup
    game.physics.p2.enable(ship);

    ship.body.setCircle(28);

    //  Create a new custom sized bounds, within the world bounds
    customBounds = { left: null, right: null, top: null, bottom: null };

    createPreviewBounds(bounds.x, bounds.y, bounds.width, bounds.height);

    //  Just to display the bounds
    var graphics = game.add.graphics(bounds.x, bounds.y);
    graphics.lineStyle(4, 0xffd900, 1);
    graphics.drawRect(0, 0, bounds.width, bounds.height);

    cursors = game.input.keyboard.createCursorKeys();

//****************************************************F

 	Client.askNewPlayer(); 
};

Game.update=function(){
	ship.body.setZeroVelocity();

    if (cursors.left.isDown){
        ship.body.moveLeft(200);
    }else if (cursors.right.isDown){
        ship.body.moveRight(200);
    }

    if(cursors.up.isDown){
        ship.body.moveUp(200);
    }else if (cursors.down.isDown){
        ship.body.moveDown(200);
    }
	Client.moverJugador(game.input.mousePointer);
};

//eatFood function
// function eatFood(id, food) {
// 	//remove the piece of food
// 	food.kill();
// 	//update the score
// 	score++;
// 	scoreText.text = score;
// 	Game.scores[id]=scoreText;
// }
 
Game.removePlayer=function(id){
    // var player=Game.playerMap[id].destroy();
    // delete Game.playerMap[id];
  	//  delete Game.food[id];
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
	 
//	var distance = distanceToPointer(player.player, newPointer);
	var distance = distanceToPointer(player, newPointer);
	//we're receiving player position every 50ms. We're interpolating 
	//between the current position and the new position so that player
	//does jerk. 
	speed = distance/0.05;
	//move to the new position. 
	player.rotation = movetoPointer(player, speed, newPointer);

//	console.log("Mi posición: ",player.x," ", player.y);
	document.getElementById("MiPos").innerHTML="Mi posición: "+player.x+" "+player.y;

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
	//enemy object 

	var new_enemy = new remote_player(data.id, data.x, data.y, data.color, data.size, data.angle); 
	enemies.push(new_enemy);
	 
};




//clase enemiga
var remote_player = function(id, startx, starty, color, startSize, startAngle){
	this.x = startx; 
	this.y = starty; 
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id; 
	this.angle = startAngle;
	this.player=game.add.sprite(this.x, this.y, color);
	this.player.type = "player_body"; //para colisiones
	game.physics.p2.enable(player, Phaser.Physics.p2);
	game.physics.p2.enableBody(this.player, true);
	this.player.body.clearShapes();
	
	var jugador = players.create(this.x, this.y, color);//yo
    jugador.body.setCircle(16);//yo
}	


Game.create_player=function(data){
	id_jugador=data.id;
	color_jugador=data.color;
	player = game.add.sprite(0, 0, color_jugador); 
	game.physics.p2.enable(player, Phaser.Physics.p2);
	player.body.collideWorldBounds = true;
	player.body.data.shapes[0].sensor = true;

	player.type = "player_body"; //necesario para las colisiones
	//camera follow
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);					
	
	player.body.onBeginContact.add(player_coll, this); 
};


Game.onItemUpdate=function(datos){
	//console.log(datos);
	//console.log(datos.id);
	var nuevo_banderin=new food_object(datos.id, datos.type, datos.x, datos.y);
	food_pickup.push(nuevo_banderin);
};



// the food class
var food_object = function (id, type, startx, starty) {
	//generated in the server with node-uuid
	this.id = id; 
//	console.log(this.id);
	//positinon of the food
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

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------------------------------------------
//las sgtes funciones todavia no fueron muy analizadas

// function called when food needs to be removed in the client. 
Game.onItemRemove=function(data) {
	
	var removeItem; 
	removeItem = finditembyid(data.id);
	food_pickup.splice(food_pickup.indexOf(removeItem), 1); 
	
	//destroy the phaser object 
	removeItem.item.destroy(true,false); //Cannot read property 'destroy' of undefined
}


function player_coll (body, bodyB, shapeA, shapeB, equation) {

	var key_player=player.key; 
	
	if(body!=null){
		
		//the id of the collided body that player made contact with 
		var key=body.data.parent.sprite.body.sprite.body.sprite.id;

		//the type of the body the player made contact with 
		var type = body.type; 
		
		// console.log("body ", body);
		// console.log("key de body ", key);
		// console.log("bodyB ", bodyB);

		var tipobody=body.sprite.key; //comida
		var tipobodyB=bodyB.parent.sprite.key; //jugador

		// console.log("tipobodyB ", tipobodyB);
		// console.log("tipobody ", tipobody);

		if((key_player=="orange_player" && tipobody=="orange_player_food")||
			(key_player=="red_player" && tipobody=="red_player_food")||
			(key_player=="yellow_player" && tipobody=="yellow_player_food")||
			(key_player=="green_player" && tipobody=="green_player_food")||
			(key_player=="pink_player" && tipobody=="pink_player_food")||
			(key_player=="blue_player" && tipobody=="blue_player_food")||
			(key_player=="violet_player" && tipobody=="violet_player_food")){
		
			score=score+1;
			Client.levantarBanderin({id:key}); 
			document.getElementById("score").innerHTML="Banderines: "+score;
		}


		// if (type == "player_body") { //CAPAZ Q EL TIPO ES DISTINTO, VER MAS ADELANTE
		// 	//send the player collision
		// 	//ACA VER COMO HACER CUANDO CHOCA CON UN POLICIA
		// 	//socket.emit('player_collision', {id: key}); 
		// } else if (type == "food_body") {

		// 	console.log("items food");
		// 	Client.levantarBanderin({id:key});
		// 	//socket.emit('item_picked', {id: key}); 
		// }
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

//******************************************************I
function createPreviewBounds(x, y, w, h) {
    var sim = game.physics.p2;
    //  If you want to use your own collision group then set it here and un-comment the lines below
    var mask = sim.boundsCollisionGroup.mask;
    customBounds.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
    customBounds.left.addShape(new p2.Plane());
    // customBounds.left.shapes[0].collisionGroup = mask;
    customBounds.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
    customBounds.right.addShape(new p2.Plane());
    // customBounds.right.shapes[0].collisionGroup = mask;
    customBounds.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
    customBounds.top.addShape(new p2.Plane());
    // customBounds.top.shapes[0].collisionGroup = mask;
    customBounds.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
    customBounds.bottom.addShape(new p2.Plane());
    // customBounds.bottom.shapes[0].collisionGroup = mask;
    sim.world.addBody(customBounds.left);
    sim.world.addBody(customBounds.right);
    sim.world.addBody(customBounds.top);
    sim.world.addBody(customBounds.bottom);
}

//*******************************************************F