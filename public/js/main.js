

canvas_width = window.innerWidth * window.devicePixelRatio;
canvas_height = window.innerHeight * window.devicePixelRatio;

game = new Phaser.Game(canvas_width,canvas_height, Phaser.CANVAS, document.getElementById('game'),null, true );

game.state.add('Game',Game);
game.state.add('login', login);
game.state.add('fin', fin);
game.state.start('login'); 
	

