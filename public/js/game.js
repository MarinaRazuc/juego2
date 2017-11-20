
var speed = 80;
var score = 0;
var scoreText;
var Game={};

//the enemy player list 
var enemies = [];

//No obligatorio, pero útil, ya que mantendrá al juego reactivo a los mensajes del servidor 
//incluso cuando la ventana del juego no esté en foco 
Game.init=function(){
	game.stage.disableVisibilityChange=false;//estaba en true
};

 Game.preload=function(){
		//game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		//game.world.setBounds(0, 0, gameProperties.gameWidth, gameProperties.gameHeight, false, false, false, false);
		//game.physics.p2.setBoundsToWorld(false, false, false, false, false)
		//game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.gravity.y = 0;
		game.physics.p2.applyGravity = false; 
		game.physics.p2.enableBody(game.physics.p2.walls, true);//estaba en false
};

  

Game.create=function() {
	var width = this.game.width;
    var height = this.game.height;
	// para trackear a los jugadores
    Game.playerMap={};
    Game.scores={};
    Game.foodMap={};
	//Make the world larger than the actual canvas
    this.game.world.setBounds(-100, -100, 2000, 2000);

   
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
	/*if(player!=null){
		player.position.x=data.x;
		player.position.y=data.y;
	}*/
	if (!movePlayer) {return;}
	var newPointer = {
		x: data.x,
		y: data.y, 
		worldX: data.x,
		worldY: data.y, 
	}

	var distance = distanceToPointer(movePlayer.player , newPointer);
	speed = distance/0.05;
	movePlayer.rotation = movetoPointer(movePlayer.player , speed, newPointer);
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
	console.log("remote_player: ", id);
	this.x = startx; 
	this.y = starty; 
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id; 
	this.angle = startAngle;
	this.player = game.add.graphics(this.x , this.y);
	this.player.radius = startSize;

	// set a fill and line style
	this.player.beginFill(color);
//	console.log("id: ",id," x: ",startx, " y: ",starty);
	this.player.lineStyle(2, color, 1);
//	this.player.drawCircle(startx, starty, this.player.radius * 2);
	this.player.drawCircle(0,0, this.player.radius * 2);
	this.player.endFill();
	this.player.anchor.setTo(0.5,0.5);

	this.initial_size = startSize;

	this.player.body_size = this.player.radius; 
	
	this.player.type = "player_body";
	this.player.id = this.id;

	this.initial_size=startSize;
	// draw a shape
	game.physics.p2.enableBody(this.player, true);
	this.player.body.clearShapes();
	this.player.body_size = this.player.radius; 
	this.player.type = "player_body";
	this.player.id = this.id;
	this.player.body.addCircle(this.player.body_size, 0 , 0); 
	this.player.body.data.shapes[0].sensor = true;
}

Game.create_player=function(data){

	player = game.add.graphics(0,0);
	//player = game.add.graphics(data.x , data.y);
	player.radius = 60;

	player.beginFill(data.color); //especifico el color con el cual se va a dibujar mi circulo
	player.lineStyle(2, data.color, 1);
	//player.drawCircle(data.x, data.y, player.radius*2);
	player.drawCircle(0, 0, player.radius*2);
	player.endFill();
	player.anchor.setTo(0.5,0.5);
	player.body_size = player.radius; 
	player.initial_size = player.radius;

	player.type = "player_body";
	game.physics.p2.enableBody(player, true);
	player.body.clearShapes();
	
//	player.body.addCircle(player.body_size, data.x , data.y);
	player.body.addCircle(player.body_size, 0 , 0);
	/*
	player.x = data.x;  
	player.y = data.y;  */
	//player is the unique socket id. We use it as a unique name for enemy
	player.id = data.id; 
	player.body.data.shapes[0].sensor = true;
	player.body.data.sensor=true;
//	player.body.onBeginContact.add(player_coll, this); 
	
	//camera follow
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);
}


