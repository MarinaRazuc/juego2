//var width = 1400;
//var height = 1000;
var player;
var violet_food, orange_food, green_food, blue_food, red_food, pink_food, yellow_food;
var cursors;
var speed = 80;
var score = 0;
var scoreText;
var Keys=Phaser.keyboard;
var comida;
var jugadores=0;
var scaleRatio = window.devicePixelRatio / 3;

var Game={};

//the enemy player list 
var enemies = [];

//No obligatorio, pero útil, ya que mantendrá al juego reactivo a los mensajes del servidor 
//incluso cuando la ventana del juego no esté en foco 
Game.init=function(){
	game.stage.disableVisibilityChange=true;//estaba en true
};


 Game.preload=function(){
	

};

  

Game.create=function() {
	var width = this.game.width;
    var height = this.game.height;
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.startSystem(Phaser.Physics.P2JS);
	// para trackear a los jugadores
    Game.playerMap={};
    Game.scores={};
    Game.foodMap={};

	//Make the world larger than the actual canvas
    this.game.world.setBounds(-100, -100, 2000, 2000);

 	Client.askNewPlayer(); 
};

Game.update=function(){

/*	for(i=0; i<7; i++){
		if(Game.playerMap[i]!=null){
			switch(i){
				case 6:{
					game.physics.arcade.overlap(Game.playerMap[6], pink_food, eatFood); //Game.playerMap[6]
					break;
				}case 5:{
					game.physics.arcade.overlap(Game.playerMap[5], blue_food, eatFood);
					break;
				}case 4:{
					game.physics.arcade.overlap(Game.playerMap[4], green_food, eatFood);
					break;
				}case 3:{
					game.physics.arcade.overlap(Game.playerMap[3], red_food, eatFood);
					break;
				}case 2:{
					game.physics.arcade.overlap(Game.playerMap[2], yellow_food, eatFood);
					break;
				}case 1:{
					game.physics.arcade.overlap(Game.playerMap[1], violet_food, eatFood);
					break;
				}case 0:{
					game.physics.arcade.overlap(Game.playerMap[0], orange_food, eatFood);
					break;
				}
			}
		}
	}*/

	Client.moverJugador(game.input.mousePointer);	
};

//el jugador se mueve en el mapa
Game.movePlayer=function(id,x,y){
	
	var player=Game.playerMap[id]; //línea que no permite que los jugadores se pisen
	this.game.camera.follow(player);
	
	if(player!=null){
		if(game.physics.arcade.distanceToPointer(game.input.activePointer)>5){
			//  The maxTime parameter lets you control how fast it will arrive at the Pointer coords
			game.physics.arcade.moveToPointer(player, 200);
		}else{
			player.body.velocity.set(0);
		}
		var XX = player.x;
		var YY = player.y;
	
		//Client.emitMovement({id, XX, YY});   	
	}else{
		
	}

};

Game.actualizarPos=function(id, x, y){
	var moveplayer=Game.playerMap[id]; //problemas --> cannot read property 'id' of undefined
	//pos llegan perfecto, no se como asignarlas ni a que
/*	if(moveplayer!=null){
		moveplayer.x=x;
		moveplayer.y=y;
	}*/
	if(moveplayer!=null){
		moveplayer.position.x=x;
		moveplayer.position.y=y;
	}
};

/* Crea un nuevo sprite en las coordenadas especificadas, y almacena el correspondiente objeto sprite
	en un arreglo asociativo declarado en Game.create(), con el id dado como la clave (key).
	Esto permite acceder fácilmente al sprite correspondiente a un jugador específico, 
	por ej cuando necesitamos moverlo o removerlo.*/
Game.addNewPlayer=function(id,x,y, banderin){
	var width, height;
	width = this.game.width;
	height=this.game.height;
	
	var color/*,player*/;
	var a;
	var b;
 
	switch(id){
		case 0: {	color='orange_player';
					orange_food = game.add.group();
					
					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						orange_food.create(width*a, height*b, 'orange_food');
						//Client.setFood({id, width*a, height*b});
					}

					for (var i in orange_food.children) {
						orange_food.children[i].anchor.set(0.3);
					}

					game.physics.arcade.enable(orange_food, Phaser.Physics.arcade);
					
					Game.foodMap[id]=orange_food;//Uncaught TypeError: Cannot set property '0' of undefined

					break;
				}
		case 1: {	color='violet_player';
					violet_food = game.add.group();

					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						violet_food.create(width*a, height*b, 'violet_food');
					}

					for (var i in violet_food.children) {
						violet_food.children[i].anchor.set(0.3);
					}

					game.physics.arcade.enable(violet_food, Phaser.Physics.arcade);
					break;
				}
		case 2: {	color='yellow_player';
					yellow_food = game.add.group();

					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						yellow_food.create(width*a, height*b, 'yellow_food');
					}
					
					for (var i in yellow_food.children) {
						yellow_food.children[i].anchor.set(0.3);
					}

					game.physics.arcade.enable(yellow_food, Phaser.Physics.arcade);
	
					break;
				}
		case 3: {	color='red_player';
					red_food = game.add.group();

					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						red_food.create(width*a, height*b, 'red_food');
						
					}

					for (var i in red_food.children) {
						red_food.children[i].anchor.set(0.3);
					}

					game.physics.arcade.enable(red_food, Phaser.Physics.arcade);
	
					break;
				}
		case 4: {	color='green_player';
					green_food = game.add.group();
					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						green_food.create(width*a, height*b, 'green_food');
						
					}
				
					for (var i in green_food.children) {
						green_food.children[i].anchor.set(0.3);
					}

					game.physics.arcade.enable(green_food, Phaser.Physics.arcade);
					break;
				}
		case 5: {	color='blue_player';
					blue_food = game.add.group();
					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						blue_food.create(width*a, height*b, 'blue_food');
						
					}
				
					for (var i in blue_food.children) {
						blue_food.children[i].anchor.set(0.3);
						//podria ser random 
					}

					game.physics.arcade.enable(blue_food, Phaser.Physics.arcade);
					break;
				}
		case 6: {	color='pink_player';
					pink_food = game.add.group();

					for (var i = 0; i < 60; i++) {
						a=Math.random(2);
						b=Math.random(2);
						pink_food.create(width*a, height*b, 'pink_food');
						
					}
					for (var i in pink_food.children) {
						pink_food.children[i].anchor.set(0.3);
						//podria ser random 
					}

					game.physics.arcade.enable(pink_food, Phaser.Physics.arcade);
					break;
				}
	}
	player = game.add.sprite(x, y, color); //game.world.randomX, game.world.randomY
 	Game.playerMap[id]=player;
//set anchor point to center of the sprite
	player.anchor.setTo(0.5, 0.5);
//enable physics for the player body
	game.physics.arcade.enable(player, Phaser.Physics.arcade);
//make the player collide with the bounds of the world
	player.body.collideWorldBounds = true;
	//player.scale.setTo(scaleRatio, scaleRatio); //queda muy peque
//place score text on the screen
	scoreText = game.add.text(5, 3, score); 
	scoreText.fixedToCamera=true;
//game.camera.follow(player);7
		
 	//enemies.push(player);

	 player.position = new Phaser.Point(player.x, player.y);

}

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
    var player=Game.playerMap[id].destroy();
    delete Game.playerMap[id];
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

	if (!movePlayer) {
		return;
	}
	
	var newPointer = {
		x: data.x,
		y: data.y, 
		worldX: data.x,
		worldY: data.y, 
	}

	var distance = distanceToPointer(movePlayer.player , newPointer);
	speed = distance/0.05;
	
	movePlayer.fixedRotation = movetoPointer(movePlayer.player , speed, newPointer);
};

//we're receiving the calculated position from the server and changing the player position
Game.onInputRecieved=function(data) {
	var player=findplayerbyid(data.id);
	//we're forming a new pointer with the new position
	
	if(player==null)
		return;

	var newPointer = {
		x: data.x,
		y: data.y, 
		worldX: data.x,
		worldY: data.y, 
	}
	
	var distance = distanceToPointer(player.player, newPointer);
	//we're receiving player position every 50ms. We're interpolating 
	//between the current position and the new position so that player
	//does jerk. 
	speed = distance/0.05;
	
	//move to the new position. 
	player.fixedRotation = movetoPointer(player.player, speed, newPointer);
}

//This is where we use the socket id. 
//Search through enemies list to find the right enemy of the id.
function findplayerbyid (id) {
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].id == id) {
			return enemies[i]; 
		}
	}
}

//Server will tell us when a new enemy player connects to the server.
//We create a new enemy in our game.
Game.onNewPlayer= function  (data) {
	//enemy object 
	var new_enemy = new remote_player(data.id, data.x, data.y, data.color); 
	enemies.push(new_enemy);
}

var remote_player = function (id, startx, starty, color) {
	this.x = startx; 
	this.y = starty;
	//this is the unique socket id. We use it as a unique name for enemy
	this.id = id;
	this.player = game.add.graphics(this.x , this.y);
	this.player.radius = 30;

	// set a fill and line style
	this.player.beginFill(color);
	console.log("id: "+id," x: "+startx, " y: "+starty);
	//this.player.lineStyle(2, 0xffd900, 1);
	this.player.drawCircle(startx, starty, this.player.radius * 2);
	this.player.endFill();
	this.player.anchor.setTo(0.5,0.5);
	this.player.body_size = this.player.radius; 

	// draw a shape
	game.physics.p2.enableBody(this.player, true);
	 this.player.body.clearShapes();
	// this.player.body.addCircle(this.player.body_size, 0 , 0); 
	// this.player.body.data.shapes[0].sensor = true;
}

