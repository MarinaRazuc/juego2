
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

		game.load.image('violet_food', '/assets/comida_violeta.png');
		game.load.image('orange_food', '/assets/comida_naranja.png');
		game.load.image('blue_food', '/assets/comida_azul.png');
		game.load.image('yellow_food', '/assets/comida_amarilla.png');
		game.load.image('green_food', '/assets/comida_verde.png');
		game.load.image('pink_food', '/assets/comida_rosa.png');
		game.load.image('red_food', '/assets/comida_roja.png');

};

  

Game.create=function() {
	game.world.setBounds(0, 0, 1600, 1200);
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.gravity.y = 0;
	game.physics.p2.applyGravity = false; 
	game.physics.p2.enableBody(game.physics.p2.walls, true);//estaba en false
	var width = this.game.width;
    var height = this.game.height;
	// para trackear a los jugadores
    Game.playerMap={};
    Game.add.sprite(0, 0, 'background');

    Game.scores={};
    Game.foodMap={};
	//Make the world larger than the actual canvas
	

 	Client.askNewPlayer(); 
};

Game.update=function(){
	Client.moverJugador(game.input.mousePointer);
};

//eatFood function
function eatFood(id, food) {
	//remove the piece of food
	food.kill();
	//update the score
	score++;
	scoreText.text = score;
	Game.scores[id]=scoreText;
}
 
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
	movePlayer.rotation = movetoPointer(movePlayer.player , speed, newPointer);

	document.getElementById("PosEne").innerHTML="Enemigo : "+data.x+" "+data.y;

};


//we're receiving the calculated position from the server and changing the player position
Game.onInputRecieved=function(data) {

	// if(game.physics.arcade.distanceToPointer(game.input.activePointer)>5){
	// 		//  The maxTime parameter lets you control how fast it will arrive at the Pointer coords
	// 		game.physics.arcade.moveToPointer(player, 200);
	// }else{
	// 	player.body.velocity.set(0);
	// }

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
	// console.log("remote_player: ", id);
	// console.log("color: ", color);
	// console.log("x e y: ", startx, " ", starty);
	// console.log();


	this.x = startx; 
	this.y = starty; 
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id; 
	this.angle = startAngle;
	this.player=game.add.sprite(this.x, this.y, color);
//-	this.player = game.add.graphics(this.x , this.y);
//-	this.player.radius = startSize;

	// set a fill and line style
//-	this.player.beginFill(color);
//-	this.player.lineStyle(2, color, 1);
//-	this.player.drawCircle(0,0, this.player.radius * 2);
//-	this.player.endFill();
//-	this.player.anchor.setTo(0.5,0.5);

//-	this.initial_size = startSize;

//-	this.player.body_size = this.player.radius; 
	
	this.player.type = "player_body"; //para colisiones
//-	this.player.id = this.id;

//-	this.initial_size=startSize;
	game.physics.p2.enable(player, Phaser.Physics.p2);
//-	game.physics.p2.enableBody(this.player, true);
//-	this.player.body.clearShapes();
//-	this.player.body.addCircle(this.player.body_size, 0 , 0); 
//-	this.player.body.data.shapes[0].sensor = true;


}



Game.create_player=function(data){
	id_jugador=data.id;
	color_jugador=data.color
	player = game.add.sprite(0, 0, color_jugador); 
	game.physics.p2.enable(player, Phaser.Physics.p2);
	player.body.collideWorldBounds = true;
	console.log("color_jugador es:",color_jugador);
	// player = game.add.graphics(data.x , data.y);
	// player.radius = 30;

	// player.beginFill(data.color); //especifico el color con el cual se va a dibujar mi circulo
	// player.lineStyle(2, data.color, 1);
	// player.drawCircle(data.x, data.y, player.radius*2);
	// //player.drawCircle(0, 0, player.radius*2);
	// player.endFill();
	// //player.anchor.setTo(0.5,0.5);
	// player.body_size = player.radius; 
	// //player.initial_size = player.radius;

	player.type = "player_body"; //necesario para las colisiones

	// game.physics.p2.enableBody(player, true);
	// player.body.clearShapes();
	
	// player.body.addCircle(player.body_size, data.x , data.y);
	// //player.body.addCircle(player.body_size, 0 , 0);
	// /*
	// player.x = data.x;  
	// player.y = data.y;  */
	// //player is the unique socket id. We use it as a unique name for enemy
	// player.id = data.id; 
	// player.body.data.shapes[0].sensor = true;
	// player.body.data.sensor=true;
//	player.body.onBeginContact.add(player_coll, this); 
//	player.body.collideWorldBounds=true;
//camera follow
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);					
	//console.log(player);

	Client.crearComida(color_jugador);

}


Game.onItemUpdate=function(datos){
	nuevo_banderin=new food_object(datos.id, datos.type, datos.x, datos.y);
	food_pickup.push(nuevo_banderin);
}


// the food class
var food_object = function (id, type, startx, starty, value) {
	// unique id for the food.
	//generated in the server with node-uuid
	this.id = id; 
	
	//positinon of the food
	this.posx = startx;  
	this.posy = starty; 
	this.powerup = value;
	console.log("food_object");
	console.log(startx, ", ", starty);
	//create a circulr phaser object for food
	this.item = game.add.graphics(this.posx, this.posy);
	this.item.beginFill(0xFFFFFF);
	this.item.lineStyle(2, 0xFF0000, 1);
	this.item.drawCircle(startx, starty, 20);

//	this.item.type = 'food_body';
	this.item.type=type;
	this.item.id = id;
	
	game.physics.p2.enableBody(this.item, true);
	this.item.body.clearShapes();
	this.item.body_size = 10; 
	this.item.body.addCircle(this.item.body_size, 0, 0);
	this.item.body.data.gravityScale = 0;
	this.item.body.data.shapes[0].sensor = true;

}

function render(){}

