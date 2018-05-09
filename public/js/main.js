//this is just configuring a screen size to fit the game properly
//to the browser
//canvas_width = window.innerWidth * window.devicePixelRatio; 
//canvas_height = window.innerHeight * window.devicePixelRatio;
/*
new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');*/
// var game = new Phaser.Game(1200,1000,window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,24*48, 17*48,/*canvas_width, canvas_height 
// 	Phaser.CANVAS, document.getElementById('game'),null, true);
//  game.state.add('Game',Game);
//  game.state.start('Game');
	

	canvas_width = window.innerWidth * window.devicePixelRatio;
	canvas_height = window.innerHeight * window.devicePixelRatio;

	game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS, document.getElementById('game'),null, true );
	//game.state.start('Game');
	game.state.add('login', login);
	game.state.add('Game',Game);
//	game.state.add('main', main);
	 game.state.start('login'); 
	// game.state.start('main');
	// var main = function(game){
	// };
	

