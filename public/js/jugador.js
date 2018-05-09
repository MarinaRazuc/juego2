Jugador=function(data, game, player, that){
	
	that.id_jugador=data.id;
	that.color_jugador=data.color;
    // var player = players.create(bounds.randomX, bounds.randomY, color_jugador);
	that.player = game.add.sprite(1200, 300, that.color_jugador); 
	that.game.physics.p2.enable(that.player, Phaser.Physics.p2);
    that.player.body.setCircle(16);
	//player.body.collideWorldBounds = true;
	// player.body.data.shapes[0].sensor = true;
	that.player.type = "player_body"; //necesario para las colisiones
	//camera follow
	that.game.camera.follow(that.player, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.5);	
	that.player.body.onBeginContact.add(player_coll, that);

	update=function(){
		if(data.color=="grey_player" ||data.color=="black_player"){
				

		}
	}

	return that.player;
	
}